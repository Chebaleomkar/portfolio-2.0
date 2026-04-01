import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

/**
 * GET /api/search - Advanced full-text search with relevance scoring
 *
 * Query params:
 *   q: string         - Search query (supports phrases with quotes, negation with -)
 *   tags: string      - Comma-separated tag filter
 *   sort: string      - 'relevance' | 'newest' | 'oldest' (default: relevance)
 *   limit: number     - Results per page (default: 20, max: 50)
 *   page: number      - Page number (default: 1)
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')?.trim() || ''
        const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
        const sortBy = searchParams.get('sort') || 'relevance'
        const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '20')), 50)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))

        if (!query && tags.length === 0) {
            return NextResponse.json({
                success: true,
                results: [],
                total: 0,
                elapsed: 0,
                page: 1,
                totalPages: 0,
            })
        }

        const startTime = Date.now()

        // Build base filter
        const filter: Record<string, unknown> = { published: true }

        if (tags.length > 0) {
            filter.tags = { $in: tags.map(t => new RegExp(`^${escapeRegex(t)}$`, 'i')) }
        }

        let results: any[]
        let total: number

        if (query) {
            // Strategy 1: MongoDB full-text search (uses text index for relevance scoring)
            const textSearchResult = await tryTextSearch(filter, query, sortBy, page, limit)

            if (textSearchResult) {
                results = textSearchResult.results
                total = textSearchResult.total
            } else {
                // Strategy 2: Regex fallback with fuzzy matching
                const regexResult = await regexSearch(filter, query, sortBy, page, limit)
                results = regexResult.results
                total = regexResult.total
            }
        } else {
            // Tag-only search
            const [tagResults, tagTotal] = await Promise.all([
                Blog.find(filter)
                    .sort(sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .select('-__v')
                    .lean(),
                Blog.countDocuments(filter),
            ])
            results = tagResults
            total = tagTotal
        }

        const elapsed = Date.now() - startTime

        // Format results with snippets
        const formattedResults = results.map((post: any) => ({
            _id: post._id.toString(),
            slug: post.slug,
            title: post.title,
            description: post.description || '',
            tags: post.tags || [],
            external: post.external || undefined,
            isStarred: post.isStarred || false,
            createdAt: post.createdAt?.toISOString?.()?.split('T')[0] || '',
            snippet: extractSnippet(post.content || '', query),
            score: post._score || 0,
        }))

        const response = NextResponse.json({
            success: true,
            results: formattedResults,
            total,
            elapsed,
            page,
            totalPages: Math.ceil(total / limit),
        })

        // Short cache for search results
        response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=15')

        return response
    } catch (error) {
        console.error('Search error:', error)
        return NextResponse.json(
            { success: false, error: 'Search failed' },
            { status: 500 }
        )
    }
}

/**
 * Full-text search using MongoDB $text index
 * Returns null if text search is not available or fails
 */
async function tryTextSearch(
    baseFilter: Record<string, unknown>,
    query: string,
    sortBy: string,
    page: number,
    limit: number
): Promise<{ results: any[]; total: number } | null> {
    try {
        const filter = { ...baseFilter, $text: { $search: query } }

        const sortOption =
            sortBy === 'relevance'
                ? { score: { $meta: 'textScore' as const } }
                : sortBy === 'oldest'
                    ? { createdAt: 1 as const }
                    : { createdAt: -1 as const }

        const [results, total] = await Promise.all([
            Blog.find(filter, { score: { $meta: 'textScore' as const } })
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-__v')
                .lean(),
            Blog.countDocuments(filter),
        ])

        // If text search returned no results, return null to try regex
        if (total === 0) return null

        // Map text score to _score field
        return {
            results: results.map((r: any) => ({ ...r, _score: r.score || 0 })),
            total,
        }
    } catch {
        return null
    }
}

/**
 * Regex fallback search with fuzzy matching
 * Splits query into words and matches any of them
 */
async function regexSearch(
    baseFilter: Record<string, unknown>,
    query: string,
    sortBy: string,
    page: number,
    limit: number
): Promise<{ results: any[]; total: number }> {
    const escaped = escapeRegex(query)

    // Build fuzzy regex: insert optional characters between query chars for typo tolerance
    const fuzzyPattern = query
        .split('')
        .map(c => escapeRegex(c))
        .join('.?')

    const filter = {
        ...baseFilter,
        $or: [
            // Exact substring match (highest priority)
            { title: { $regex: escaped, $options: 'i' } },
            { description: { $regex: escaped, $options: 'i' } },
            { content: { $regex: escaped, $options: 'i' } },
            { tags: { $in: [new RegExp(escaped, 'i')] } },
            // Fuzzy match on title (lower priority, catches typos)
            { title: { $regex: fuzzyPattern, $options: 'i' } },
        ],
    }

    const [results, total] = await Promise.all([
        Blog.find(filter)
            .sort(sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-__v')
            .lean(),
        Blog.countDocuments(filter),
    ])

    return { results, total }
}

/**
 * Extract a relevant snippet from content around the query match
 * Strips markdown syntax for clean display
 */
function extractSnippet(content: string, query: string): string {
    if (!content) return ''

    // Strip markdown syntax
    const clean = content
        .replace(/```[\s\S]*?```/g, ' ') // code blocks
        .replace(/`[^`]+`/g, ' ')         // inline code
        .replace(/!\[.*?\]\(.*?\)/g, '')   // images
        .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links → text
        .replace(/#{1,6}\s/g, '')          // headings
        .replace(/[*_~]{1,3}/g, '')        // bold/italic/strikethrough
        .replace(/>\s/g, '')               // blockquotes
        .replace(/[-*+]\s/g, '')           // list markers
        .replace(/\d+\.\s/g, '')           // ordered list markers
        .replace(/\|.*\|/g, '')            // tables
        .replace(/\n{2,}/g, ' ')           // multiple newlines
        .replace(/\n/g, ' ')              // single newlines
        .replace(/\s{2,}/g, ' ')           // multiple spaces
        .trim()

    if (!query) return clean.slice(0, 160) + (clean.length > 160 ? '...' : '')

    const lowerClean = clean.toLowerCase()
    const lowerQuery = query.toLowerCase()
    const idx = lowerClean.indexOf(lowerQuery)

    if (idx !== -1) {
        const start = Math.max(0, idx - 80)
        const end = Math.min(clean.length, idx + query.length + 80)
        return (start > 0 ? '...' : '') +
            clean.slice(start, end) +
            (end < clean.length ? '...' : '')
    }

    // Try matching individual words
    const words = query.split(/\s+/).filter(w => w.length > 2)
    for (const word of words) {
        const wordIdx = lowerClean.indexOf(word.toLowerCase())
        if (wordIdx !== -1) {
            const start = Math.max(0, wordIdx - 80)
            const end = Math.min(clean.length, wordIdx + word.length + 80)
            return (start > 0 ? '...' : '') +
                clean.slice(start, end) +
                (end < clean.length ? '...' : '')
        }
    }

    return clean.slice(0, 160) + (clean.length > 160 ? '...' : '')
}

function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import { HiArrowLeft, HiStar } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getBlogPostBySlug } from '@/lib/blog'
import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { Navbar } from '@/components/navbar'

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

// Generate dynamic metadata for each blog post - SEO optimized for social & AI crawling
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params

    await connectDB()
    const post = await Blog.findOne({ slug, published: true }).lean()

    if (!post) {
        return {
            title: 'Blog Not Found',
            description: 'The requested blog post could not be found.',
            robots: { index: false, follow: false },
        }
    }

    const baseUrl = 'https://omkarchebale.vercel.app'
    const blogUrl = `${baseUrl}/work/${slug}`
    const publishDate = post.createdAt?.toISOString() || new Date().toISOString()
    const modifiedDate = post.updatedAt?.toISOString() || publishDate

    // Create keyword-rich description for AI crawlers
    const seoDescription = post.description
        ? `${post.description} | Tags: ${post.tags?.join(', ') || 'Tech, Development'}`
        : `Read about ${post.title} - insights on ${post.tags?.join(', ') || 'software development'} by Omkar Chebale`

    return {
        title: `${post.title} | Omkar Chebale Blog`,
        description: seoDescription,
        keywords: [
            ...(post.tags || []),
            'Omkar Chebale',
            'AI Engineer',
            'Full Stack Developer',
            'Tech Blog',
            'Software Engineering',
        ],
        authors: [{ name: 'Omkar Chebale', url: baseUrl }],
        creator: 'Omkar Chebale',
        publisher: 'Omkar Chebale',

        // Robots & Indexing
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },

        // Canonical URL
        alternates: {
            canonical: blogUrl,
        },

        // Open Graph for social sharing
        openGraph: {
            title: post.title,
            description: post.description || `Read ${post.title} on Omkar Chebale's blog`,
            url: blogUrl,
            siteName: 'Omkar Chebale - Developer Blog',
            type: 'article',
            publishedTime: publishDate,
            modifiedTime: modifiedDate,
            authors: ['https://omkarchebale.vercel.app/about'],
            tags: post.tags,
            section: 'Technology',
            locale: 'en_US',
            images: [
                {
                    url: `${baseUrl}/og-blog.png`,
                    width: 1200,
                    height: 630,
                    alt: `${post.title} - Omkar Chebale Blog`,
                    type: 'image/png',
                },
            ],
        },

        // Twitter Card
        twitter: {
            card: 'summary_large_image',
            site: '@chebalerushi',
            creator: '@chebalerushi',
            title: post.title,
            description: post.description || `Read ${post.title}`,
            images: {
                url: `${baseUrl}/og-blog.png`,
                alt: `${post.title} - Blog by Omkar Chebale`,
            },
        },

        // Additional metadata for AI crawlers
        other: {
            'article:author': 'Omkar Chebale',
            'article:published_time': publishDate,
            'article:modified_time': modifiedDate,
            'article:section': 'Technology',
            'article:tag': post.tags?.join(', ') || '',
        },
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = await getBlogPostBySlug(slug)

    if (!post) {
        notFound()
    }

    // If it's an external post, redirect
    if (post.external) {
        return (
            <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Redirecting to external article...</p>
                    <a
                        href={post.external}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Click here if not redirected
                    </a>
                    <script dangerouslySetInnerHTML={{
                        __html: `window.location.href = "${post.external}"`
                    }} />
                </div>
            </main>
        )
    }

    // Generate JSON-LD structured data for AI crawlers
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: 'https://omkarchebale.vercel.app/og-blog.png',
        author: {
            '@type': 'Person',
            name: 'Omkar Chebale',
            url: 'https://omkarchebale.vercel.app/about',
            jobTitle: 'AI Engineer & Full Stack Developer',
            sameAs: [
                'https://github.com/Chebaleomkar',
                'https://linkedin.com/in/omkar-chebale-8b251726b',
                'https://twitter.com/chebalerushi',
            ],
        },
        publisher: {
            '@type': 'Person',
            name: 'Omkar Chebale',
            url: 'https://omkarchebale.vercel.app',
        },
        datePublished: post.createdAt,
        dateModified: post.createdAt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://omkarchebale.vercel.app/work/${slug}`,
        },
        keywords: post.tags?.join(', '),
        articleSection: 'Technology',
        inLanguage: 'en-US',
        isAccessibleForFree: true,
        wordCount: post.content?.split(/\s+/).length || 0,
    }

    return (
        <>
            {/* JSON-LD Structured Data for AI & Search Crawlers */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-[#0a0a0a]">
                {/* Navigation */}
                <Navbar />
                <nav className="pt-8 px-6">
                    <div className="max-w-3xl mx-auto">
                        <Link
                            href="/work"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            <HiArrowLeft size={16} />
                            Back to Work
                        </Link>
                    </div>
                </nav>

                {/* Article */}
                <article className="py-16 px-6">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                {post.isStarred && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/10 rounded text-yellow-500">
                                        <HiStar size={12} />
                                        Featured
                                    </span>
                                )}
                                <span>{post.createdAt}</span>
                                {post.tags.length > 0 && (
                                    <>
                                        <span>·</span>
                                        <div className="flex gap-2">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-gray-800/50 rounded text-gray-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                {post.title}
                            </h1>
                            {post.description && (
                                <p className="text-xl text-gray-400">
                                    {post.description}
                                </p>
                            )}
                        </header>

                        {/* Content - Rendered Markdown */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-3xl font-bold text-white mt-10 mb-4">{children}</h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-2xl font-bold text-white mt-8 mb-3">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">{children}</h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="text-white font-semibold">{children}</strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="text-gray-200 italic">{children}</em>
                                    ),
                                    code: ({ className, children }) => {
                                        const isInline = !className
                                        if (isInline) {
                                            return (
                                                <code className="text-emerald-400 bg-gray-800/70 px-1.5 py-0.5 rounded text-sm font-mono">
                                                    {children}
                                                </code>
                                            )
                                        }
                                        return (
                                            <code className={className}>{children}</code>
                                        )
                                    },
                                    pre: ({ children }) => (
                                        <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-4">
                                            {children}
                                        </pre>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4 ml-4">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-gray-300">{children}</li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-gray-900/50 rounded-r">
                                            <div className="text-gray-400 italic">{children}</div>
                                        </blockquote>
                                    ),
                                    hr: () => (
                                        <hr className="border-gray-800 my-8" />
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>
            </main>
        </>
    )
}

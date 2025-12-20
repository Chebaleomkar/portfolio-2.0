import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface BlogPost {
    slug: string
    title: string
    description: string
    date: string
    tags: string[]
    content: string
    external?: string
}

const blogsDirectory = path.join(process.cwd(), 'blogs')

/**
 * Get all blog posts from the /blogs directory
 */
export function getAllBlogPosts(): BlogPost[] {
    // Ensure the blogs directory exists
    if (!fs.existsSync(blogsDirectory)) {
        fs.mkdirSync(blogsDirectory, { recursive: true })
        return []
    }

    const fileNames = fs.readdirSync(blogsDirectory)
    const markdownFiles = fileNames.filter((file) => file.endsWith('.md'))

    const posts = markdownFiles
        .map((fileName) => {
            const slug = fileName.replace(/\.md$/, '')
            const fullPath = path.join(blogsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')

            // Use gray-matter to parse the post metadata section
            const { data, content } = matter(fileContents)

            return {
                slug,
                title: data.title || slug,
                description: data.description || '',
                date: data.date || new Date().toISOString().split('T')[0],
                tags: data.tags || [],
                content,
                external: data.external,
            } as BlogPost
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1)) // Sort by date descending

    return posts
}

/**
 * Get a single blog post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
    const fullPath = path.join(blogsDirectory, `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
        return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: data.tags || [],
        content,
        external: data.external,
    }
}

/**
 * Create a new blog post
 */
export function createBlogPost(
    title: string,
    body: string,
    options?: {
        description?: string
        tags?: string[]
        date?: string
    }
): { success: boolean; slug: string; error?: string } {
    try {
        // Ensure the blogs directory exists
        if (!fs.existsSync(blogsDirectory)) {
            fs.mkdirSync(blogsDirectory, { recursive: true })
        }

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const date = options?.date || new Date().toISOString().split('T')[0]
        const description = options?.description || ''
        const tags = options?.tags || []

        // Create frontmatter
        const frontmatter = `---
title: "${title}"
description: "${description}"
date: "${date}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
---

${body}`

        const filePath = path.join(blogsDirectory, `${slug}.md`)
        fs.writeFileSync(filePath, frontmatter, 'utf8')

        return { success: true, slug }
    } catch (error) {
        return {
            success: false,
            slug: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

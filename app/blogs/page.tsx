import { Suspense } from 'react'
import Link from 'next/link'
import { HiArrowLeft } from 'react-icons/hi'
import { Navbar } from '@/components/navbar'
import { NewsletterForm } from '@/components/NewsletterForm'
import { BlogList } from '@/components/BlogList'
import { BlogListSkeleton } from '@/components/BlogSkeleton'
import { getBlogPosts } from '@/lib/blog-actions'
import type { Metadata } from 'next'
import type { SearchSortBy } from '@/types/blog'

export const metadata: Metadata = {
    title: 'Blog — AI, ML & Software Engineering | Omkar Chebale',
    description: 'Thoughts on AI, ML, LLMs, RAG systems, and software engineering. Read about what I build, break, and learn — from LangChain pipelines to full-stack React apps.',
    keywords: [
        'AI blog', 'ML blog', 'LLM tutorials', 'RAG systems', 'software engineering blog',
        'Omkar Chebale blog', 'LangChain tutorials', 'Next.js blog', 'Python ML',
        'full-stack development', 'AI engineer blog',
    ],
    openGraph: {
        title: 'Blog — AI, ML & Software Engineering | Omkar Chebale',
        description: 'Thoughts on AI, ML, LLMs, and software engineering. What I build, break, and learn.',
        type: 'website',
        url: 'https://omkarchebale.vercel.app/blogs',
        images: [{ url: 'https://omkarchebale.vercel.app/og-blog.png', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog — AI, ML & Software Engineering | Omkar Chebale',
        description: 'Thoughts on AI, ML, LLMs, and software engineering.',
        creator: '@chebalerushi',
        images: ['https://omkarchebale.vercel.app/og-blog.png'],
    },
    alternates: {
        canonical: 'https://omkarchebale.vercel.app/blogs',
        types: { 'application/rss+xml': 'https://omkarchebale.vercel.app/feed.xml' },
    },
}

export const revalidate = 60

interface BlogPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function BlogContent({ searchParams }: BlogPageProps) {
    const params = await searchParams
    const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page)) : 1
    const search = typeof params.search === 'string' ? params.search.trim() : ''
    const tags = typeof params.tags === 'string' ? params.tags.split(',').filter(Boolean) : []
    const sortBy = (typeof params.sort === 'string' ? params.sort : 'newest') as SearchSortBy

    const { posts, curatedPosts, pagination, availableTags } = await getBlogPosts(page, search, false, tags, sortBy)

    return (
        <BlogList
            initialPosts={posts}
            curatedPosts={curatedPosts}
            pagination={pagination}
            availableTags={availableTags}
        />
    )
}

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://omkarchebale.vercel.app',
        },
        {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: 'https://omkarchebale.vercel.app/blogs',
        },
    ],
}

const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog — AI, ML & Software Engineering',
    description: 'Technical blog posts on AI, ML, LLMs, and software engineering by Omkar Chebale.',
    url: 'https://omkarchebale.vercel.app/blogs',
    isPartOf: {
        '@type': 'WebSite',
        name: 'Omkar Chebale',
        url: 'https://omkarchebale.vercel.app',
    },
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, collectionJsonLd]) }}
            />
            <main className="min-h-screen bg-[#0a0a0a]">
                <Navbar />
                <nav className="pt-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                        >
                            <HiArrowLeft size={16} />
                            Back
                        </Link>
                    </div>
                </nav>

                {/* Content - 2 Column Layout */}
                <section className="py-10 px-6">
                    <div className="max-w-6xl mx-auto">
                        <Suspense fallback={<BlogListSkeleton />}>
                            <BlogContent searchParams={searchParams} />
                        </Suspense>
                    </div>
                </section>
            </main>

            {/* Newsletter Section - Full width above footer */}
            <div className="border-b border-white/5">
                <div className="container mx-auto px-6 max-w-5xl py-16">
                    <NewsletterForm />
                </div>
            </div>
        </>
    )
}

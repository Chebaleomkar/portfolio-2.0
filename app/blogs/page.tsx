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
    title: 'Blogs | Omkar Chebale',
    description: 'Thoughts on AI, ML, and software engineering. Read about what I build, break, and learn.',
    openGraph: {
        title: 'Blogs | Omkar Chebale',
        description: 'Thoughts on AI, ML, and software engineering.',
        type: 'website',
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

export default async function BlogPage({ searchParams }: BlogPageProps) {
    return (
        <>
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

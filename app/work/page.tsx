'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { HiArrowLeft, HiSparkles } from 'react-icons/hi'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { BlogCard } from '@/components/BlogCard'
import { CuratedSidebar } from '@/components/CuratedSidebar'
import type { BlogPost, PaginationInfo } from '@/types/blog'

export default function WorkPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [curatedPosts, setCuratedPosts] = useState<BlogPost[]>([])
    const [pagination, setPagination] = useState<PaginationInfo | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCuratedDrawerOpen, setIsCuratedDrawerOpen] = useState(false)

    // Fetch posts from API
    const fetchPosts = useCallback(async (page: number, search: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                ...(search && { search }),
            })

            const response = await fetch(`/api/blog?${params}`)
            const data = await response.json()

            if (data.success) {
                setPosts(data.posts)
                setCuratedPosts(data.curatedPosts || [])
                setPagination(data.pagination)
            } else {
                setError(data.error || 'Failed to fetch posts')
            }
        } catch (err) {
            setError('Failed to fetch posts')
            console.error('Error fetching posts:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Fetch on mount and when page/search changes
    useEffect(() => {
        fetchPosts(currentPage, searchQuery)
    }, [currentPage, searchQuery, fetchPosts])

    // Handle search - reset to page 1
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }, [])

    // Handle page change
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    // Show curated only on first page and when not searching
    const showCurated = currentPage === 1 && !searchQuery && curatedPosts.length > 0

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            {/* Navigation */}
            <nav className="pt-8 px-6">
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
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className={`flex gap-12 ${showCurated ? 'lg:flex-row flex-col' : ''}`}>
                        {/* Main Content Column */}
                        <div className={showCurated ? 'flex-1 lg:max-w-[65%]' : 'max-w-3xl mx-auto w-full'}>
                            {/* Header */}
                            <header className="mb-12">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    Work
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Thoughts on whatever I build, break, and learn in AI, engineering, and more.
                                </p>
                            </header>

                            {/* Mobile Curated Button - Small, right-aligned */}
                            {showCurated && (
                                <div className="lg:hidden flex justify-end mb-4">
                                    <button
                                        onClick={() => setIsCuratedDrawerOpen(true)}
                                        className="inline-flex items-center gap-1.5 px-3 py-2
                                                   border border-amber-500/60 text-amber-400 rounded-lg
                                                   hover:bg-amber-500/10 hover:border-amber-500 
                                                   transition-all duration-200 font-medium text-xs"
                                    >
                                        <span>Curated</span>
                                        <span>≡</span>
                                    </button>
                                </div>
                            )}

                            {/* Search Bar */}
                            <div className="mb-6">
                                <SearchBar
                                    onSearch={handleSearch}
                                    placeholder="Search posts..."
                                    curatedPosts={showCurated ? curatedPosts : []}
                                />
                            </div>

                            {/* Posts Count */}
                            {pagination && !isLoading && (
                                <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                                    <span>
                                        {searchQuery ? (
                                            <>
                                                Found <span className="text-white">{pagination.totalPosts}</span> posts
                                                for &quot;{searchQuery}&quot;
                                            </>
                                        ) : (
                                            <>
                                                Showing <span className="text-white">{posts.length}</span> of{' '}
                                                <span className="text-white">{pagination.totalPosts}</span> posts
                                            </>
                                        )}
                                    </span>
                                    {pagination.totalPages > 1 && (
                                        <span>
                                            Page {pagination.currentPage} of {pagination.totalPages}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="py-20 text-center">
                                    <div className="inline-block w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
                                    <p className="text-gray-500 mt-4">Loading posts...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !isLoading && (
                                <div className="py-12 border border-red-900/50 bg-red-900/10 rounded-lg text-center">
                                    <p className="text-red-400">{error}</p>
                                    <button
                                        onClick={() => fetchPosts(currentPage, searchQuery)}
                                        className="mt-4 px-4 py-2 text-sm border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                                    >
                                        Try again
                                    </button>
                                </div>
                            )}

                            {/* Posts List */}
                            {!isLoading && !error && (
                                <>
                                    <div className="space-y-1">
                                        {posts.map((post) => (
                                            <BlogCard key={post._id} post={post} />
                                        ))}
                                    </div>

                                    {/* Empty State */}
                                    {posts.length === 0 && (
                                        <div className="py-12 border border-dashed border-white/10 rounded-lg text-center">
                                            {searchQuery ? (
                                                <p className="text-gray-500">
                                                    No posts found for &quot;{searchQuery}&quot;
                                                </p>
                                            ) : (
                                                <p className="text-gray-500">
                                                    No posts yet. Create one via the API!
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Pagination */}
                                    {pagination && pagination.totalPages > 1 && (
                                        <Pagination
                                            currentPage={pagination.currentPage}
                                            totalPages={pagination.totalPages}
                                            onPageChange={handlePageChange}
                                            windowSize={5}
                                        />
                                    )}
                                </>
                            )}
                        </div>

                        {/* Desktop Curated Sidebar - Right Column */}
                        {showCurated && (
                            <div className="hidden lg:block lg:w-[320px] flex-shrink-0">
                                <CuratedSidebar posts={curatedPosts} />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Mobile Curated Drawer */}
            {showCurated && (
                <CuratedSidebar
                    posts={curatedPosts}
                    isOpen={isCuratedDrawerOpen}
                    onClose={() => setIsCuratedDrawerOpen(false)}
                    isMobile={true}
                />
            )}
        </main>
    )
}

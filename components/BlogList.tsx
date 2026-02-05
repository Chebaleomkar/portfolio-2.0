'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { HiSparkles } from 'react-icons/hi'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { BlogCard } from '@/components/BlogCard'
import { CuratedSidebar } from '@/components/CuratedSidebar'
import type { BlogPost, PaginationInfo } from '@/types/blog'

interface BlogListProps {
    initialPosts: BlogPost[]
    curatedPosts: BlogPost[]
    pagination: PaginationInfo
}

export function BlogList({ initialPosts, curatedPosts, pagination }: BlogListProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [isCuratedDrawerOpen, setIsCuratedDrawerOpen] = useState(false)

    const currentSearch = searchParams.get('search') || ''
    const currentPage = pagination.currentPage

    // Show curated only on first page and when not searching
    const showCurated = currentPage === 1 && !currentSearch && curatedPosts.length > 0

    // Update URL with search params (triggers server-side re-fetch)
    const updateSearchParams = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === '') {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })

        // Use transition for non-blocking navigation
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`, { scroll: false })
        })
    }, [searchParams, pathname, router])

    // Handle search - reset to page 1
    const handleSearch = useCallback((query: string) => {
        updateSearchParams({ search: query || null, page: null })
    }, [updateSearchParams])

    // Handle page change
    const handlePageChange = useCallback((page: number) => {
        updateSearchParams({ page: page === 1 ? null : page.toString() })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [updateSearchParams])

    return (
        <>
            <div className={`flex gap-8 lg:gap-14 ${showCurated ? 'lg:flex-row flex-col' : 'flex-col'}`}>
                {/* Main Content Column */}
                <div className={showCurated ? 'flex-1' : 'max-w-3xl mx-auto w-full'}>
                    {/* Header - Compact on mobile */}
                    <header className="mb-8 md:mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">
                            Blogs
                        </h1>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md">
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
                                <HiSparkles size={14} />
                                <span>Curated</span>
                            </button>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="mb-6">
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder="Search posts..."
                            curatedPosts={showCurated ? curatedPosts : []}
                            defaultValue={currentSearch}
                        />
                    </div>

                    {/* Posts Count */}
                    {!isPending && (
                        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                            <span>
                                {currentSearch ? (
                                    <>
                                        Found <span className="text-white">{pagination.totalPosts}</span> posts
                                        for &quot;{currentSearch}&quot;
                                    </>
                                ) : (
                                    <>
                                        Showing <span className="text-white">{initialPosts.length}</span> of{' '}
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

                    {/* Loading Overlay */}
                    <div className={`transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                        {/* Posts List */}
                        <div className="space-y-1">
                            {initialPosts.map((post) => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>

                        {/* Empty State */}
                        {initialPosts.length === 0 && (
                            <div className="py-12 border border-dashed border-white/10 rounded-lg text-center">
                                {currentSearch ? (
                                    <p className="text-gray-500">
                                        No posts found for &quot;{currentSearch}&quot;
                                    </p>
                                ) : (
                                    <p className="text-gray-500">
                                        No posts yet. Create one via the API!
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                                windowSize={5}
                            />
                        )}
                    </div>
                </div>

                {/* Desktop Curated Sidebar - Right Column */}
                {showCurated && (
                    <div className="hidden lg:block lg:w-[320px] flex-shrink-0">
                        <CuratedSidebar posts={curatedPosts} />
                    </div>
                )}
            </div>

            {/* Mobile Curated Drawer */}
            {showCurated && (
                <CuratedSidebar
                    posts={curatedPosts}
                    isOpen={isCuratedDrawerOpen}
                    onClose={() => setIsCuratedDrawerOpen(false)}
                    isMobile={true}
                />
            )}
        </>
    )
}

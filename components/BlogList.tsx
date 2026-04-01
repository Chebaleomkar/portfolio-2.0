'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { HiSparkles, HiSortDescending, HiTag, HiX, HiChevronDown } from 'react-icons/hi'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { BlogCard } from '@/components/BlogCard'
import { CuratedSidebar } from '@/components/CuratedSidebar'
import type { BlogPost, PaginationInfo, SearchSortBy } from '@/types/blog'

interface BlogListProps {
    initialPosts: BlogPost[]
    curatedPosts: BlogPost[]
    pagination: PaginationInfo
    availableTags?: string[]
}

const SORT_OPTIONS: { value: SearchSortBy; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
]

export function BlogList({ initialPosts, curatedPosts, pagination, availableTags = [] }: BlogListProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [isCuratedDrawerOpen, setIsCuratedDrawerOpen] = useState(false)
    const [showTagFilter, setShowTagFilter] = useState(false)

    const currentSearch = searchParams.get('search') || ''
    const currentPage = pagination.currentPage
    const currentTags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    const currentSort = (searchParams.get('sort') as SearchSortBy) || 'newest'

    // Show curated only on first page with no search/filters
    const showCurated = currentPage === 1 && !currentSearch && currentTags.length === 0 && curatedPosts.length > 0
    const hasActiveFilters = currentTags.length > 0 || currentSort !== 'newest'

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

    // Handle tag toggle
    const handleTagToggle = useCallback((tag: string) => {
        const newTags = currentTags.includes(tag)
            ? currentTags.filter(t => t !== tag)
            : [...currentTags, tag]
        updateSearchParams({
            tags: newTags.length > 0 ? newTags.join(',') : null,
            page: null,
        })
    }, [currentTags, updateSearchParams])

    // Handle sort change
    const handleSortChange = useCallback((sort: SearchSortBy) => {
        updateSearchParams({
            sort: sort === 'newest' ? null : sort,
            page: null,
        })
    }, [updateSearchParams])

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        updateSearchParams({ search: null, tags: null, sort: null, page: null })
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
                    <div className="mb-4">
                        <SearchBar
                            onSearch={handleSearch}
                            placeholder="Search posts..."
                            curatedPosts={showCurated ? curatedPosts : []}
                            defaultValue={currentSearch}
                        />
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {/* Tag Filter Toggle */}
                        <button
                            onClick={() => setShowTagFilter(prev => !prev)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                       border transition-all duration-200
                                ${showTagFilter || currentTags.length > 0
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : 'bg-gray-900/50 text-gray-500 border-gray-800 hover:text-gray-300 hover:border-gray-700'
                                }`}
                        >
                            <HiTag size={12} />
                            Tags
                            {currentTags.length > 0 && (
                                <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded text-[10px]">
                                    {currentTags.length}
                                </span>
                            )}
                            <HiChevronDown
                                size={12}
                                className={`transition-transform ${showTagFilter ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Sort Options */}
                        <div className="flex items-center gap-1 ml-auto">
                            <HiSortDescending size={12} className="text-gray-600" />
                            {SORT_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSortChange(opt.value)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                                        ${currentSort === opt.value
                                            ? 'bg-white/10 text-white'
                                            : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] text-gray-500
                                           hover:text-gray-300 transition-colors"
                            >
                                <HiX size={12} />
                                Clear filters
                            </button>
                        )}
                    </div>

                    {/* Active Tag Chips */}
                    {currentTags.length > 0 && (
                        <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                            {currentTags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium
                                               bg-emerald-500/15 text-emerald-400 rounded-md border border-emerald-500/30
                                               hover:bg-emerald-500/25 transition-colors"
                                >
                                    {tag}
                                    <HiX size={10} />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tag Filter Panel (expandable) */}
                    {showTagFilter && availableTags.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-900/30 border border-gray-800/60 rounded-lg">
                            <div className="flex flex-wrap gap-1.5">
                                {availableTags.map(tag => {
                                    const isActive = currentTags.includes(tag)
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150
                                                ${isActive
                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                                    : 'bg-gray-800/40 text-gray-400 border-gray-700/40 hover:text-gray-200 hover:border-gray-600'
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Posts Count */}
                    {!isPending && (
                        <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                            <span>
                                {currentSearch || currentTags.length > 0 ? (
                                    <>
                                        Found <span className="text-white">{pagination.totalPosts}</span> posts
                                        {currentSearch && <> for &quot;{currentSearch}&quot;</>}
                                        {currentTags.length > 0 && (
                                            <> in {currentTags.length} tag{currentTags.length > 1 ? 's' : ''}</>
                                        )}
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
                                {currentSearch || currentTags.length > 0 ? (
                                    <div>
                                        <p className="text-gray-400 mb-2">
                                            No posts found
                                            {currentSearch && <> for &quot;{currentSearch}&quot;</>}
                                        </p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
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

'use client'

import { useState, useEffect, useRef, useCallback, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiSearch,
    HiX,
    HiClock,
    HiTag,
    HiArrowRight,
    HiStar,
    HiExternalLink,
    HiSortDescending,
    HiLightningBolt,
    HiTrendingUp,
    HiBackspace,
} from 'react-icons/hi'
import { useSearch } from '@/hooks/useSearch'
import type { SearchResult, SearchSortBy } from '@/types/blog'

interface SearchCommandProps {
    isOpen: boolean
    onClose: () => void
}

// Highlight matched text in search results
function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query.trim() || !text) return <>{text}</>

    const words = query
        .trim()
        .split(/\s+/)
        .filter(w => w.length > 1)
        .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

    if (words.length === 0) return <>{text}</>

    const pattern = new RegExp(`(${words.join('|')})`, 'gi')
    const parts = text.split(pattern)

    return (
        <>
            {parts.map((part, i) =>
                pattern.test(part) ? (
                    <mark
                        key={i}
                        className="bg-emerald-500/25 text-emerald-300 rounded-sm px-0.5"
                    >
                        {part}
                    </mark>
                ) : (
                    <Fragment key={i}>{part}</Fragment>
                )
            )}
        </>
    )
}

const SORT_OPTIONS: { value: SearchSortBy; label: string; icon: typeof HiTrendingUp }[] = [
    { value: 'relevance', label: 'Relevance', icon: HiTrendingUp },
    { value: 'newest', label: 'Newest', icon: HiSortDescending },
    { value: 'oldest', label: 'Oldest', icon: HiClock },
]

export function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const resultsRef = useRef<HTMLDivElement>(null)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [showFilters, setShowFilters] = useState(false)
    const [recentSearches, setRecentSearches] = useState<string[]>([])

    const {
        query,
        results,
        total,
        elapsed,
        isLoading,
        activeTags,
        sortBy,
        allTags,
        search,
        toggleTag,
        setSort,
        clearFilters,
        getRecentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
    } = useSearch()

    // Load recent searches when modal opens
    useEffect(() => {
        if (isOpen) {
            setRecentSearches(getRecentSearches())
            // Focus input after mount animation
            const timer = setTimeout(() => inputRef.current?.focus(), 100)
            return () => clearTimeout(timer)
        } else {
            setSelectedIndex(-1)
            setShowFilters(false)
        }
    }, [isOpen, getRecentSearches])

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(-1)
    }, [results])

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && resultsRef.current) {
            const items = resultsRef.current.querySelectorAll('[data-result-item]')
            items[selectedIndex]?.scrollIntoView({ block: 'nearest' })
        }
    }, [selectedIndex])

    // Navigate to a result
    const navigateToResult = useCallback(
        (result: SearchResult) => {
            if (query.trim()) addRecentSearch(query.trim())
            onClose()
            if (result.external) {
                window.open(result.external, '_blank', 'noopener,noreferrer')
            } else {
                router.push(`/blogs/${result.slug}`)
            }
        },
        [query, addRecentSearch, onClose, router]
    )

    // Keyboard navigation
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setSelectedIndex(prev =>
                        prev < results.length - 1 ? prev + 1 : 0
                    )
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setSelectedIndex(prev =>
                        prev > 0 ? prev - 1 : results.length - 1
                    )
                    break
                case 'Enter':
                    e.preventDefault()
                    if (selectedIndex >= 0 && results[selectedIndex]) {
                        navigateToResult(results[selectedIndex])
                    } else if (query.trim()) {
                        // Navigate to search page with query
                        addRecentSearch(query.trim())
                        onClose()
                        router.push(`/blogs?search=${encodeURIComponent(query.trim())}`)
                    }
                    break
                case 'Escape':
                    e.preventDefault()
                    onClose()
                    break
                case 'Tab':
                    e.preventDefault()
                    setShowFilters(prev => !prev)
                    break
            }
        },
        [results, selectedIndex, query, navigateToResult, addRecentSearch, onClose, router]
    )

    // Handle clicking a recent search
    const handleRecentClick = useCallback(
        (term: string) => {
            search(term)
            inputRef.current?.focus()
        },
        [search]
    )

    // Determine what to show
    const hasQuery = query.trim().length > 0
    const hasResults = results.length > 0
    const hasActiveTags = activeTags.length > 0
    const showRecent = !hasQuery && !hasActiveTags && recentSearches.length > 0
    const showEmptyState = (hasQuery || hasActiveTags) && !hasResults && !isLoading

    if (!isOpen) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100]" onKeyDown={handleKeyDown}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -10 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[95%] max-w-2xl"
                    >
                        <div className="bg-[#111] border border-gray-800 rounded-xl shadow-2xl shadow-black/60 overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 px-4 border-b border-gray-800/80">
                                <HiSearch
                                    size={20}
                                    className={`flex-shrink-0 transition-colors ${
                                        isLoading ? 'text-emerald-400 animate-pulse' : 'text-gray-500'
                                    }`}
                                />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={e => search(e.target.value)}
                                    placeholder="Search posts, tags, topics..."
                                    className="flex-1 py-4 bg-transparent text-white placeholder-gray-500
                                               focus:outline-none text-[15px]"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                                {(hasQuery || hasActiveTags) && (
                                    <button
                                        onClick={() => {
                                            clearFilters()
                                            inputRef.current?.focus()
                                        }}
                                        className="text-gray-500 hover:text-white transition-colors p-1"
                                        title="Clear all"
                                    >
                                        <HiX size={18} />
                                    </button>
                                )}
                                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium
                                                text-gray-500 bg-gray-800/60 rounded border border-gray-700/50">
                                    ESC
                                </kbd>
                            </div>

                            {/* Active Tag Filters */}
                            {hasActiveTags && (
                                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800/50 bg-gray-900/30">
                                    <HiTag size={12} className="text-gray-500 flex-shrink-0" />
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        {activeTags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium
                                                           bg-emerald-500/15 text-emerald-400 rounded-md border border-emerald-500/30
                                                           hover:bg-emerald-500/25 transition-colors"
                                            >
                                                {tag}
                                                <HiX size={10} />
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => {
                                                clearFilters()
                                                inputRef.current?.focus()
                                            }}
                                            className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors ml-1"
                                        >
                                            Clear all
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Filter & Sort Toggle Bar */}
                            {(hasQuery || hasActiveTags) && (
                                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/40 bg-gray-900/20">
                                    <div className="flex items-center gap-3">
                                        {/* Sort Options */}
                                        <div className="flex items-center gap-1">
                                            {SORT_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setSort(opt.value)}
                                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all
                                                        ${sortBy === opt.value
                                                            ? 'bg-white/10 text-white'
                                                            : 'text-gray-500 hover:text-gray-300'
                                                        }`}
                                                >
                                                    <opt.icon size={11} />
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Filter toggle */}
                                    <button
                                        onClick={() => setShowFilters(prev => !prev)}
                                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium transition-all
                                            ${showFilters
                                                ? 'bg-emerald-500/15 text-emerald-400'
                                                : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        <HiTag size={11} />
                                        Tags
                                        <kbd className="hidden sm:inline text-[9px] text-gray-600 ml-1">TAB</kbd>
                                    </button>
                                </div>
                            )}

                            {/* Tag Filter Chips (expandable) */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="overflow-hidden border-b border-gray-800/40"
                                    >
                                        <div className="px-4 py-3 bg-gray-900/20">
                                            <div className="flex flex-wrap gap-1.5">
                                                {allTags.map(tag => {
                                                    const isActive = activeTags.includes(tag.name)
                                                    return (
                                                        <button
                                                            key={tag.name}
                                                            onClick={() => toggleTag(tag.name)}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium
                                                                        border transition-all duration-150
                                                                ${isActive
                                                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                                                    : 'bg-gray-800/40 text-gray-400 border-gray-700/40 hover:text-gray-200 hover:border-gray-600'
                                                                }`}
                                                        >
                                                            {tag.name}
                                                            <span className={`text-[9px] ${isActive ? 'text-emerald-500/60' : 'text-gray-600'}`}>
                                                                {tag.count}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Results Area */}
                            <div
                                ref={resultsRef}
                                className="max-h-[55vh] overflow-y-auto overscroll-contain
                                           [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent
                                           [&::-webkit-scrollbar-thumb]:bg-gray-700/50 [&::-webkit-scrollbar-thumb]:rounded-full"
                            >
                                {/* Loading State */}
                                {isLoading && (
                                    <div className="px-4 py-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-3 py-3 animate-pulse">
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                                                    <div className="h-3 bg-gray-800/60 rounded w-full" />
                                                    <div className="h-3 bg-gray-800/40 rounded w-1/2" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Search Results */}
                                {!isLoading && hasResults && (
                                    <>
                                        {/* Results Header */}
                                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/30">
                                            <span className="text-[11px] text-gray-500 font-medium">
                                                {total} result{total !== 1 ? 's' : ''} found
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-[10px] text-gray-600">
                                                <HiLightningBolt size={10} />
                                                {elapsed}ms
                                            </span>
                                        </div>

                                        {results.map((result, idx) => (
                                            <ResultItem
                                                key={result._id}
                                                result={result}
                                                query={query}
                                                isSelected={idx === selectedIndex}
                                                onClick={() => navigateToResult(result)}
                                                index={idx}
                                            />
                                        ))}
                                    </>
                                )}

                                {/* Empty State */}
                                {showEmptyState && (
                                    <div className="px-4 py-12 text-center">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-800/50 flex items-center justify-center">
                                            <HiSearch size={20} className="text-gray-600" />
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium mb-1">No results found</p>
                                        <p className="text-gray-600 text-xs">
                                            Try different keywords or remove some filters
                                        </p>
                                    </div>
                                )}

                                {/* Recent Searches */}
                                {showRecent && (
                                    <div className="px-4 py-3">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                                <HiClock size={12} />
                                                Recent Searches
                                            </span>
                                            <button
                                                onClick={() => {
                                                    clearRecentSearches()
                                                    setRecentSearches([])
                                                }}
                                                className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                        <div className="space-y-0.5">
                                            {recentSearches.map(term => (
                                                <div
                                                    key={term}
                                                    className="flex items-center justify-between group rounded-lg px-2 py-2
                                                               hover:bg-gray-800/50 transition-colors cursor-pointer"
                                                    onClick={() => handleRecentClick(term)}
                                                >
                                                    <div className="flex items-center gap-2.5 text-sm text-gray-400">
                                                        <HiClock size={14} className="text-gray-600" />
                                                        {term}
                                                    </div>
                                                    <button
                                                        onClick={e => {
                                                            e.stopPropagation()
                                                            removeRecentSearch(term)
                                                            setRecentSearches(prev => prev.filter(s => s !== term))
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-400 transition-all p-0.5"
                                                        title="Remove"
                                                    >
                                                        <HiX size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Initial State - Popular Tags */}
                                {!hasQuery && !hasActiveTags && !showRecent && allTags.length > 0 && (
                                    <div className="px-4 py-4">
                                        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                                            <HiTrendingUp size={12} />
                                            Popular Topics
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {allTags.slice(0, 15).map(tag => (
                                                <button
                                                    key={tag.name}
                                                    onClick={() => toggleTag(tag.name)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                                               bg-gray-800/50 text-gray-400 border border-gray-700/40
                                                               hover:text-white hover:border-gray-600 transition-all"
                                                >
                                                    <HiTag size={10} className="text-gray-600" />
                                                    {tag.name}
                                                    <span className="text-[9px] text-gray-600">{tag.count}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer - Keyboard Hints */}
                            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-800/60 bg-gray-900/30">
                                <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-gray-800/80 rounded border border-gray-700/50 text-gray-500">
                                            ↑↓
                                        </kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-gray-800/80 rounded border border-gray-700/50 text-gray-500">
                                            ↵
                                        </kbd>
                                        Open
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-gray-800/80 rounded border border-gray-700/50 text-gray-500">
                                            Tab
                                        </kbd>
                                        Filters
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 bg-gray-800/80 rounded border border-gray-700/50 text-gray-500">
                                            Esc
                                        </kbd>
                                        Close
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                    <HiLightningBolt size={10} className="text-emerald-500/50" />
                                    Powered by full-text search
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// Individual search result item
function ResultItem({
    result,
    query,
    isSelected,
    onClick,
    index,
}: {
    result: SearchResult
    query: string
    isSelected: boolean
    onClick: () => void
    index: number
}) {
    return (
        <div
            data-result-item
            onClick={onClick}
            className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-100
                ${isSelected ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : 'border-l-2 border-transparent hover:bg-gray-800/40'}`}
        >
            <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="flex items-center gap-2 mb-1">
                    {result.isStarred && (
                        <HiStar size={12} className="text-amber-400 flex-shrink-0" />
                    )}
                    <h4 className="text-sm font-semibold text-white truncate">
                        <HighlightText text={result.title} query={query} />
                    </h4>
                    {result.external && (
                        <HiExternalLink size={12} className="text-gray-600 flex-shrink-0" />
                    )}
                </div>

                {/* Snippet / Description */}
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-1.5">
                    <HighlightText
                        text={result.snippet || result.description}
                        query={query}
                    />
                </p>

                {/* Tags + Date */}
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-600 font-medium">
                        {new Date(result.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </span>
                    {result.tags.length > 0 && (
                        <>
                            <span className="text-gray-800">·</span>
                            <div className="flex gap-1">
                                {result.tags.slice(0, 3).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-1.5 py-0.5 text-[9px] font-medium bg-gray-800/60
                                                   border border-gray-700/30 rounded text-gray-500"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {result.tags.length > 3 && (
                                    <span className="text-[9px] text-gray-600">
                                        +{result.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                    {result.score > 0 && (
                        <>
                            <span className="text-gray-800">·</span>
                            <span className="text-[9px] text-emerald-600 font-medium">
                                {Math.round(result.score * 100)}% match
                            </span>
                        </>
                    )}
                </div>
            </div>

            <HiArrowRight
                size={14}
                className={`mt-1 flex-shrink-0 transition-all ${
                    isSelected ? 'text-emerald-400 translate-x-0.5' : 'text-gray-700'
                }`}
            />
        </div>
    )
}

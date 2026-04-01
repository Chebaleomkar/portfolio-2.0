'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { SearchResult, SearchSortBy } from '@/types/blog'

interface SearchState {
    query: string
    results: SearchResult[]
    total: number
    elapsed: number
    isLoading: boolean
    error: string | null
    activeTags: string[]
    sortBy: SearchSortBy
    allTags: { name: string; count: number }[]
}

const RECENT_SEARCHES_KEY = 'blog-recent-searches'
const MAX_RECENT = 8
const CACHE_TTL = 60_000 // 1 minute

// In-memory search cache to avoid redundant API calls
const searchCache = new Map<string, { data: any; timestamp: number }>()

function getCacheKey(query: string, tags: string[], sort: string): string {
    return `${query}|${tags.sort().join(',')}|${sort}`
}

export function useSearch() {
    const [state, setState] = useState<SearchState>({
        query: '',
        results: [],
        total: 0,
        elapsed: 0,
        isLoading: false,
        error: null,
        activeTags: [],
        sortBy: 'relevance',
        allTags: [],
    })

    const abortRef = useRef<AbortController | null>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Fetch all available tags on mount
    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/search/suggest?q=', { signal: controller.signal })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    setState(prev => ({ ...prev, allTags: data.tags }))
                }
            })
            .catch(() => {})
        return () => controller.abort()
    }, [])

    // Core search function
    const performSearch = useCallback(
        async (query: string, tags: string[], sort: SearchSortBy) => {
            // Cancel any in-flight request
            if (abortRef.current) abortRef.current.abort()

            if (!query.trim() && tags.length === 0) {
                setState(prev => ({
                    ...prev,
                    query,
                    results: [],
                    total: 0,
                    elapsed: 0,
                    isLoading: false,
                    error: null,
                }))
                return
            }

            // Check cache
            const cacheKey = getCacheKey(query, tags, sort)
            const cached = searchCache.get(cacheKey)
            if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                setState(prev => ({
                    ...prev,
                    query,
                    results: cached.data.results,
                    total: cached.data.total,
                    elapsed: cached.data.elapsed,
                    isLoading: false,
                    error: null,
                }))
                return
            }

            setState(prev => ({ ...prev, query, isLoading: true, error: null }))

            const controller = new AbortController()
            abortRef.current = controller

            try {
                const params = new URLSearchParams()
                if (query.trim()) params.set('q', query.trim())
                if (tags.length) params.set('tags', tags.join(','))
                params.set('sort', sort)
                params.set('limit', '20')

                const response = await fetch(`/api/search?${params}`, {
                    signal: controller.signal,
                })

                if (!response.ok) throw new Error('Search failed')

                const data = await response.json()

                if (data.success) {
                    searchCache.set(cacheKey, { data, timestamp: Date.now() })
                    setState(prev => ({
                        ...prev,
                        results: data.results,
                        total: data.total,
                        elapsed: data.elapsed,
                        isLoading: false,
                        error: null,
                    }))
                }
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    setState(prev => ({
                        ...prev,
                        isLoading: false,
                        error: 'Search failed. Please try again.',
                    }))
                }
            }
        },
        []
    )

    // Debounced search (for typing)
    const search = useCallback(
        (query: string) => {
            setState(prev => ({ ...prev, query }))
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
                performSearch(query, state.activeTags, state.sortBy)
            }, 200)
        },
        [performSearch, state.activeTags, state.sortBy]
    )

    // Instant search (no debounce - for filter/sort changes)
    const searchImmediate = useCallback(
        (query: string, tags: string[], sort: SearchSortBy) => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            performSearch(query, tags, sort)
        },
        [performSearch]
    )

    // Toggle a tag filter
    const toggleTag = useCallback(
        (tag: string) => {
            setState(prev => {
                const newTags = prev.activeTags.includes(tag)
                    ? prev.activeTags.filter(t => t !== tag)
                    : [...prev.activeTags, tag]

                // Trigger search immediately with new tags
                if (debounceRef.current) clearTimeout(debounceRef.current)
                performSearch(prev.query, newTags, prev.sortBy)

                return { ...prev, activeTags: newTags }
            })
        },
        [performSearch]
    )

    // Change sort order
    const setSort = useCallback(
        (sort: SearchSortBy) => {
            setState(prev => {
                if (debounceRef.current) clearTimeout(debounceRef.current)
                performSearch(prev.query, prev.activeTags, sort)
                return { ...prev, sortBy: sort }
            })
        },
        [performSearch]
    )

    // Clear all filters
    const clearFilters = useCallback(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (abortRef.current) abortRef.current.abort()
        setState(prev => ({
            ...prev,
            query: '',
            activeTags: [],
            sortBy: 'relevance',
            results: [],
            total: 0,
            elapsed: 0,
            isLoading: false,
            error: null,
        }))
    }, [])

    // Recent searches (persisted in localStorage)
    const getRecentSearches = useCallback((): string[] => {
        try {
            return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
        } catch {
            return []
        }
    }, [])

    const addRecentSearch = useCallback(
        (query: string) => {
            if (!query.trim()) return
            try {
                const recent = getRecentSearches().filter(s => s !== query.trim())
                recent.unshift(query.trim())
                localStorage.setItem(
                    RECENT_SEARCHES_KEY,
                    JSON.stringify(recent.slice(0, MAX_RECENT))
                )
            } catch {}
        },
        [getRecentSearches]
    )

    const removeRecentSearch = useCallback(
        (query: string) => {
            try {
                const recent = getRecentSearches().filter(s => s !== query)
                localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent))
            } catch {}
        },
        [getRecentSearches]
    )

    const clearRecentSearches = useCallback(() => {
        try {
            localStorage.removeItem(RECENT_SEARCHES_KEY)
        } catch {}
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortRef.current) abortRef.current.abort()
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    return {
        ...state,
        search,
        searchImmediate,
        toggleTag,
        setSort,
        clearFilters,
        getRecentSearches,
        addRecentSearch,
        removeRecentSearch,
        clearRecentSearches,
    }
}

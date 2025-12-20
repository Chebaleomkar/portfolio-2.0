'use client'

import { useState, useEffect, useCallback } from 'react'
import { HiSearch, HiX } from 'react-icons/hi'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
    debounceMs?: number
}

export function SearchBar({
    onSearch,
    placeholder = 'Search posts...',
    debounceMs = 300,
}: SearchBarProps) {
    const [query, setQuery] = useState('')

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [query, debounceMs, onSearch])

    const clearSearch = useCallback(() => {
        setQuery('')
        onSearch('')
    }, [onSearch])

    return (
        <div className="relative mb-8">
            <div className="relative">
                <HiSearch
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-800 rounded-lg 
                     text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 
                     focus:ring-1 focus:ring-gray-700 transition-all"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        <HiX size={20} />
                    </button>
                )}
            </div>
        </div>
    )
}

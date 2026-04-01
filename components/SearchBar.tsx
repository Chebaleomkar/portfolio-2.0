'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { HiSearch, HiX, HiSparkles } from 'react-icons/hi'
import { SearchCommand } from '@/components/search/SearchCommand'
import type { BlogPost } from '@/types/blog'

interface SearchBarProps {
    onSearch: (query: string) => void
    placeholder?: string
    debounceMs?: number
    curatedPosts?: BlogPost[]
    defaultValue?: string
}

export function SearchBar({
    onSearch,
    placeholder = 'Search posts...',
    debounceMs = 300,
    curatedPosts = [],
    defaultValue = '',
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue)
    const [isFocused, setIsFocused] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isCommandOpen, setIsCommandOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [query, debounceMs, onSearch])

    // Show suggestions when focused and has curated posts
    useEffect(() => {
        if (isFocused && curatedPosts.length > 0 && !query) {
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }, [isFocused, curatedPosts, query])

    // Close suggestions on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false)
                setIsFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Global Cmd+K / Ctrl+K shortcut
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsCommandOpen(true)
            }
        }
        document.addEventListener('keydown', handleGlobalKeyDown)
        return () => document.removeEventListener('keydown', handleGlobalKeyDown)
    }, [])

    const clearSearch = useCallback(() => {
        setQuery('')
        onSearch('')
        inputRef.current?.focus()
    }, [onSearch])

    const handleSuggestionClick = () => {
        setShowSuggestions(false)
        setIsFocused(false)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        // Open command palette on Cmd+K or when pressing / from empty input
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault()
            setIsCommandOpen(true)
        }
    }

    return (
        <>
            <div ref={containerRef} className="relative">
                <div className="relative">
                    <HiSearch
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleInputKeyDown}
                        placeholder={placeholder}
                        className="w-full pl-11 pr-24 py-3 bg-gray-900/50 border border-gray-800 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:border-gray-700
                         focus:ring-1 focus:ring-gray-700 transition-all text-sm"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {query && (
                            <button
                                onClick={clearSearch}
                                className="text-gray-500 hover:text-white transition-colors"
                                aria-label="Clear search"
                            >
                                <HiX size={18} />
                            </button>
                        )}
                        {/* Cmd+K Shortcut Badge */}
                        <button
                            onClick={() => setIsCommandOpen(true)}
                            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium
                                       text-gray-500 bg-gray-800/60 rounded border border-gray-700/50
                                       hover:text-gray-300 hover:border-gray-600 transition-colors cursor-pointer"
                            title="Advanced Search (Ctrl+K)"
                        >
                            <span>Ctrl</span>
                            <span>K</span>
                        </button>
                    </div>
                </div>

                {/* Curated Suggestions Dropdown */}
                {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#111] border border-gray-800 rounded-xl
                            shadow-2xl shadow-black/50 z-50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900/50">
                            <HiSparkles className="text-amber-400" size={14} />
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                                Curated Suggestions
                            </span>
                        </div>

                        {/* Suggestions list */}
                        <div className="max-h-64 overflow-y-auto">
                            {curatedPosts.slice(0, 5).map((post) => {
                                const Wrapper = post.external ? 'a' : Link
                                const wrapperProps = post.external
                                    ? { href: post.external, target: '_blank', rel: 'noopener noreferrer' }
                                    : { href: `/blogs/${post.slug}` }

                                return (
                                    <Wrapper
                                        key={post._id}
                                        {...wrapperProps}
                                        onClick={handleSuggestionClick}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{post.title}</p>
                                            <p className="text-gray-500 text-xs truncate">{post.description}</p>
                                        </div>
                                        <span className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400/80 rounded font-medium">
                                            {post.tags[0] || 'Blog'}
                                        </span>
                                    </Wrapper>
                                )
                            })}
                        </div>

                        {/* Advanced Search Footer */}
                        <div className="border-t border-gray-800/50 px-4 py-2.5 bg-gray-900/30">
                            <button
                                onClick={() => {
                                    setShowSuggestions(false)
                                    setIsCommandOpen(true)
                                }}
                                className="flex items-center gap-2 text-[11px] text-gray-500 hover:text-emerald-400 transition-colors w-full"
                            >
                                <HiSearch size={12} />
                                Open advanced search
                                <kbd className="ml-auto px-1.5 py-0.5 bg-gray-800/60 rounded border border-gray-700/50 text-[9px]">
                                    Ctrl+K
                                </kbd>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Command Palette */}
            <SearchCommand isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
        </>
    )
}

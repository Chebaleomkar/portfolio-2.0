'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { HiArrowRight, HiSparkles, HiX } from 'react-icons/hi'
import type { BlogPost } from '@/types/blog'

interface CuratedSidebarProps {
    posts: BlogPost[]
    isOpen?: boolean
    onClose?: () => void
    isMobile?: boolean
}

export function CuratedSidebar({ posts, isOpen = false, onClose, isMobile = false }: CuratedSidebarProps) {
    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobile, isOpen])

    // Desktop sidebar (always visible)
    if (!isMobile) {
        return (
            <aside className="sticky top-8 h-fit">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-lg">
                        <HiSparkles className="text-amber-400" size={18} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Curated Blogs</h2>
                        <p className="text-xs text-gray-500">Handpicked for you</p>
                    </div>
                </div>

                {/* Posts list */}
                <div className="space-y-3">
                    {posts.length === 0 ? (
                        <p className="text-gray-500 text-sm py-4">No curated posts yet</p>
                    ) : (
                        posts.map((post) => <CuratedPostCard key={post._id} post={post} />)
                    )}
                </div>
            </aside>
        )
    }

    // Mobile drawer
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Drawer - Opens from RIGHT */}
            <div
                className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-[#0a0a0a] border-l border-gray-800 
                    z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-lg">
                            <HiSparkles className="text-amber-400" size={18} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Curated Blogs</h2>
                            <p className="text-xs text-gray-500">Handpicked for you</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                        aria-label="Close curated blogs"
                    >
                        <HiX size={20} />
                    </button>
                </div>

                {/* Drawer Content */}
                <div className="p-5 overflow-y-auto h-[calc(100%-80px)]">
                    <div className="space-y-3">
                        {posts.length === 0 ? (
                            <p className="text-gray-500 text-sm py-4 text-center">No curated posts yet</p>
                        ) : (
                            posts.map((post) => <CuratedPostCard key={post._id} post={post} onClose={onClose} />)
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

// Individual curated post card
function CuratedPostCard({ post, onClose }: { post: BlogPost; onClose?: () => void }) {
    const CardWrapper = post.external ? 'a' : Link
    const cardProps = post.external
        ? { href: post.external, target: '_blank', rel: 'noopener noreferrer' }
        : { href: `/blog/${post.slug}` }

    return (
        <CardWrapper
            {...cardProps}
            onClick={onClose}
            className="group block p-4 rounded-xl border border-gray-800/60 bg-gray-900/30 
                 hover:border-amber-500/30 hover:bg-gray-900/60 transition-all duration-200"
        >
            {/* Tags */}
            <div className="flex items-center gap-2 mb-2">
                {post.tags.slice(0, 2).map((tag) => (
                    <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 bg-amber-500/10 text-amber-400/80 rounded font-medium uppercase tracking-wide"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Title */}
            <h3 className="text-white font-medium text-sm leading-snug mb-1.5 
                     group-hover:text-amber-50 transition-colors line-clamp-2">
                {post.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                {post.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-600">{post.createdAt}</span>
                <span className="flex items-center gap-1 text-xs text-amber-400/70 font-medium 
                         group-hover:text-amber-400 transition-colors">
                    Read
                    <HiArrowRight
                        className="group-hover:translate-x-0.5 transition-transform duration-200"
                        size={12}
                    />
                </span>
            </div>
        </CardWrapper>
    )
}

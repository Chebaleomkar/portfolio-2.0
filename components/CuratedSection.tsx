'use client'

import Link from 'next/link'
import { HiArrowRight, HiSparkles } from 'react-icons/hi'
import type { BlogPost } from '@/types/blog'

interface CuratedSectionProps {
    posts: BlogPost[]
}

export function CuratedSection({ posts }: CuratedSectionProps) {
    if (posts.length === 0) return null

    return (
        <div className="mb-12">
            {/* Premium container with gradient border */}
            <div className="relative rounded-2xl overflow-hidden">
                {/* Gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-orange-500/20 rounded-2xl" />

                {/* Inner content */}
                <div className="relative m-[1px] bg-[#0a0a0a] rounded-2xl p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-amber-500/20 to-yellow-500/10 rounded-lg">
                            <HiSparkles className="text-amber-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Curated for you</h2>
                            <p className="text-sm text-gray-500">Handpicked blogs you may like</p>
                        </div>
                    </div>

                    {/* Curated posts grid */}
                    <div className="space-y-3">
                        {posts.map((post, index) => {
                            const CardWrapper = post.external ? 'a' : Link
                            const cardProps = post.external
                                ? { href: post.external, target: '_blank', rel: 'noopener noreferrer' }
                                : { href: `/work/${post.slug}` }

                            return (
                                <CardWrapper
                                    key={post._id}
                                    {...cardProps}
                                    className="group flex items-start gap-4 p-4 rounded-xl bg-gray-900/30 hover:bg-gray-900/60 
                             border border-gray-800/50 hover:border-gray-700/50 transition-all duration-200"
                                >
                                    {/* Number badge */}
                                    <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/10 
                                   flex items-center justify-center text-amber-400 font-medium text-sm">
                                        {index + 1}
                                    </span>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium group-hover:text-gray-200 transition-colors truncate">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                                            {post.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            {post.tags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs px-2 py-0.5 bg-gray-800/50 rounded text-gray-400"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <HiArrowRight
                                        className="flex-shrink-0 text-gray-600 group-hover:text-amber-400 
                               group-hover:translate-x-1 transition-all mt-2"
                                        size={16}
                                    />
                                </CardWrapper>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

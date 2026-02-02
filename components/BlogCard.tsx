import Link from 'next/link'
import { HiArrowRight, HiStar } from 'react-icons/hi'
import type { BlogPost } from '@/types/blog'

interface BlogCardProps {
    post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
    const CardWrapper = post.external ? 'a' : Link
    const cardProps = post.external
        ? { href: post.external, target: '_blank', rel: 'noopener noreferrer' }
        : { href: `/blog/${post.slug}` }

    return (
        <CardWrapper
            {...cardProps}
            className="group block py-4 md:py-5 px-4 md:px-5 border-b border-white/5 hover:border-green-500/70 transition-all duration-200"
        >
            <div className="flex items-start justify-between gap-3 md:gap-4">
                <div className="flex-1 min-w-0">
                    {/* Title row - allow wrapping on mobile */}
                    <div className="flex items-start gap-2 mb-1.5 md:mb-2">
                        {post.isStarred && (
                            <HiStar className="text-yellow-500 flex-shrink-0 mt-0.5" size={14} />
                        )}
                        <h2 className="text-[15px] md:text-lg font-semibold text-white group-hover:text-green-400 transition-colors leading-snug line-clamp-2 md:truncate">
                            {post.title}
                        </h2>
                    </div>

                    {/* Description - 2 lines on mobile, 1 line on desktop */}
                    <p className="text-gray-400 text-sm mb-2.5 md:mb-3 line-clamp-2 md:truncate leading-relaxed">
                        {post.description}
                    </p>

                    {/* Date + Tags - stacked on very small screens */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="text-gray-500 font-medium">
                            {new Date(post.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </span>
                        {post.tags.length > 0 && (
                            <>
                                <span className="text-gray-700 hidden sm:inline">•</span>
                                <div className="flex gap-1.5 flex-wrap">
                                    {post.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-0.5 text-[10px] font-medium bg-gray-800/60 border border-gray-700/40 rounded-full text-gray-400 hover:text-gray-300 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {post.tags.length > 3 && (
                                        <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-800/40 rounded-full text-gray-500">
                                            +{post.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <HiArrowRight
                    size={18}
                    className="text-gray-600 group-hover:text-green-400 group-hover:translate-x-1 transition-all duration-200 mt-0.5 flex-shrink-0"
                />
            </div>
        </CardWrapper>
    )
}

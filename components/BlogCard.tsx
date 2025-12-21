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
            className="group block py-5 px-2 border-b border-white/5 hover:border-green-500 transition-colors"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex items-center gap-2 mb-2">
                        {post.isStarred && (
                            <HiStar className="text-yellow-500 flex-shrink-0" size={14} />
                        )}
                        <h2 className="text-base md:text-lg font-medium text-white group-hover:text-gray-300 transition-colors truncate">
                            {post.title}
                        </h2>
                    </div>

                    {/* Description - fixed to 1 line with ellipsis */}
                    <p className="text-gray-500 text-sm mb-3 truncate">
                        {post.description}
                    </p>

                    {/* Tags as keyword pills + date */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-600">{post.createdAt}</span>
                        {post.tags.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-[10px] font-medium bg-gray-800/80 border border-gray-700/50 rounded-full text-gray-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {post.tags.length > 3 && (
                                    <span className="px-2 py-0.5 text-[10px] font-medium bg-gray-800/50 rounded-full text-gray-500">
                                        +{post.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <HiArrowRight
                    size={16}
                    className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-1 flex-shrink-0"
                />
            </div>
        </CardWrapper>
    )
}

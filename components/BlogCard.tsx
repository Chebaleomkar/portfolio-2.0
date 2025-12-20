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
        : { href: `/work/${post.slug}` }

    return (
        <CardWrapper
            {...cardProps}
            className="group block py-6 border-b border-white/5 hover:border-white/20 transition-colors"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {post.isStarred && (
                            <HiStar className="text-yellow-500 flex-shrink-0" size={16} />
                        )}
                        <h2 className="text-lg md:text-xl font-medium text-white group-hover:text-gray-300 transition-colors">
                            {post.title}
                        </h2>
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{post.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>{post.createdAt}</span>
                        {post.tags.length > 0 && (
                            <>
                                <span>·</span>
                                <div className="flex gap-2 flex-wrap">
                                    {post.tags.map((tag) => (
                                        <span key={tag} className="text-gray-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <HiArrowRight
                    size={18}
                    className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-1 flex-shrink-0"
                />
            </div>
        </CardWrapper>
    )
}

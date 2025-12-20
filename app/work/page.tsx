import Link from "next/link"
import { HiArrowLeft, HiArrowRight } from "react-icons/hi"
import { getAllBlogPosts } from "@/lib/blog"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function WorkPage() {
    const posts = await getAllBlogPosts()

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            {/* Navigation */}
            <nav className="pt-8 px-6">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <HiArrowLeft size={16} />
                        Back
                    </Link>
                </div>
            </nav>

            {/* Content */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <header className="mb-16">
                        <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">Writing & Projects</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Work
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Thoughts on AI, engineering, and building things.
                        </p>
                    </header>

                    {/* Posts list */}
                    <div className="space-y-1">
                        {posts.map((post) => (
                            post.external ? (
                                <a
                                    key={post.slug}
                                    href={post.external}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block py-6 border-b border-white/5 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-lg md:text-xl font-medium text-white group-hover:text-gray-300 transition-colors mb-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-500 text-sm mb-3">
                                                {post.description}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                                <span>{post.createdAt}</span>
                                                {post.tags.length > 0 && (
                                                    <>
                                                        <span>·</span>
                                                        <div className="flex gap-2">
                                                            {post.tags.map((tag) => (
                                                                <span key={tag} className="text-gray-500">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <HiArrowRight
                                            size={18}
                                            className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-1"
                                        />
                                    </div>
                                </a>
                            ) : (
                                <Link
                                    key={post.slug}
                                    href={`/work/${post.slug}`}
                                    className="group block py-6 border-b border-white/5 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <h2 className="text-lg md:text-xl font-medium text-white group-hover:text-gray-300 transition-colors mb-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-gray-500 text-sm mb-3">
                                                {post.description}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-gray-600">
                                                <span>{post.createdAt}</span>
                                                {post.tags.length > 0 && (
                                                    <>
                                                        <span>·</span>
                                                        <div className="flex gap-2">
                                                            {post.tags.map((tag) => (
                                                                <span key={tag} className="text-gray-500">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <HiArrowRight
                                            size={18}
                                            className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-1"
                                        />
                                    </div>
                                </Link>
                            )
                        ))}
                    </div>

                    {/* Empty state */}
                    {posts.length === 0 && (
                        <div className="py-12 border border-dashed border-white/10 rounded-lg text-center">
                            <p className="text-gray-500">No posts yet. Create one via the API!</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

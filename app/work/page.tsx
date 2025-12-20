"use client"

import Link from "next/link"
import { HiArrowLeft, HiArrowRight } from "react-icons/hi"

// Blog posts data - you can move this to a separate file later
const posts = [
    {
        slug: "what-why-how-zod-works",
        title: "What, Why and How Zod Works?",
        description: "Understanding the popular TypeScript-first schema validation library",
        date: "2024",
        tags: ["TypeScript", "Zod", "Validation"],
        external: "https://medium.com/@omkarchebale0/what-why-and-how-zod-works-b022e3bd13ec"
    },
]

export default function WorkPage() {
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
                                            <span>{post.date}</span>
                                            <span>·</span>
                                            <div className="flex gap-2">
                                                {post.tags.map((tag) => (
                                                    <span key={tag} className="text-gray-500">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <HiArrowRight
                                        size={18}
                                        className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all mt-1"
                                    />
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Empty state for future posts */}
                    {posts.length === 1 && (
                        <div className="mt-16 py-12 border border-dashed border-white/10 rounded-lg text-center">
                            <p className="text-gray-500">More posts coming soon...</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

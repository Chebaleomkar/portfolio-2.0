'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HiArrowLeft, HiEye, HiPencil } from 'react-icons/hi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Navbar } from '@/components/navbar'

export default function BlogPreviewPage() {
    const [content, setContent] = useState('')
    const [isPreview, setIsPreview] = useState(false)

    // Get word count and read time
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

    // Get today's date formatted
    const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <main className="min-h-screen bg-[#0a0a0a]">
            <Navbar />

            {/* Navigation */}
            <nav className="pt-8 px-6">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        <HiArrowLeft size={16} />
                        Back to Blog
                    </Link>

                    {/* Toggle */}
                    <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1 border border-gray-800">
                        <button
                            onClick={() => setIsPreview(false)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${!isPreview ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <HiPencil size={12} />
                            Write
                        </button>
                        <button
                            onClick={() => setIsPreview(true)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${isPreview ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <HiEye size={12} />
                            Preview
                        </button>
                    </div>
                </div>
            </nav>

            {/* Editor Mode */}
            {!isPreview && (
                <div className="py-16 px-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-xs text-gray-600">
                                Paste your markdown content below
                            </p>
                            {content && (
                                <p className="text-xs text-gray-600">
                                    {wordCount} words · {readTime} min read
                                </p>
                            )}
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="# Your Blog Title

Paste your markdown here..."
                            className="w-full min-h-[60vh] p-0 bg-transparent text-gray-300 placeholder:text-gray-700 text-base leading-relaxed focus:outline-none resize-none"
                            autoFocus
                        />
                    </div>
                </div>
            )}

            {/* Preview Mode - EXACT same structure as actual blog */}
            {isPreview && (
                <article className="py-16 px-6">
                    <div className="max-w-3xl mx-auto">
                        <header className="mb-12">
                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
                                <span>{today}</span>
                                <span>·</span>
                                <span>{readTime} min read</span>
                            </div>
                        </header>

                        {/* Content - Rendered Markdown */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">{children}</h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-2xl font-bold text-white mt-8 mb-3">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-xl font-semibold text-white mt-6 mb-2">{children}</h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="text-gray-300 leading-relaxed mb-4">{children}</p>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    strong: ({ children }) => (
                                        <strong className="text-white font-semibold">{children}</strong>
                                    ),
                                    em: ({ children }) => (
                                        <em className="text-gray-200 italic">{children}</em>
                                    ),
                                    code: ({ className, children }) => {
                                        const isInline = !className
                                        if (isInline) {
                                            return (
                                                <code className="text-emerald-400 bg-gray-800/70 px-1.5 py-0.5 rounded text-sm font-mono">
                                                    {children}
                                                </code>
                                            )
                                        }
                                        return <code className={className}>{children}</code>
                                    },
                                    pre: ({ children }) => (
                                        <pre className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-4">
                                            {children}
                                        </pre>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4 ml-4">
                                            {children}
                                        </ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-4 ml-4">
                                            {children}
                                        </ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="text-gray-300">{children}</li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 bg-gray-900/50 rounded-r">
                                            <div className="text-gray-400 italic">{children}</div>
                                        </blockquote>
                                    ),
                                    hr: () => (
                                        <hr className="border-gray-800 my-8" />
                                    ),
                                }}
                            >
                                {content || '*No content to preview*'}
                            </ReactMarkdown>
                        </div>
                    </div>
                </article>
            )}
        </main>
    )
}

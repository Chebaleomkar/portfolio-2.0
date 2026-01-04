'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiArrowRight, HiSparkles } from 'react-icons/hi'

interface Recommendation {
    slug: string
    title: string
    description: string
    score: number
}

interface BlogRecommendationsProps {
    currentSlug: string
}

export function BlogRecommendations({ currentSlug }: BlogRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                setLoading(true)
                const response = await fetch(`/api/recommendations/${currentSlug}`)
                const data = await response.json()

                if (data.success) {
                    setRecommendations(data.recommendations)
                } else {
                    setError(data.error || 'Failed to load recommendations')
                }
            } catch (err) {
                console.error('Error fetching recommendations:', err)
                setError('Failed to load recommendations')
            } finally {
                setLoading(false)
            }
        }

        fetchRecommendations()
    }, [currentSlug])

    // Don't render anything if loading, error, or no recommendations
    if (loading) {
        return (
            <section className="mt-16 pt-12 border-t border-gray-800">
                <div className="flex items-center gap-2 mb-8">
                    <HiSparkles className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-xl font-bold text-white">You might also enjoy</h2>
                </div>
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="animate-pulse bg-gray-800/50 rounded-lg h-24"
                        />
                    ))}
                </div>
            </section>
        )
    }

    if (error || recommendations.length === 0) {
        return null
    }

    return (
        <section className="mt-16 pt-12 border-t border-gray-800">
            {/* Header */}
            <div className="flex items-center gap-2 mb-8">
                <HiSparkles className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">You might also enjoy</h2>
            </div>

            {/* Recommendations Grid */}
            <div className="grid gap-4">
                {recommendations.map((rec) => (
                    <Link
                        key={rec.slug}
                        href={`/blog/${rec.slug}`}
                        className="group block"
                    >
                        <article className="p-5 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-emerald-500/30 hover:bg-gray-900/80 transition-all duration-300">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2">
                                        {rec.title}
                                    </h3>

                                    {/* Description */}
                                    {rec.description && (
                                        <p className="text-sm text-gray-400 line-clamp-2">
                                            {rec.description}
                                        </p>
                                    )}

                                    {/* Similarity Score Badge */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {Math.round(rec.score * 100)}% match
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow Icon */}
                                <div className="flex-shrink-0 mt-1">
                                    <HiArrowRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'

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

    if (loading) {
        return (
            <section className="mt-20 pt-12 border-t border-white/5">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                    Related Reading
                </h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="animate-pulse bg-white/5 rounded-lg h-20"
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
        <section className="mt-20 pt-12 border-t border-white/5">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-6">
                Related Reading
            </h2>

            <div className="space-y-4">
                {recommendations.map((rec, index) => (
                    <Link
                        key={rec.slug}
                        href={`/blog/${rec.slug}`}
                        className="group block"
                    >
                        <article className="relative p-[1px] rounded-xl bg-gradient-to-r from-emerald-500/20 via-emerald-500/10 to-transparent transition-all duration-500">
                            <div className="p-5 rounded-xl bg-[#0a0a0a] flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold text-orange-500/60 transition-colors">
                                        0{index + 1}
                                    </span>
                                    <div>
                                        <h3 className="text-base font-medium text-white transition-colors line-clamp-1">
                                            {rec.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            <span className="text-emerald-500">{Math.round(rec.score * 100)}%</span> Semantically similar
                                        </p>
                                    </div>
                                </div>
                                <HiArrowRight className="w-4 h-4 text-emerald-600 transition-all flex-shrink-0" />
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </section>
    )
}
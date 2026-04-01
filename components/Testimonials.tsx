"use client"

import { clientReviews } from "@/utils/data"
import { memo } from "react"
import { HiStar } from "react-icons/hi"
import { ScrollReveal } from "./ScrollReveal"

export const Testimonials = memo(() => {
  if (clientReviews.length === 0) return null

  return (
    <section className="py-24 bg-[#0a0a0a] relative" aria-labelledby="testimonials-heading">
      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative">
        <ScrollReveal>
          <header className="mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">Feedback</p>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-white">
              What Clients Say
            </h2>
          </header>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientReviews.map((review, index) => (
            <ScrollReveal key={review.by} delay={index * 0.1}>
              <div
                className="group p-6 md:p-8 rounded-xl border border-white/5 bg-white/[0.02]
                           hover:border-white/10 transition-all duration-300 h-full flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <HiStar key={i} size={16} className="text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 mb-6">
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed italic">
                    &ldquo;{review.review}&rdquo;
                  </p>
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                  <div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20
                               border border-white/10 flex items-center justify-center
                               text-white font-semibold text-sm"
                  >
                    {review.by
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{review.by}</p>
                    <p className="text-gray-500 text-xs">{review.profession}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
})

Testimonials.displayName = "Testimonials"

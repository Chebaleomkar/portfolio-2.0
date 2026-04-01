"use client"

import { ClientProjects } from "@/utils/data"
import { memo } from "react"
import { HiArrowRight, HiLightningBolt } from "react-icons/hi"
import { ScrollReveal } from "./ScrollReveal"

export const FeaturedWork = memo(() => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative" aria-labelledby="work-heading">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative">
        <ScrollReveal>
          <header className="mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">Real impact</p>
            <h2 id="work-heading" className="text-3xl md:text-4xl font-bold text-white">
              Businesses I&apos;ve Helped
            </h2>
          </header>
        </ScrollReveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ClientProjects.map((project, index) => {
            // Alternate between large (col-span-2) and small (col-span-1)
            const isLarge = index % 3 === 0

            return (
              <ScrollReveal
                key={project.business}
                delay={index * 0.08}
                className={isLarge ? "md:col-span-2" : "md:col-span-1"}
              >
                <div
                  className="group h-full p-6 rounded-xl border border-white/5 bg-white/[0.02]
                             hover:border-white/10 hover:bg-white/[0.04]
                             transition-all duration-300 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {project.business}
                      </h3>
                      <p className="text-emerald-500/80 text-xs font-medium mt-1">
                        {project.project}
                      </p>
                    </div>
                    {project.year && (
                      <span className="text-[10px] text-gray-600 font-mono bg-white/5 px-2 py-1 rounded">
                        {project.year}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Impact */}
                  {project.impact && (
                    <div className="flex items-start gap-2 mt-4 pt-4 border-t border-white/5">
                      <HiLightningBolt size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-amber-400/80 text-xs leading-relaxed">
                        {project.impact}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
})

FeaturedWork.displayName = "FeaturedWork"

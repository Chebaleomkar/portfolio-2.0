"use client"

import { skills } from "@/utils/data"
import { memo } from "react"
import { ScrollReveal } from "./ScrollReveal"

interface SkillCategoryType {
  title: string
  skills: string[]
}

export const Skills = memo(() => {
  return (
    <section
      id="skills"
      className="py-24 bg-[#0a0a0a] relative"
      aria-labelledby="skills-heading"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative">
        {/* Section header */}
        <ScrollReveal>
          <header className="mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">What I work with</p>
            <h2
              id="skills-heading"
              className="text-3xl md:text-4xl font-bold text-white"
            >
              Skills
            </h2>
          </header>
        </ScrollReveal>

        {/* Skills grid */}
        <div className="space-y-12">
          {skills.map((category, index) => (
            <ScrollReveal key={category.title} delay={index * 0.1}>
              <SkillCategory category={category as SkillCategoryType} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
})

const SkillCategory = memo(({ category }: { category: SkillCategoryType }) => {
  return (
    <div className="group">
      <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
        {category.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="px-4 py-2 text-sm text-gray-300 border border-white/10 rounded-full
                       hover:border-emerald-500/40 hover:text-white hover:bg-emerald-500/5
                       hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]
                       transition-all duration-300 cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
})

Skills.displayName = "Skills"
SkillCategory.displayName = "SkillCategory"

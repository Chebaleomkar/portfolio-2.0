"use client"

import { skills } from "@/utils/data"
import { memo } from "react"

interface SkillCategoryType {
  title: string
  skills: string[]
}

export const Skills = memo(() => {
  return (
    <section
      id="skills"
      className="py-24 bg-[#0a0a0a]"
      aria-labelledby="skills-heading"
    >
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Section header */}
        <header className="mb-16">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">What I work with</p>
          <h2
            id="skills-heading"
            className="text-3xl md:text-4xl font-bold text-white"
          >
            Skills
          </h2>
        </header>

        {/* Skills grid */}
        <div className="space-y-12">
          {skills.map((category) => (
            <SkillCategory key={category.title} category={category as SkillCategoryType} />
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
            className="px-4 py-2 text-sm text-gray-300 border border-white/10 rounded-full hover:border-white/30 hover:text-white transition-all duration-300 cursor-default"
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

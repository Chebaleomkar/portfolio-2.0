"use client"

import { skills } from "@/utils/data"
import Image from "next/image"
import { memo } from "react"

interface Skill {
  name: string
  image: string
  description?: string
}

interface SkillCategoryType {
  title: string
  skills: Skill[]
}

export const Skills = memo(() => {
  return (
    <section
      id="skills"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="skills-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="text-center mb-16">
          <h2
            id="skills-heading"
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Technical Skills
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life
          </p>
        </header>

        <div className="space-y-12">
          { skills.map((category, index) => (
            <SkillCategory key={ category.title } category={ category } />
          )) }
        </div>
      </div>
    </section>
  )
})

const SkillCategory = memo(({ category }: { category: SkillCategoryType }) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100 dark:border-gray-700">
      <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
        { category.title }
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        { category.skills.map((skill) => (
          <SkillItem key={ skill.name } skill={ skill } />
        )) }
      </div>
    </article>
  )
})

const SkillItem = memo(({ skill }: { skill: Skill }) => {
  return (
    <div className="group flex flex-col items-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-200 border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
      <div className="relative w-12 h-12 mb-3 group-hover:scale-110 transition-transform duration-200">
        <Image
          src={ skill.image || "/placeholder.svg" }
          alt={ `${skill.name} logo` }
          fill
          className="object-contain rounded-lg"
          sizes="48px"
        />
      </div>

      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 text-center mb-1">
        { skill.name }
      </h4>

      { skill.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center line-clamp-2">
          { skill.description }
        </p>
      ) }
    </div>
  )
})

Skills.displayName = "Skills"
SkillCategory.displayName = "SkillCategory"
SkillItem.displayName = "SkillItem"

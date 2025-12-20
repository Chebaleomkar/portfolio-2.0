"use client"

import { skills } from "@/utils/data"
import Link from "next/link"
import { memo } from "react"
import { HiArrowLeft } from "react-icons/hi"

interface SkillCategoryType {
    title: string
    skills: string[]
}

export default function SkillsPage() {
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
                        <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">What I work with</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Skills
                        </h1>
                    </header>

                    {/* Skills grid */}
                    <div className="space-y-12">
                        {skills.map((category) => (
                            <SkillCategory key={category.title} category={category as SkillCategoryType} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}

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

SkillCategory.displayName = "SkillCategory"

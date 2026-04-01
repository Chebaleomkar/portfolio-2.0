"use client"

import { Navbar } from "@/components/navbar"
import { ScrollReveal } from "@/components/ScrollReveal"
import { Bio, experiences } from "@/utils/data"
import type { Experience } from "@/utils/data"
import Link from "next/link"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { HiArrowLeft } from "react-icons/hi"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] relative">
            {/* Ambient glows */}
            <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-1/4 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

            {/* Navigation */}
            <Navbar />
            <nav className="pt-24 px-6">
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
            <section className="py-20 px-6 relative">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <ScrollReveal>
                        <header className="mb-16">
                            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">About</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {Bio.name.trim()}
                            </h1>
                        </header>
                    </ScrollReveal>

                    {/* Bio content */}
                    <ScrollReveal delay={0.1}>
                        <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
                            <p>
                                I&apos;m an AI Engineer with a strong foundation in software engineering.
                                I build production-grade AI systems, focusing on LLM-powered applications,
                                RAG pipelines, and scalable full-stack solutions.
                            </p>

                            <p>
                                Currently working as an AI Engineer Intern at AI Planet, where I focus on
                                building agentic AI systems and intelligent workflows. Previously, I was
                                an AI Engineer Intern at Xclusive Interiors, designing and building
                                AI-driven automation for internal business processes.
                            </p>
                            <p>
                                I also led full-stack engineering at RecursiveZero, architecting
                                multi-tenant B2B platforms from the ground up, and have a proven
                                track record of delivering production-grade solutions.
                            </p>

                            <p>
                                I&apos;m comfortable operating in fast-moving environments where ownership,
                                correctness, and performance matter. I enjoy solving complex problems
                                and turning ambiguous requirements into reliable, deployed solutions.
                            </p>
                        </div>
                    </ScrollReveal>

                    {/* Experience */}
                    <div className="mt-16">
                        <ScrollReveal>
                            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-8">Experience</h2>
                        </ScrollReveal>

                        <div className="space-y-10">
                            {experiences.map((exp, index) => (
                                <ScrollReveal key={exp.company} delay={0.1 + index * 0.05}>
                                    <ExperienceCard exp={exp} isFirst={index === 0} />
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="mt-16">
                        <ScrollReveal>
                            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Education</h2>
                        </ScrollReveal>
                        <div className="space-y-4">
                            <ScrollReveal delay={0.05}>
                                <div className="border-l-2 border-white/10 pl-4">
                                    <p className="text-white font-medium">Master of Computer Applications (MCA)</p>
                                    <p className="text-gray-500 text-sm">In Progress</p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.1}>
                                <div className="border-l-2 border-white/10 pl-4">
                                    <p className="text-white font-medium">Bachelor of Computer Applications (BCA)</p>
                                    <p className="text-gray-500 text-sm">Completed</p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>

                    {/* Connect */}
                    <div className="mt-16">
                        <ScrollReveal>
                            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Connect</h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.05}>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={Bio.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white
                                               border border-white/10 rounded-full hover:border-emerald-500/30
                                               hover:bg-emerald-500/5 transition-all text-sm"
                                >
                                    <FaGithub size={16} />
                                    GitHub
                                </a>
                                <a
                                    href={Bio.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white
                                               border border-white/10 rounded-full hover:border-emerald-500/30
                                               hover:bg-emerald-500/5 transition-all text-sm"
                                >
                                    <FaLinkedin size={16} />
                                    LinkedIn
                                </a>
                                <a
                                    href={Bio.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white
                                               border border-white/10 rounded-full hover:border-emerald-500/30
                                               hover:bg-emerald-500/5 transition-all text-sm"
                                >
                                    <FaTwitter size={16} />
                                    Twitter
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </main>
    )
}

// Color mapping for Tailwind classes (must be static strings for Tailwind to detect)
const colorMap: Record<string, { border: string; dot: string; text: string; bullet: string }> = {
    emerald: {
        border: "border-emerald-500/30",
        dot: "bg-emerald-500",
        text: "text-emerald-400",
        bullet: "text-emerald-500",
    },
    orange: {
        border: "border-orange-500/30",
        dot: "bg-orange-500",
        text: "text-orange-400",
        bullet: "text-orange-500",
    },
    blue: {
        border: "border-blue-500/30",
        dot: "bg-blue-500",
        text: "text-blue-400",
        bullet: "text-blue-500",
    },
    purple: {
        border: "border-purple-500/30",
        dot: "bg-purple-500",
        text: "text-purple-400",
        bullet: "text-purple-500",
    },
    gray: {
        border: "border-gray-800",
        dot: "bg-gray-700",
        text: "text-gray-400",
        bullet: "text-gray-600",
    },
}

function ExperienceCard({ exp, isFirst }: { exp: Experience; isFirst: boolean }) {
    const c = colorMap[exp.color] || colorMap.gray

    return (
        <div className={`relative pl-6 border-l-2 ${isFirst ? c.border : "border-gray-800"}`}>
            <div className={`absolute -left-[9px] top-0 w-4 h-4 ${c.dot} rounded-full border-4 border-[#0a0a0a]`} />
            <div className="mb-2">
                <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                {exp.companyUrl ? (
                    <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${c.text} hover:opacity-80 transition-opacity`}
                    >
                        <p className="font-medium">{exp.company}</p>
                    </a>
                ) : (
                    <p className={`${c.text} font-medium`}>{exp.company}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">{exp.date}</p>
            </div>
            <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className={`${c.bullet} mt-1.5`}>•</span>
                        <span>
                            {h.bold
                                ? renderHighlight(h.text, h.bold)
                                : h.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

function renderHighlight(text: string, bold: string) {
    const parts = text.split("{bold}")
    return (
        <>
            {parts[0]}<strong className="text-white">{bold}</strong>{parts[1] || ""}
        </>
    )
}

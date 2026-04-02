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

            <section className="py-16 px-6 relative">
                <div className="max-w-3xl mx-auto">
                    {/* Header + Bio */}
                    <ScrollReveal>
                        <header className="mb-20">
                            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">About</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                {Bio.name.trim()}
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                                AI Engineer and Full-Stack Developer building production-grade LLM systems,
                                RAG pipelines, and scalable web applications. Currently at AI Planet —
                                previously shipped AI automation at Xclusive Interiors and led engineering
                                at RecursiveZero.
                            </p>
                        </header>
                    </ScrollReveal>

                    {/* Experience */}
                    <ScrollReveal>
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-10">Experience</h2>
                    </ScrollReveal>

                    <div className="space-y-0">
                        {experiences.map((exp, index) => (
                            <ScrollReveal key={exp.company} delay={index * 0.06}>
                                <ExperienceCard exp={exp} isLast={index === experiences.length - 1} />
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Education */}
                    <div className="mt-20">
                        <ScrollReveal>
                            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Education</h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.05}>
                            <div className="space-y-4">
                                <div className="border-l-2 border-white/10 pl-4 py-0.5">
                                    <p className="text-white font-medium text-[15px]">Master of Computer Applications (MCA)</p>
                                    <p className="text-gray-500 text-sm">In Progress</p>
                                </div>
                                <div className="border-l-2 border-white/10 pl-4 py-0.5">
                                    <p className="text-white font-medium text-[15px]">Bachelor of Computer Applications (BCA)</p>
                                    <p className="text-gray-500 text-sm">Completed</p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Connect */}
                    <div className="mt-20">
                        <ScrollReveal>
                            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Connect</h2>
                        </ScrollReveal>
                        <ScrollReveal delay={0.05}>
                            <div className="flex flex-wrap gap-3">
                                {[
                                    { href: Bio.github, icon: FaGithub, label: "GitHub" },
                                    { href: Bio.linkedin, icon: FaLinkedin, label: "LinkedIn" },
                                    { href: Bio.twitter, icon: FaTwitter, label: "Twitter" },
                                ].map(({ href, icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white
                                                   border border-white/10 rounded-full hover:border-emerald-500/30
                                                   hover:bg-emerald-500/5 transition-all text-sm"
                                    >
                                        <Icon size={15} />
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>
        </main>
    )
}

// ─── Color System ────────────────────────────────────────────────────────────

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
    red: {
        border: "border-red-500/30",
        dot: "bg-red-500",
        text: "text-red-400",
        bullet: "text-red-500",
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

// ─── Experience Card ─────────────────────────────────────────────────────────

function ExperienceCard({ exp, isLast }: { exp: Experience; isLast: boolean }) {
    const c = colorMap[exp.color] || colorMap.gray

    return (
        <div className={`relative pl-8 pb-10 ${!isLast ? `border-l-2 ${c.border}` : ""} ml-2`}>
            {/* Timeline dot */}
            <div className={`absolute -left-[7px] top-1 w-3.5 h-3.5 ${c.dot} rounded-full border-[3px] border-[#0a0a0a]`} />

            {/* Role + Company */}
            <h3 className="text-lg font-semibold text-white leading-snug">{exp.role}</h3>
            {exp.companyUrl ? (
                <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${c.text} font-medium text-sm hover:opacity-80 transition-opacity`}
                >
                    {exp.company}
                </a>
            ) : (
                <p className={`${c.text} font-medium text-sm`}>{exp.company}</p>
            )}
            <p className="text-gray-600 text-xs mt-1 mb-3">{exp.date}</p>

            {/* Highlights */}
            <ul className="space-y-1.5">
                {exp.highlights.map((h, i) => (
                    <li key={i} className="flex items-baseline gap-2 text-gray-400 text-sm leading-relaxed">
                        <span className={`${c.bullet} text-[8px] mt-[5px] flex-shrink-0`}>●</span>
                        <span>
                            {h.bold ? renderHighlight(h.text, h.bold) : h.text}
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

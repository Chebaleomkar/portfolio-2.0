"use client"

import { Navbar } from "@/components/navbar"
import { ScrollReveal } from "@/components/ScrollReveal"
import { Bio } from "@/utils/data"
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
                                Currently working as an AI Engineer at Xclusive Interiors, where I design
                                and build AI-driven automation for internal business workflows. Previously,
                                I led full-stack engineering at RecursiveZero, architecting multi-tenant
                                B2B platforms from the ground up.
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
                            {/* Experience 1 */}
                            <ScrollReveal delay={0.1}>
                                <div className="relative pl-6 border-l-2 border-emerald-500/30">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0a0a0a]" />
                                    <div className="mb-2">
                                        <h3 className="text-xl font-semibold text-white">
                                            AI Engineer
                                        </h3>
                                        <p className="text-emerald-400 font-medium">Xclusive Interiors Pvt. Ltd.</p>
                                        <p className="text-gray-500 text-sm mt-1">Dec 2024 - Present</p>
                                    </div>
                                    <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1.5">•</span>
                                            <span>Building <strong className="text-white">AI-driven automation</strong> for internal business workflows</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1.5">•</span>
                                            <span>Designing LLM-powered systems with focus on <strong className="text-white">reliability, cost, and latency</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-emerald-500 mt-1.5">•</span>
                                            <span>Collaborating cross-functionally to translate product requirements into deployable AI solutions</span>
                                        </li>
                                    </ul>
                                </div>
                            </ScrollReveal>

                            {/* Experience 2 */}
                            <ScrollReveal delay={0.15}>
                                <div className="relative pl-6 border-l-2 border-gray-800">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-gray-700 rounded-full border-4 border-[#0a0a0a]" />
                                    <div className="mb-2">
                                        <h3 className="text-xl font-semibold text-white">
                                            Full-Stack Engineer (Lead)
                                        </h3>
                                        <a
                                            href="https://recursivezero.com/about/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <p className="font-medium">RecursiveZero Pvt. Ltd.</p>
                                        </a>
                                        <p className="text-gray-500 text-sm mt-1">Jan 2024 - Jul 2025 · 1 yr 7 mos</p>
                                    </div>
                                    <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1.5">•</span>
                                            <span>Architected and shipped a <strong className="text-white">multi-tenant B2B e-commerce platform</strong> end-to-end</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1.5">•</span>
                                            <span>Designed <strong className="text-white">secure authentication and RBAC</strong> for buyers, sellers, and admins</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1.5">•</span>
                                            <span>Built high-throughput backend services for <strong className="text-white">catalogs, orders, and inventory</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1.5">•</span>
                                            <span>Improved API and query performance by <strong className="text-white">around 40 percent</strong> through indexing and query optimization</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1.5">•</span>
                                            <span>Served as <strong className="text-white">technical owner</strong> from system design to production deployment</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-600 mt-1.5">•</span>
                                            <span>Mentored junior engineers, reviewed PRs and set engineering standards</span>
                                        </li>
                                    </ul>
                                </div>
                            </ScrollReveal>
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

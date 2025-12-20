"use client"

import { Bio } from "@/utils/data"
import Link from "next/link"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { HiArrowLeft } from "react-icons/hi"

export default function AboutPage() {
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
                        <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">About</p>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {Bio.name.trim()}
                        </h1>
                    </header>

                    {/* Bio content */}
                    <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
                        <p>
                            I'm an AI Engineer with a strong foundation in software engineering.
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
                            I'm comfortable operating in fast-moving environments where ownership,
                            correctness, and performance matter. I enjoy solving complex problems
                            and turning ambiguous requirements into reliable, deployed solutions.
                        </p>
                    </div>

                    {/* Education */}
                    <div className="mt-16">
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Education</h2>
                        <div className="space-y-4">
                            <div className="border-l-2 border-white/10 pl-4">
                                <p className="text-white font-medium">Master of Computer Applications (MCA)</p>
                                <p className="text-gray-500 text-sm">In Progress</p>
                            </div>
                            <div className="border-l-2 border-white/10 pl-4">
                                <p className="text-white font-medium">Bachelor of Computer Applications (BCA)</p>
                                <p className="text-gray-500 text-sm">Completed</p>
                            </div>
                        </div>
                    </div>

                    {/* Connect */}
                    <div className="mt-16">
                        <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6">Connect</h2>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={Bio.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white border border-white/10 rounded-full hover:border-white/30 transition-all text-sm"
                            >
                                <FaGithub size={16} />
                                GitHub
                            </a>
                            <a
                                href={Bio.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white border border-white/10 rounded-full hover:border-white/30 transition-all text-sm"
                            >
                                <FaLinkedin size={16} />
                                LinkedIn
                            </a>
                            <a
                                href={Bio.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white border border-white/10 rounded-full hover:border-white/30 transition-all text-sm"
                            >
                                <FaTwitter size={16} />
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

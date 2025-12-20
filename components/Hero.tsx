"use client"

import { Bio } from "@/utils/data"
import Link from "next/link"
import { memo } from "react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { HiArrowDown } from "react-icons/hi"

export const Hero = memo(() => {
  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0a]">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/5 via-cyan-500/5 to-transparent blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-20 pt-8 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-white/90 hover:text-white transition-colors font-medium tracking-tight"
          >
            {Bio.name.trim().split(' ')[0]}
            <span className="text-emerald-400">.</span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/work" className="text-sm text-gray-500 hover:text-white transition-colors">
              Work
            </Link>
            <Link href="/skills" className="text-sm text-gray-500 hover:text-white transition-colors">
              Skills
            </Link>
            <Link href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">

          {/* Name */}
          <h1 className="mb-6">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white">
              {Bio.name.trim()}
            </span>
          </h1>

          {/* Social links */}
          <div className="flex items-center justify-center gap-6">
            <a
              href={Bio.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href={Bio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href={Bio.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
              aria-label="Twitter"
            >
              <FaTwitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-white transition-colors duration-300 z-20 group"
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
          <HiArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
        </div>
      </button>
    </section>
  )
})

Hero.displayName = "Hero"

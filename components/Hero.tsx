"use client"

import { Bio } from "@/utils/data"
import Link from "next/link"
import { memo } from "react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { HiArrowDown, HiLightningBolt, HiSparkles } from "react-icons/hi"
import { Navbar } from "./navbar"

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

      {/* Gradient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/8 via-cyan-500/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-purple-500/5 via-pink-500/3 to-transparent blur-3xl" />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 md:px-6 py-8 md:py-0">
        <div className={`max-w-5xl mx-auto w-full transition-all duration-700`}>
          {/* Name & Role */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4">
              Omkar Chebale
            </h1>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center gap-6 md:gap-12 mb-8">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">1.5+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Years Exp</p>
            </div>
            <div className="w-px h-12 bg-gray-800" />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">72+</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Repos</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/blog"
              className="w-full sm:w-auto px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <HiSparkles size={18} />
              Read My Blogs
            </Link>
            <button
              onClick={() => {
                const subjectInput = document.getElementById('contact-subject')
                if (subjectInput) {
                  subjectInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  setTimeout(() => subjectInput.focus(), 500)
                }
              }}
              className="w-full sm:w-auto px-6 py-3 border border-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-800/50 hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <HiLightningBolt size={18} />
              Let's Connect
            </button>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <a
              href={Bio.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
              aria-label="GitHub"
            >
              <FaGithub size={18} />
            </a>
            <a
              href={Bio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href={Bio.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-gray-800/50 transition-all duration-200"
              aria-label="Twitter"
            >
              <FaTwitter size={18} />
            </a>
          </div>


        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-white transition-colors duration-300 z-20 group"
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
          <HiArrowDown size={16} className="group-hover:translate-y-1 transition-transform animate-bounce" />
        </div>
      </button>

      {/* Fade-in animation style */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </section>
  )
})

Hero.displayName = "Hero"

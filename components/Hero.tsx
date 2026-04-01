"use client"

import { Bio } from "@/utils/data"
import Link from "next/link"
import { memo, useState, useEffect, useCallback } from "react"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import { HiArrowDown, HiLightningBolt, HiSparkles } from "react-icons/hi"
import { TypeAnimation } from "react-type-animation"
import { Navbar } from "./navbar"

export const Hero = memo(() => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [])

  const scrollToNext = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
  }, [])

  return (
    <section className="min-h-screen flex flex-col relative overflow-hidden bg-[#0a0a0a]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Mouse-tracking spotlight on grid */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.07), transparent 40%)`,
        }}
      />

      {/* Gradient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-emerald-500/8 via-cyan-500/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-gradient-to-tl from-purple-500/5 via-pink-500/3 to-transparent blur-3xl" />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 md:px-6 py-8 md:py-0">
        <div className="max-w-5xl mx-auto w-full animate-hero-fade-in">
          {/* Name & Role */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5
                         bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent"
            >
              {Bio.name.trim()}
            </h1>

            {/* Typing animation for roles */}
            <div className="h-8 md:h-10 flex items-center justify-center">
              <TypeAnimation
                sequence={[
                  "AI Engineer", 2500,
                  "Full-Stack Developer", 2500,
                  "Building Intelligent Systems", 2500,
                ]}
                wrapper="span"
                speed={40}
                deletionSpeed={60}
                repeat={Infinity}
                className="text-lg md:text-xl text-emerald-400 font-medium"
              />
            </div>

            {/* Brief description */}
            <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto mt-5 leading-relaxed">
              Building production-grade AI systems, scalable web apps, and
              automation that makes businesses move faster.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/blogs"
              className="w-full sm:w-auto px-6 py-3 bg-white text-black font-medium rounded-lg
                         hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <HiSparkles size={18} />
              Read My Blogs
            </Link>
            <button
              onClick={() => {
                const el = document.getElementById("contact-subject")
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "center" })
                  setTimeout(() => el.focus(), 500)
                }
              }}
              className="w-full sm:w-auto px-6 py-3 border border-gray-700 text-gray-300 font-medium rounded-lg
                         hover:bg-gray-800/50 hover:border-gray-600 transition-colors
                         flex items-center justify-center gap-2"
            >
              <HiLightningBolt size={18} />
              Let&apos;s Connect
            </button>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3 mb-10">
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
                className="p-3 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-400
                           hover:text-white hover:border-gray-700 hover:bg-gray-800/50
                           transition-all duration-200"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-gray-600
                   hover:text-white transition-colors duration-300 z-20 group"
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
          <HiArrowDown
            size={16}
            className="group-hover:translate-y-1 transition-transform animate-bounce"
          />
        </div>
      </button>
    </section>
  )
})

Hero.displayName = "Hero"

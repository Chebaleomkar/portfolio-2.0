"use client"

import { memo } from "react"
import { HiLightningBolt, HiCode, HiCube, HiChip } from "react-icons/hi"
import { ScrollReveal } from "./ScrollReveal"

const services = [
  {
    icon: HiChip,
    title: "AI & ML Solutions",
    description:
      "LLM-powered applications, RAG pipelines, agentic workflows, and intelligent automation that solve real business problems.",
  },
  {
    icon: HiCode,
    title: "Full-Stack Development",
    description:
      "End-to-end web applications with React, Next.js, Node.js, and MongoDB — from system design to production deployment.",
  },
  {
    icon: HiLightningBolt,
    title: "Business Automation",
    description:
      "WhatsApp bots, automated quotation systems, and workflow tools that eliminate manual work and save hours daily.",
  },
  {
    icon: HiCube,
    title: "Technical Consulting",
    description:
      "Architecture reviews, performance optimization, and hands-on guidance to help teams ship faster and build better.",
  },
]

export const Services = memo(() => {
  return (
    <section className="py-24 bg-[#0a0a0a] relative" aria-labelledby="services-heading">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-5xl relative">
        <ScrollReveal>
          <header className="mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">What I do</p>
            <h2 id="services-heading" className="text-3xl md:text-4xl font-bold text-white">
              Services
            </h2>
          </header>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 0.08}>
              <div
                className="group p-6 rounded-xl border border-white/5 bg-white/[0.02]
                           hover:border-white/10 hover:bg-white/[0.04]
                           transition-all duration-300"
              >
                <service.icon
                  size={24}
                  className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
})

Services.displayName = "Services"

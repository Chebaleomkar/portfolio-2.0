"use client"

import { memo, useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"
import { ScrollReveal } from "./ScrollReveal"

const stats = [
  { value: 70, suffix: "%", label: "Automation", sublabel: "Efficiency Gained" },
  { value: 2, suffix: "+", label: "Years", sublabel: "Building Software" },
  { value: 30, suffix: "+", label: "Technologies", sublabel: "In My Stack" },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const duration = 1200

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export const StatsSection = memo(() => {
  return (
    <section className="py-20 bg-[#0a0a0a] border-y border-white/5">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 0.08}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-gray-600 text-xs mt-0.5">{stat.sublabel}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
})

StatsSection.displayName = "StatsSection"

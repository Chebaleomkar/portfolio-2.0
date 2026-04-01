"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface ScrollRevealProps {
    children: React.ReactNode
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    className?: string
    once?: boolean
}

export function ScrollReveal({
    children,
    delay = 0,
    direction = "up",
    className = "",
    once = true,
}: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, margin: "-60px" })

    const offsets = {
        up: { y: 40 },
        down: { y: -40 },
        left: { x: 40 },
        right: { x: -40 },
        none: {},
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, ...offsets[direction] }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offsets[direction] }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

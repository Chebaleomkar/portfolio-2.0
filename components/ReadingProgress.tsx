"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function ReadingProgress() {
    const [progress, setProgress] = useState(0)
    const [milestone, setMilestone] = useState(0)
    const [completed, setCompleted] = useState(false)
    const lastMilestone = useRef(0)

    const updateProgress = useCallback(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        if (docHeight > 0) {
            const p = Math.min((scrollTop / docHeight) * 100, 100)
            setProgress(p)

            // Detect milestone crossings (25, 50, 75, 100)
            const currentMilestone = p >= 100 ? 100 : p >= 75 ? 75 : p >= 50 ? 50 : p >= 25 ? 25 : 0
            if (currentMilestone > lastMilestone.current) {
                lastMilestone.current = currentMilestone
                setMilestone(currentMilestone)
                // Reset milestone animation after it plays
                setTimeout(() => setMilestone(0), 800)
            }

            // Completion celebration
            if (p >= 99.5 && !completed) {
                setCompleted(true)
            }
        }
    }, [completed])

    useEffect(() => {
        window.addEventListener("scroll", updateProgress, { passive: true })
        updateProgress()
        return () => window.removeEventListener("scroll", updateProgress)
    }, [updateProgress])

    if (progress === 0) return null

    // Gradient shifts from emerald → teal → amber as you progress
    const barGradient = progress < 50
        ? `linear-gradient(90deg, #059669, #10b981, #34d399)`
        : progress < 85
            ? `linear-gradient(90deg, #059669, #10b981, #14b8a6, #2dd4bf)`
            : `linear-gradient(90deg, #059669, #10b981, #14b8a6, #f59e0b)`

    // Glow intensifies as you read more
    const glowIntensity = Math.min(progress / 100, 1)
    const glowColor = progress >= 85
        ? `rgba(245, 158, 11, ${0.4 * glowIntensity})`
        : `rgba(16, 185, 129, ${0.3 * glowIntensity})`

    return (
        <div className="fixed top-0 left-0 right-0 z-[110] h-[3px] bg-transparent pointer-events-none">
            {/* Main progress bar */}
            <div
                className={`h-full relative transition-[width] duration-150 ease-out ${
                    milestone > 0 ? "animate-[milestone-pulse_0.6s_ease-out]" : ""
                }`}
                style={{
                    width: `${progress}%`,
                    background: barGradient,
                    boxShadow: `0 0 ${8 + 12 * glowIntensity}px ${glowColor}, 0 0 ${2 + 4 * glowIntensity}px ${glowColor}`,
                }}
            >
                {/* Shimmer effect moving along the bar */}
                <div
                    className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite]"
                    style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                    }}
                />

                {/* Bright leading edge dot */}
                <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full"
                    style={{
                        background: progress >= 85 ? "#fbbf24" : "#6ee7b7",
                        boxShadow: `0 0 ${6 + 8 * glowIntensity}px ${glowColor}`,
                    }}
                />
            </div>

            {/* Completion celebration — golden glow wave */}
            {completed && (
                <div
                    className="absolute inset-0 animate-[celebration_1.5s_ease-out_forwards]"
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), rgba(245,158,11,0.6), rgba(251,191,36,0.4), transparent)",
                        backgroundSize: "200% 100%",
                    }}
                />
            )}

            <style jsx>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                @keyframes milestone-pulse {
                    0% { transform: scaleY(1); filter: brightness(1); }
                    40% { transform: scaleY(2.5); filter: brightness(1.6); }
                    100% { transform: scaleY(1); filter: brightness(1); }
                }
                @keyframes celebration {
                    0% { opacity: 0; background-position: 200% 0; }
                    30% { opacity: 1; }
                    100% { opacity: 0; background-position: -200% 0; }
                }
            `}</style>
        </div>
    )
}

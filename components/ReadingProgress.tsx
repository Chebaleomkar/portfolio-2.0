"use client"

import { useState, useEffect, useCallback } from "react"

export function ReadingProgress() {
    const [progress, setProgress] = useState(0)

    const updateProgress = useCallback(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        if (docHeight > 0) {
            setProgress(Math.min((scrollTop / docHeight) * 100, 100))
        }
    }, [])

    useEffect(() => {
        // Use passive listener for performance on mobile
        window.addEventListener("scroll", updateProgress, { passive: true })
        updateProgress() // initial call
        return () => window.removeEventListener("scroll", updateProgress)
    }, [updateProgress])

    if (progress === 0) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-[110] h-[3px] bg-transparent pointer-events-none">
            <div
                className="h-full bg-emerald-500 transition-[width] duration-100 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}

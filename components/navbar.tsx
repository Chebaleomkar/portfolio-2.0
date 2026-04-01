"use client"

import Link from "next/link"
import { Bio } from "@/utils/data"
import { useState, useEffect } from "react"

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-4"
                    : "bg-transparent py-6 md:py-8"
            }`}
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6">
                <Link
                    href="/"
                    className="text-white/90 hover:text-white transition-colors font-semibold text-lg tracking-tight"
                >
                    {Bio.name.trim().split(" ")[0]}
                    <span className="text-emerald-400">.</span>
                </Link>
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/blogs" className="text-sm text-gray-500 hover:text-white transition-colors">
                        Blog
                    </Link>
                    <Link href="/skills" className="text-sm text-gray-500 hover:text-white transition-colors hidden sm:block">
                        Skills
                    </Link>
                    <Link href="/about" className="text-sm text-gray-500 hover:text-white transition-colors">
                        About
                    </Link>
                </div>
            </div>
        </nav>
    )
}

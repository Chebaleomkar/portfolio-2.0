import Link from "next/link"
import { Bio } from "@/utils/data"

export const Navbar = () => {
    return (
        <nav className="relative z-20 pt-6 md:pt-8 px-4 md:px-6">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                <Link
                    href="/"
                    className="text-white/90 hover:text-white transition-colors font-semibold text-lg tracking-tight"
                >
                    {Bio.name.trim().split(' ')[0]}
                    <span className="text-emerald-400">.</span>
                </Link>
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/blog" className="text-sm text-gray-500 hover:text-white transition-colors">
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
'use client'

import { useState } from 'react'
import { HiLink, HiShare } from 'react-icons/hi'
import { FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

interface ShareButtonsProps {
    title: string
    slug: string
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false)
    const blogUrl = `https://omkarchebale.vercel.app/blog/${slug}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(blogUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = blogUrl
            document.body.appendChild(textArea)
            textArea.select()
            document.execCommand('copy')
            document.body.removeChild(textArea)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const shareLinks = [
        {
            name: 'Twitter',
            icon: FaTwitter,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(title)}`,
            color: 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50',
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`,
            color: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/50',
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            url: `https://wa.me/?text=${encodeURIComponent(`${title} - ${blogUrl}`)}`,
            color: 'hover:text-[#25D366] hover:border-[#25D366]/50',
        },
    ]

    return (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-gray-800">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 uppercase tracking-wide">
                <HiShare size={14} />
                Share
            </span>

            {/* Copy Link Button */}
            <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800/50 border rounded-lg transition-all duration-200
                    ${copied
                        ? 'border-green-500/50 text-green-400'
                        : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                    }`}
            >
                <HiLink size={12} />
                {copied ? 'Copied!' : 'Copy Link'}
            </button>

            {/* Social Share Links */}
            {shareLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 transition-all duration-200 ${link.color}`}
                    aria-label={`Share on ${link.name}`}
                >
                    <link.icon size={12} />
                    <span className="hidden sm:inline">{link.name}</span>
                </a>
            ))}
        </div>
    )
}

"use client"

import ResumeButton from "@/components/ResumeButton"
import { Bio } from "@/utils/data"
import Image from "next/image"
import Link from "next/link"
import { memo } from "react"
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaStackOverflow, FaTwitter } from "react-icons/fa"
import { TypeAnimation } from "react-type-animation"

interface SocialIconProps {
  href: string
  icon: React.ComponentType<{ size: number; className?: string }>
  label: string
}

export const Hero = memo(() => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */ }
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Content */ }
          <div className="lg:w-1/2 text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Hi, I&apos;m{ " " }
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  { Bio.name }
                </span>
              </h1>

              <div className="h-16 flex items-center justify-center lg:justify-start">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700 dark:text-gray-300">
                  <TypeAnimation
                    sequence={ Bio.roles.flatMap((role) => [role, 2000]) }
                    wrapper="span"
                    cursor={ true }
                    repeat={ Infinity }
                    style={ { display: 'inline-block' } }
                  />
                </h2>
              </div>
            </div>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              { Bio.description }
            </p>

            {/* Social Links */ }
            <div className="flex justify-center lg:justify-start gap-4">
              <SocialIcon href={ Bio.github } icon={ FaGithub } label="GitHub" />
              <SocialIcon href={ Bio.linkedin } icon={ FaLinkedin } label="LinkedIn" />
              <SocialIcon href={ Bio.twitter } icon={ FaTwitter } label="Twitter" />
              <SocialIcon href={ Bio.insta } icon={ FaInstagram } label="Instagram" />
              <SocialIcon href={ Bio.facebook } icon={ FaFacebook } label="Facebook" />
              <SocialIcon href={ Bio.stack_overflow } icon={ FaStackOverflow } label="Stack Overflow" />
            </div>

            {/* CTA Button */ }
            <div className="pt-4">
              <Link href="/omkar-chebale-resume" className="inline-block">
                <ResumeButton />
              </Link>
            </div>
          </div>

          {/* Profile Image */ }
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20" />
                <Image
                  src="/profile.jpg"
                  alt="Omkar Chebale - Full Stack Developer"
                  fill
                  className="object-cover rounded-full shadow-2xl border-4 border-white dark:border-gray-700 relative z-10"
                  priority
                  sizes="(max-width: 768px) 320px, 384px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

const SocialIcon = memo(({ href, icon: Icon, label }: SocialIconProps) => (
  <a
    href={ href }
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:scale-110 border border-gray-200 dark:border-gray-700"
    aria-label={ label }
  >
    <Icon size={ 24 } />
  </a>
))

Hero.displayName = "Hero"
SocialIcon.displayName = "SocialIcon"

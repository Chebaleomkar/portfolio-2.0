"use client"
import { Bio } from "@/utils/data"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const Footer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", subject: "", message: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!response.ok) throw new Error('Failed')
      toast.success("Message sent!", { style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } })
      setIsSubmitted(true)
      form.reset()
    } catch {
      toast.error("Failed to send. Try again.", { style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="relative bg-[#030303] overflow-hidden">
      <Toaster position="top-center" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 max-w-5xl py-20">
        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {/* Left - Contact Form */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">Get in touch</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Let's work together
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                {...form.register("email")}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
              <input
                type="text"
                id="contact-subject"
                placeholder="Subject"
                {...form.register("subject")}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
              <textarea
                placeholder="Your message..."
                rows={4}
                {...form.register("message")}
                className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none text-sm"
              />
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                ) : isSubmitted ? (
                  <><Check className="h-4 w-4" /> Sent</>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Right - Navigation & Info */}
          <div className="flex flex-col justify-between">
            <div>
              <Link href="/" className="text-2xl font-bold text-white mb-8 block">
                {Bio.name.trim().split(' ')[0]}
              </Link>

              <nav className="space-y-3 mb-8">
                <Link href="/blog" className="block text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
                <Link href="/skills" className="block text-gray-400 hover:text-white transition-colors">
                  Skills
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </nav>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href={Bio.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <FaGithub size={20} />
              </a>
              <a href={Bio.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href={Bio.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} {Bio.name.trim()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
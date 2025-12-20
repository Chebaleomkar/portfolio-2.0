'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Loader2 } from 'lucide-react'
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast, { Toaster } from 'react-hot-toast'
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export function ContactMe() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      toast.success("Message sent successfully!", {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
        },
      })
      setIsSubmitted(true)
      form.reset()
    } catch {
      toast.error("Something went wrong. Please try again.", {
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-[#030303]">
      <Toaster position="top-center" />

      <div className="container mx-auto px-6 max-w-2xl">
        {/* Header */}
        <header className="mb-12">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">Get in touch</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contact
          </h2>
          <p className="text-gray-400">
            Have a project in mind? Let's talk.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...form.register("email")}
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm text-gray-400 mb-2">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              placeholder="What's this about?"
              {...form.register("subject")}
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors"
            />
            {form.formState.errors.subject && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.subject.message}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm text-gray-400 mb-2">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Tell me about your project..."
              rows={5}
              {...form.register("message")}
              className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
            {form.formState.errors.message && (
              <p className="mt-1 text-sm text-red-400">{form.formState.errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isSubmitted}
            className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : isSubmitted ? (
              <>
                <Check className="h-4 w-4" />
                Sent
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>

        {/* Alternative contact */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Or email me directly at{' '}
          <a
            href="mailto:chebaleomkar@gmail.com"
            className="text-gray-400 hover:text-white transition-colors"
          >
            chebaleomkar@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}
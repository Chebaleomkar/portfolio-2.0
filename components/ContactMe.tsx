'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useState } from "react"
import { Check, Loader2, Mail, PenTool, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast, { Toaster } from 'react-hot-toast'

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    subject: z.string().min(2, "Subject must be at least 2 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export function ContactMe() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

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
            // Send POST request to /api/send-email
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

            // Show success toast
            toast.success("🎉 Your message has been successfully sent to Mr. Omkar Chebale!", {
                style: {
                    background: '#10B981',
                    color: '#FFFFFF',
                    border: '1px solid #059669',
                    width : '70%'
                },
            })
            setIsSubmitted(true)
        } catch (error) {
            // Show error toast
            toast.error("❌ Something went wrong. Please try again.", {
                style: {
                    background: '#EF4444',
                    color: '#FFFFFF',
                    border: '1px solid #DC2626',
                },
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
        },
    }

    const iconVariants = {
        hover: { scale: 1.1, rotate: [0, -10, 10, 0], transition: { duration: 0.5 } },
    }

    return (
        <section id="contactMe" className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <Toaster position="top-center" />
            <motion.div
                ref={ref}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={containerVariants}
                className="max-w-md w-full"
            >
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl font-bold  mb-2">Get in Touch</h2>
                    <p className="text-gray-400">I&apos;d love to hear from you. Send me a message!</p>
                </motion.div>

                <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200 flex items-center gap-2">
                                                <motion.span
                                                    variants={iconVariants}
                                                    whileHover="hover"
                                                >
                                                    <Mail className="w-5 h-5" />
                                                </motion.span>
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="your@email.com"
                                                    {...field}
                                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200 flex items-center gap-2">
                                                <motion.span
                                                    variants={iconVariants}
                                                    whileHover="hover"
                                                >
                                                    <PenTool className="w-5 h-5" />
                                                </motion.span>
                                                Subject
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="What's this about?"
                                                    {...field}
                                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200 flex items-center gap-2">
                                                <motion.span
                                                    variants={iconVariants}
                                                    whileHover="hover"
                                                >
                                                    <MessageCircle className="w-5 h-5" />
                                                </motion.span>
                                                Message
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Your message here..."
                                                    {...field}
                                                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-[150px]"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="pt-2"
                            >
                                <Button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
                                    disabled={isSubmitting || isSubmitted}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : isSubmitted ? (
                                        <>
                                            <Check className="mr-2 h-4 w-4" />
                                            Sent Successfully
                                        </>
                                    ) : (
                                        "Send Message"
                                    )}
                                </Button>
                            </motion.div>
                        </form>
                    </Form>
                </div>
            </motion.div>
        </section>
    )
}
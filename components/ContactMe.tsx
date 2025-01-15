'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

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
import { toast } from "@/hooks/use-toast"
import { useState } from "react"
import { Check, Loader2 } from 'lucide-react'

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
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))
            console.log(values)
            setIsSubmitted(true)
            toast({
                title: "Message sent successfully!",
                description: "Thank you for reaching out. I'll get back to you soon.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
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

    return (
        <section id="contactMe" className=" bg-gray-900 min-h-screen flex items-center justify-center ">
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
                    <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                    <p className="text-gray-400">I&apos;d love to hear from you. Send me a message!</p>
                </motion.div>

                <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-200">Email</FormLabel>
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
                                            <FormLabel className="text-gray-200">Subject</FormLabel>
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
                                            <FormLabel className="text-gray-200">Message</FormLabel>
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


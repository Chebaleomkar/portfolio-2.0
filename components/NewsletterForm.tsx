'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { HiMail, HiCheck, HiX, HiPlus } from 'react-icons/hi'

// Static topics - curated list of interests
const PREDEFINED_TOPICS = [
    'AI & Machine Learning',
    'Web Development',
    'Backend Engineering',
    'DevOps & Cloud',
    'System Design',
    'LLMs & RAG',
    'Automation',
    'Career & Growth',
    'Tutorials',
    'Project Updates',
]

interface NewsletterFormProps {
    variant?: 'default' | 'minimal'
}

export function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [selectedTopics, setSelectedTopics] = useState<string[]>([])
    const [topicSearch, setTopicSearch] = useState('')
    const [showTopicDropdown, setShowTopicDropdown] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [showAdvanced, setShowAdvanced] = useState(false)

    const topicInputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Filter topics based on search
    const filteredTopics = PREDEFINED_TOPICS.filter(
        topic =>
            topic.toLowerCase().includes(topicSearch.toLowerCase()) &&
            !selectedTopics.includes(topic)
    )

    // Check if search term is a new custom topic
    const canAddCustomTopic =
        topicSearch.trim().length > 1 &&
        !PREDEFINED_TOPICS.some(t => t.toLowerCase() === topicSearch.toLowerCase()) &&
        !selectedTopics.some(t => t.toLowerCase() === topicSearch.toLowerCase())

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowTopicDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Add topic
    const addTopic = useCallback((topic: string) => {
        if (!selectedTopics.includes(topic) && selectedTopics.length < 5) {
            setSelectedTopics(prev => [...prev, topic])
            setTopicSearch('')
        }
    }, [selectedTopics])

    // Remove topic
    const removeTopic = useCallback((topic: string) => {
        setSelectedTopics(prev => prev.filter(t => t !== topic))
    }, [])

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            setMessage('Please enter your email')
            setSubmitStatus('error')
            return
        }

        setIsSubmitting(true)
        setMessage('')

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    name: name.trim() || undefined,
                    topics: selectedTopics,
                }),
            })

            const data = await response.json()

            if (data.success) {
                setSubmitStatus('success')
                setMessage(data.message)
                setEmail('')
                setName('')
                setSelectedTopics([])
                setShowAdvanced(false)
            } else {
                setSubmitStatus('error')
                setMessage(data.error)
            }
        } catch {
            setSubmitStatus('error')
            setMessage('Something went wrong. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Reset status after 5 seconds
    useEffect(() => {
        if (submitStatus !== 'idle') {
            const timer = setTimeout(() => {
                setSubmitStatus('idle')
                setMessage('')
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [submitStatus])

    if (variant === 'minimal') {
        return (
            <div className="w-full max-w-md">
                {submitStatus === 'success' ? (
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                        <HiCheck size={18} />
                        <span>{message}</span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50"
                        >
                            {isSubmitting ? '...' : 'Subscribe'}
                        </button>
                    </form>
                )}
                {submitStatus === 'error' && (
                    <p className="mt-2 text-sm text-red-400">{message}</p>
                )}
            </div>
        )
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl mb-4">
                    <HiMail className="text-emerald-400" size={24} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    Stay in the loop
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                    No spam, promise. I only send curated blogs that match your interests —
                    the stuff you'd actually want to read.
                </p>
            </div>

            {submitStatus === 'success' ? (
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-4">
                        <HiCheck className="text-emerald-400" size={32} />
                    </div>
                    <p className="text-white font-medium mb-1">You're all set!</p>
                    <p className="text-gray-400 text-sm">{message}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email - Required */}
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com *"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700 transition-all text-sm"
                            required
                        />
                    </div>

                    {/* Optional fields toggle */}
                    {!showAdvanced && (
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(true)}
                            className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                        >
                            + Add name & interests (optional)
                        </button>
                    )}

                    {/* Advanced options */}
                    {showAdvanced && (
                        <div className="space-y-4 animate-in slide-in-from-top-2">
                            {/* Name - Optional */}
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your name (optional)"
                                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-all text-sm"
                            />

                            {/* Topics - Optional */}
                            <div ref={dropdownRef} className="relative">
                                <div className="relative">
                                    <input
                                        ref={topicInputRef}
                                        type="text"
                                        value={topicSearch}
                                        onChange={(e) => setTopicSearch(e.target.value)}
                                        onFocus={() => setShowTopicDropdown(true)}
                                        placeholder="Search or add interests..."
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-all text-sm"
                                    />
                                    {selectedTopics.length > 0 && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                            {selectedTopics.length}/5
                                        </span>
                                    )}
                                </div>

                                {/* Selected topics */}
                                {selectedTopics.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {selectedTopics.map(topic => (
                                            <span
                                                key={topic}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs"
                                            >
                                                {topic}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTopic(topic)}
                                                    className="hover:text-white transition-colors"
                                                >
                                                    <HiX size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Dropdown */}
                                {showTopicDropdown && (filteredTopics.length > 0 || canAddCustomTopic) && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#111] border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto">
                                        {filteredTopics.map(topic => (
                                            <button
                                                key={topic}
                                                type="button"
                                                onClick={() => addTopic(topic)}
                                                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                        {canAddCustomTopic && (
                                            <button
                                                type="button"
                                                onClick={() => addTopic(topicSearch.trim())}
                                                className="w-full px-4 py-2.5 text-left text-sm text-emerald-400 hover:bg-emerald-500/10 transition-colors flex items-center gap-2 border-t border-gray-800"
                                            >
                                                <HiPlus size={14} />
                                                Add "{topicSearch.trim()}"
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {submitStatus === 'error' && (
                        <p className="text-sm text-red-400 text-center">{message}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            'Subscribe — it takes 5 seconds'
                        )}
                    </button>

                    {/* Privacy note */}
                    <p className="text-[11px] text-gray-600 text-center">
                        Unsubscribe anytime. Your email is safe with me.
                    </p>
                </form>
            )}
        </div>
    )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { HiMail, HiCheck, HiCheckCircle } from 'react-icons/hi'

// Predefined topics - curated list
const PREDEFINED_TOPICS = [
    'JavaScript',
    'TypeScript',
    'React',
    'NextJS',
    'NodeJS',
    'Python',
    'AI',
    'MachineLearning',
    'DeepLearning',
    'NLP',
    'LLM',
    'GenerativeAI',
    'AgenticAI',
    'Agents',
    'Automation',
    'API',
    'Backend',
    'Frontend',
    'Fullstack',
    'Engineering',
    'SoftwareArchitecture',
    'SystemDesign',
    'CloudComputing',
    'Tech',
    'DataScience',
    'Database'
]

export function NewsletterForm() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [selectedTopics, setSelectedTopics] = useState<string[]>([])
    const [topicSearch, setTopicSearch] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    // Filter topics based on search
    const filteredTopics = topicSearch.trim()
        ? PREDEFINED_TOPICS.filter(topic =>
            topic.toLowerCase().includes(topicSearch.toLowerCase())
        )
        : PREDEFINED_TOPICS

    // Check if search term is a new custom topic
    const canAddCustomTopic =
        topicSearch.trim().length > 1 &&
        !PREDEFINED_TOPICS.some(t => t.toLowerCase() === topicSearch.toLowerCase()) &&
        !selectedTopics.some(t => t.toLowerCase() === topicSearch.toLowerCase())

    // Toggle topic selection
    const toggleTopic = useCallback((topic: string) => {
        setSelectedTopics(prev =>
            prev.includes(topic)
                ? prev.filter(t => t !== topic)
                : [...prev, topic]
        )
    }, [])

    // Add custom topic on Enter
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const newTopic = topicSearch.trim()
            if (newTopic && !selectedTopics.includes(newTopic)) {
                setSelectedTopics(prev => [...prev, newTopic])
                setTopicSearch('')
            }
        }
    }

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
                setTopicSearch('')
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

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Header */}

            {submitStatus === 'success' ? (
                <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-full mb-4">
                        <HiCheck className="text-emerald-400" size={32} />
                    </div>
                    <p className="text-white font-medium mb-1">You're all set!</p>
                    <p className="text-gray-400 text-sm">{message}</p>
                </div>
            ) : (
                <><div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl mb-4">
                        <HiMail className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        Subscribe to my newsletter
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto">
                        No spam, promise. I only send curated blogs that match your interests —
                        the stuff you'd actually want to read.
                    </p>
                </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email & Name Row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 focus:ring-1 focus:ring-gray-700 transition-all text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name (optional)"
                                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Topics Section */}
                        <div>
                            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                                Interests (optional)
                            </p>

                            {/* Search/Add Input */}
                            <input
                                type="text"
                                value={topicSearch}
                                onChange={(e) => setTopicSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search or add keyword..."
                                className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-700 transition-all text-sm mb-3"
                            />

                            {/* Selected Topics (custom ones that aren't in predefined) */}
                            {selectedTopics.filter(t => !PREDEFINED_TOPICS.includes(t)).length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {selectedTopics.filter(t => !PREDEFINED_TOPICS.includes(t)).map(topic => (
                                        <button
                                            key={topic}
                                            type="button"
                                            onClick={() => toggleTopic(topic)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-lg text-emerald-400 text-xs font-medium transition-all"
                                        >
                                            <HiCheckCircle size={14} />
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Predefined Topics Grid */}
                            <div className="flex flex-wrap gap-2">
                                {filteredTopics.map(topic => {
                                    const isSelected = selectedTopics.includes(topic)
                                    return (
                                        <button
                                            key={topic}
                                            type="button"
                                            onClick={() => toggleTopic(topic)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                                            ${isSelected
                                                    ? 'bg-emerald-500/10 border-2 border-emerald-500/50 text-emerald-400'
                                                    : 'bg-gray-900/50 border border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-300'
                                                }`}
                                        >
                                            {isSelected && <HiCheckCircle size={14} />}
                                            {topic}
                                        </button>
                                    )
                                })}

                                {/* Show "Add" option if custom topic */}
                                {canAddCustomTopic && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedTopics(prev => [...prev, topicSearch.trim()])
                                            setTopicSearch('')
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/30 border-dashed rounded-lg text-emerald-400/80 text-xs font-medium hover:bg-emerald-500/10 transition-all"
                                    >
                                        + Add "{topicSearch.trim()}"
                                    </button>
                                )}
                            </div>
                        </div>

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
                </>
            )}
        </div>
    )
}

'use client'

import { Bio, projects } from '@/utils/data'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { TypeAnimation } from 'react-type-animation'
import { MoveRightIcon } from 'lucide-react'

export const Projects = () => {
    const controls = useAnimation()
    const [ref, inView] = useInView()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (inView) {
            controls.start('visible')
        }
        // Simulate loading delay
        setTimeout(() => setIsLoading(false), 1500)
    }, [controls, inView])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    return (
        <section id='projects' className=" px-8 py-8 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            {isLoading ? (
                <LoadingAnimation />
            ) : (
                <>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold mb-10 text-center text-gray-800 dark:text-white"
                    >
                        Projects
                    </motion.h2>
                    <motion.div
                        ref={ref}
                        variants={containerVariants}
                        initial="hidden"
                        animate={controls}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {projects.map((project, i) => (
                            <ProjectCard key={i} project={project} index={i} />
                        ))}
                    </motion.div>
                    <Link href={Bio.github}>
                        <div className="h-20 mt-5 flex items-center justify-center gap-8 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-700 dark:to-gray-900 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="flex items-center">
                                <span className="text-lg font-medium">
                                    See More Projects on <span className="font-semibold underline">GitHub</span>
                                </span>
                            </div>
                            <MoveRightIcon size={35} className="text-white animate-pulse" />
                        </div>
                    </Link>

                </>
            )}
        </section>
    )
}

const ProjectCard = ({ project, index }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1
            }
        }
    }

    return (
        <div>
            <motion.div
                ref={ref}
                variants={cardVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-110"
                    />
                </div>
                <div className="p-6">
                    <h3 style={{ color: `${project.TitleColor}` }} className={`text-xl font-semibold mb-2  h-14`}>{project.title}
                    </h3>
                    <p className="text-sm mb-4 text-clip line-clamp-3  text-gray-600 dark:text-gray-300">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-4">
                        {project.github && (
                            <Link
                                href={project.github}
                                target="_blank"
                                className="text-primary hover:underline"
                            >
                                <Button variant="outline" className="transition-all duration-300 hover:bg-primary hover:text-white">
                                    GitHub
                                </Button>
                            </Link>
                        )}
                        {project.webapp && (
                            <Link
                                href={project.webapp}
                                target="_blank"
                                className="text-primary hover:underline"
                            >
                                <Button className="transition-all duration-300 hover:bg-primary-dark">
                                    Live Demo
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </motion.div>

        </div>

    )
}

const LoadingAnimation = () => {
    return (
        <div className="flex justify-center items-center h-64">
            <motion.div
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    )
}

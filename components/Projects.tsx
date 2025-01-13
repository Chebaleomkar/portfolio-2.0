import { projects } from '@/utils/constants'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'

export const Projects = () => {
    return (
        <section className="container mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold mb-10 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project , i) => (
                    <div key={i} className="bg-card rounded-lg shadow-lg overflow-hidden">
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className={`text-xl font-semibold mb-2 ${project.TitleColor}`}>
                                {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">{project.date}</p>
                            <p className="text-sm mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm"
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
                                        GitHub
                                    </Link>
                                )}
                                {project.webapp && (
                                    <Link
                                        href={project.webapp}
                                        target="_blank"
                                        className="text-primary hover:underline"
                                    >
                                        Live Demo
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

    )
}

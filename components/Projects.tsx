"use client"

import GithubAnimatedButton from "@/components/GithubAnimationButton"
import LiveDemoButton from "@/components/LiveDemoButton"
import { Bio, projects } from "@/utils/data"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { memo } from "react"

interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  github?: string
  webapp?: string
  TitleColor?: string
}

export const Projects = memo(() => {
  return (
    <section
      id="projects"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      aria-labelledby="projects-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="text-center mb-16">
          <h2
            id="projects-heading"
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Featured Projects
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A showcase of my recent work and personal projects
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          { projects.map((project, index) => (
            <ProjectCard key={ `${project.title}-${index}` } project={ project } />
          )) }
        </div>

        {/* View More Projects CTA */ }
        <div className="text-center">
          <Link
            href={ Bio.github }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>View More Projects on GitHub</span>
            <ArrowRight size={ 20 } />
          </Link>
        </div>
      </div>
    </section>
  )
})

const ProjectCard = memo(({ project }: { project: Project }) => {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group">
      {/* Project Image */ }
      <div className="relative h-48 overflow-hidden">
        <Image
          src={ project.image || "/placeholder.svg" }
          alt={ `${project.title} project screenshot` }
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Project Content */ }
      <div className="p-6">
        <h3
          className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2"
          style={ { color: project.TitleColor } }
        >
          { project.title }
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">{ project.description }</p>

        {/* Tags */ }
        <div className="flex flex-wrap gap-2 mb-6">
          { project.tags.map((tag) => (
            <span
              key={ tag }
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
            >
              { tag }
            </span>
          )) }
        </div>

        {/* Action Buttons */ }
        <div className="flex gap-3">
          { project.github && (
            <Link href={ project.github } target="_blank" rel="noopener noreferrer" className="flex-1">
              <GithubAnimatedButton />
            </Link>
          ) }
          { project.webapp && (
            <Link href={ project.webapp } target="_blank" rel="noopener noreferrer" className="flex-1">
              <LiveDemoButton />
            </Link>
          ) }
        </div>
      </div>
    </article>
  )
})

Projects.displayName = "Projects"
ProjectCard.displayName = "ProjectCard"

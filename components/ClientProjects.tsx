'use client'

import { ClientProject } from "@/types/ClientProject"
import { ClientProjects } from "@/utils/data"
import { memo, useRef } from 'react'


export const ClientProjectsSection = memo(() => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  const scrollToProject = (index: number) => {
    const container = scrollContainerRef.current
    if (container) {
      const child = container.children[index] as HTMLElement
      container.scrollTo({
        left: child.offsetLeft,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      id="freelance"
      aria-labelledby="client-projects-heading"
      className="py-16 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="client-projects-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          >
            Businesses I&apos;ve Helped
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover how I&apos;ve helped businesses transform their digital presence and achieve their goals
          </p>
        </div>

        {/* Horizontal scrollable container */ }
        <div className="relative">
          <div
            ref={ scrollContainerRef }
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
            style={ {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            } }
            role="region"
            aria-label="Client projects carousel"
          >
            { ClientProjects.map((project, i) => (
              <ProjectCard key={ i } project={ project } index={ i } />
            )) }
          </div>

          {/* Scroll indicators */ }
          <div className="flex justify-center mt-6 gap-2">
            { ClientProjects.map((_, index) => (
              <button
                key={ index }
                onClick={ () => scrollToProject(index) }
                className="w-3 h-3 rounded-full  bg-blue-500 focus:outline-none transition-colors"
                title={ `Go to project ${index + 1}` }
                aria-label={ `Go to project ${index + 1}` }
              />
            )) }
          </div>
        </div>
      </div>
    </section>
  )
})

const ProjectCard = memo(({ project, index }: { project: ClientProject; index: number }) => {
  return (
    <article
      className="flex-none w-80 sm:w-96 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 snap-start group"
      aria-labelledby={ `project-title-${index}` }
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            id={ `project-title-${index}` }
            className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
          >
            { project.business }
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">
            { project.project }
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
          { project.business.charAt(0) }
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        { project.description }
      </p>

      <div className="space-y-3">
        { project.impact && (
          <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <span className="text-green-600 dark:text-green-400 text-lg" aria-hidden="true">💡</span>
            <div>
              <span className="font-semibold text-green-800 dark:text-green-300">Impact:</span>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">{ project.impact }</p>
            </div>
          </div>
        ) }

        { project.year && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-blue-500" aria-hidden="true">📅</span>
            <span className="font-medium">Completed:</span>
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md font-mono">
              { project.year }
            </span>
          </div>
        ) }
      </div>
    </article>
  )
})

ClientProjectsSection.displayName = 'ClientProjectsSection'
ProjectCard.displayName = 'ProjectCard'

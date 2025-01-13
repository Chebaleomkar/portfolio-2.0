"use client"
import { Bio, skills, projects, blogs, TimeLineData } from '@/utils/constants'
import { Github, Linkedin, Twitter, Instagram, Facebook, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from 'next-themes'

export default function Home() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{Bio.name}</h1>
            <div className="mb-4">
              {Bio.roles.map((role, index) => (
                <span key={index} className="text-xl text-muted-foreground mr-2">
                  {role}
                  {index !== Bio.roles.length - 1 && ' |'}
                </span>
              ))}
            </div>
            <p className="text-lg text-muted-foreground mb-6">{Bio.description}</p>
            <div className="flex gap-4">
              <Link href={Bio.github} target="_blank" className="hover:text-primary">
                <Github size={24} />
              </Link>
              <Link href={Bio.linkedin} target="_blank" className="hover:text-primary">
                <Linkedin size={24} />
              </Link>
              <Link href={Bio.twitter} target="_blank" className="hover:text-primary">
                <Twitter size={24} />
              </Link>
              <Link href={Bio.insta} target="_blank" className="hover:text-primary">
                <Instagram size={24} />
              </Link>
              <Link href={Bio.facebook} target="_blank" className="hover:text-primary">
                <Facebook size={24} />
              </Link>
              <Link href={Bio.resume} target="_blank" className="hover:text-primary">
                <FileText size={24} />
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/profile.jpg"
              alt="Hero"
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/50">
        <h2 className="text-3xl font-bold mb-10 text-center">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category, index) => (
            <div key={index} className="bg-card p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
              <div className="grid grid-cols-3 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex flex-col items-center">
                    <Image
                      src={skill.image}
                      alt={skill.name}
                      width={40}
                      height={40}
                      className="mb-2"
                    />
                    <span className="text-sm text-center">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-card rounded-lg shadow-lg overflow-hidden">
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

      {/* Blogs Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/50">
        <h2 className="text-3xl font-bold mb-10 text-center">Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Link
              key={index}
              href={blog.link}
              target="_blank"
              className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
              <p className="text-primary">{blog.topic}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Timeline</h2>
        <div className="max-w-3xl mx-auto">
          {TimeLineData.map((item, index) => (
            <div key={index} className="flex mb-8">
              <div className="w-24 flex-shrink-0 text-primary font-bold">
                {item.year}
              </div>
              <div className="flex-1 ml-4 p-4 bg-card rounded-lg shadow">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} {Bio.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
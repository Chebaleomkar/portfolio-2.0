import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Skills } from "@/components/Skills"
import { FeaturedWork } from "@/components/FeaturedWork"
import { StatsSection } from "@/components/StatsSection"
import { Testimonials } from "@/components/Testimonials"

const BASE_URL = 'https://omkarchebale.vercel.app'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Omkar Chebale — AI Engineer & Full-Stack Developer',
    url: BASE_URL,
    description: 'Portfolio and technical blog of Omkar Chebale, an AI Engineer building production-grade LLM systems, RAG pipelines, and scalable web applications.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blogs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Omkar Chebale',
    url: BASE_URL,
    jobTitle: 'AI Engineer & Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'AI Planet',
    },
    knowsAbout: [
      'Artificial Intelligence', 'Machine Learning', 'Large Language Models',
      'RAG Systems', 'Full-Stack Development', 'Next.js', 'React', 'Node.js',
      'Python', 'MongoDB', 'TypeScript', 'LangChain',
    ],
    sameAs: [
      'https://github.com/Chebaleomkar',
      'https://www.linkedin.com/in/omkar-chebale-8b251726b/',
      'https://twitter.com/chebalerushi',
      'https://stackoverflow.com/users/21063836/omkar-chebale',
    ],
    image: `${BASE_URL}/profile.jpg`,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Omkar Chebale',
    },
    dateCreated: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
  },
]

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Services />
      <Skills />
      <FeaturedWork />
      <StatsSection />
      <Testimonials />
    </>
  )
}

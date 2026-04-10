import { ThemeProvider } from '@/components/theme-provider'
import { Bio } from '@/utils/data'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${Bio.name} — AI/ML Engineer | LLM Systems & Full-Stack Development`,
  description: 'Omkar Chebale is an AI/ML Engineer building production-grade LLM systems, RAG pipelines, and scalable web applications. Specializing in LangChain, Python, Next.js, and intelligent automation.',
  keywords: [
    'Omkar Chebale', 'AI ML Engineer', 'LLM developer', 'RAG systems',
    'LangChain developer', 'machine learning engineer', 'Full-Stack Developer',
    'Next.js developer', 'Python AI developer', 'AI automation',
    'agentic workflows', 'MongoDB developer', 'TypeScript developer',
    'AI portfolio', 'LLM systems engineer',
  ],
  authors: [{ name: Bio.name, url: 'https://omkarchebale.vercel.app/' }],
  creator: Bio.name,
  publisher: Bio.name,
  metadataBase: new URL('https://omkarchebale.vercel.app/'),
  openGraph: {
    title: `${Bio.name} — AI/ML Engineer | LLM Systems & Full-Stack Development`,
    description: 'AI/ML Engineer building production-grade LLM systems, RAG pipelines, and scalable web applications with LangChain, Python, and Next.js.',
    url: 'https://omkarchebale.vercel.app/',
    siteName: `${Bio.name} — AI/ML Engineer Portfolio`,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://omkarchebale.vercel.app/profile.jpg',
        width: 1200,
        height: 630,
        alt: `${Bio.name} — AI/ML Engineer building LLM systems and scalable web apps`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${Bio.name} — AI/ML Engineer | LLM Systems & Full-Stack Development`,
    description: 'AI/ML Engineer building production-grade LLM systems, RAG pipelines, and scalable web applications.',
    images: ['https://omkarchebale.vercel.app/profile.jpg'],
    creator: '@chebalerushi',
  },
  alternates: {
    canonical: 'https://omkarchebale.vercel.app/',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="Omkar Chebale - Blog" href="/feed.xml" />
        <link rel="author" href="/llms.txt" />
        <meta name="llms.txt" content="https://omkarchebale.vercel.app/llms.txt" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
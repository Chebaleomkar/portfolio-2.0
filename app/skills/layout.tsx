import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Skills — AI/ML, Full-Stack, DevOps | Omkar Chebale',
    description: 'Complete technology stack: AI/ML (LLMs, RAG, LangChain), Frontend (React, Next.js, TypeScript), Backend (Node.js, Python, FastAPI, MongoDB), and DevOps (Vercel, Docker).',
    keywords: [
        'Omkar Chebale skills', 'AI ML skills', 'LLM developer', 'RAG developer',
        'React developer', 'Next.js developer', 'Python ML', 'full-stack skills',
        'LangChain', 'MongoDB', 'TypeScript', 'Node.js',
    ],
    openGraph: {
        title: 'Skills — AI/ML, Full-Stack, DevOps | Omkar Chebale',
        description: 'AI/ML, Full-Stack, and DevOps technology stack of Omkar Chebale.',
        type: 'website',
        url: 'https://omkarchebale.vercel.app/skills',
    },
    twitter: {
        card: 'summary',
        title: 'Skills | Omkar Chebale',
        description: 'AI/ML, Full-Stack, and DevOps skills.',
        creator: '@chebalerushi',
    },
    alternates: {
        canonical: 'https://omkarchebale.vercel.app/skills',
    },
}

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
    return children
}

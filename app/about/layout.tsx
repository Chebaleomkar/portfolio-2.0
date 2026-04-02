import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Omkar Chebale — AI Engineer & Full-Stack Developer',
    description: 'AI Engineer at AI Planet building production-grade LLM systems, RAG pipelines, and scalable web applications. Previously at Xclusive Interiors and RecursiveZero.',
    keywords: [
        'Omkar Chebale', 'AI Engineer', 'Full-Stack Developer', 'about',
        'LLM systems', 'RAG pipelines', 'AI Planet', 'software engineer India',
    ],
    openGraph: {
        title: 'About Omkar Chebale — AI Engineer & Full-Stack Developer',
        description: 'AI Engineer building LLM systems, RAG pipelines, and scalable web applications.',
        type: 'profile',
        url: 'https://omkarchebale.vercel.app/about',
        images: [{ url: 'https://omkarchebale.vercel.app/profile.jpg', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Omkar Chebale — AI Engineer',
        description: 'AI Engineer building LLM systems, RAG pipelines, and scalable web apps.',
        creator: '@chebalerushi',
        images: ['https://omkarchebale.vercel.app/profile.jpg'],
    },
    alternates: {
        canonical: 'https://omkarchebale.vercel.app/about',
    },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return children
}

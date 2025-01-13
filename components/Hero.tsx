import { Bio } from '@/utils/constants'
import { Github, Linkedin, Twitter, Instagram, Facebook, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const Hero = () => {
    return (
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
    )
}
import { Bio } from '@/utils/data';
import { Github, Linkedin, Twitter, Instagram, Facebook, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = () => {
    return (
        <section className="relative min-h-screen bg-gradient-to-br dark:from-blue-900 via-black to-gray-900 text-white from-gray-100 dark:via-white dark:to-blue-200">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tl from-transparent to-black opacity-60 dark:to-white dark:opacity-20"></div>
                <div className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-30 blur-3xl top-1/4 left-1/3 animate-pulse"></div>
                <div className="absolute w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl bottom-1/4 right-1/4 animate-ping"></div>
            </div>

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    {/* Text Section */}
                    <div className="flex-1">
                        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-text dark:from-blue-500 dark:via-green-500 dark:to-teal-500">
                            {Bio.name}
                        </h1>
                        <div className="mb-4 space-y-2">
                            {Bio.roles.map((role, index) => (
                                <span
                                    key={index}
                                    className="text-2xl font-semibold text-muted-foreground mr-2 hover:text-primary transition duration-300"
                                >
                                    {role}
                                    {index !== Bio.roles.length - 1 && (
                                        <span className="text-purple-400 dark:text-blue-400"> | </span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <p className="text-lg leading-relaxed mb-8 text-gray-300 dark:text-gray-700 tracking-wide">
                            {Bio.description}
                        </p>
                        <div className="flex gap-6">
                            {[
                                { link: Bio.github, Icon: Github },
                                { link: Bio.linkedin, Icon: Linkedin },
                                { link: Bio.twitter, Icon: Twitter },
                                { link: Bio.insta, Icon: Instagram },
                                { link: Bio.facebook, Icon: Facebook },
                                { link: Bio.resume, Icon: FileText },
                            ].map(({ link, Icon }, index) => (
                                <Link key={index} href={link} target="_blank">
                                    <Icon
                                        size={32}
                                        className="hover:text-purple-400 dark:hover:text-blue-400 transition transform hover:-translate-y-1"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="flex-1 flex justify-center items-center relative">
                        <div className="relative w-80 h-80">
                            <Image
                                src="/profile.jpg"
                                alt="Hero"
                                layout="fill"
                                className="rounded-full border-4 border-gray-800 shadow-2xl hover:scale-105 transform transition duration-300 dark:border-gray-300"
                            />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full border-4 border-purple-500 blur-xl animate-spin-slow dark:border-blue-500"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full border-4 border-pink-500 blur-lg animate-pulse dark:border-green-500"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

"use client"
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaStackOverflow } from 'react-icons/fa'
import { Bio } from '@/utils/data'


export const Hero = () => {
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0"
                >
                    <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4">
                        Hi, I'm {' '}
                        <TypeAnimation
                            sequence={[Bio.name, 1000]}
                            wrapper="span"
                            cursor={true}
                            repeat={Infinity}
                            className="text-blue-600 dark:text-blue-400"
                        />
                    </h1>
                    <h2 className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-4">
                        <TypeAnimation
                            sequence={Bio.roles.flatMap(role => [role, 1000])}
                            wrapper="span"
                            cursor={true}
                            repeat={Infinity}
                        />
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{Bio.description}</p>
                    <div className="flex justify-center lg:justify-start space-x-4 mb-6">
                        <SocialIcon href={Bio.github} icon={FaGithub} label="GitHub" />
                        <SocialIcon href={Bio.linkedin} icon={FaLinkedin} label="LinkedIn" />
                        <SocialIcon href={Bio.twitter} icon={FaTwitter} label="Twitter" />
                        <SocialIcon href={Bio.insta} icon={FaInstagram} label="Instagram" />
                        <SocialIcon href={Bio.facebook} icon={FaFacebook} label="Facebook" />
                        <SocialIcon href={Bio.stack_overflow} icon={FaStackOverflow} label="Stack Overflow" />
                    </div>
                    <Link href="/resume" >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                        >
                            View Resume
                        </motion.button>
                    </Link>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="lg:w-1/2 flex justify-center lg:justify-end"
                >
                    <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                        <Image
                            src="/profile.jpg"
                            alt="Omkar Chebale"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full shadow-2xl"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

const SocialIcon = ({ href, icon: Icon, label }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
        aria-label={label}
    >
        <Icon size={24} />
    </motion.a>
)

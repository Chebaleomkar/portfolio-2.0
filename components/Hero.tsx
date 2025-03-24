"use client";
import ResumeButton from '@/components/ResumeButton';
import { Bio } from '@/utils/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaStackOverflow, FaTwitter } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';

// Define the type for the SocialIcon props
interface SocialIconProps {
  href: string;
  icon: React.ComponentType<{ size: number }>;
  label: string;
}

export const Hero = () => {
  const [showBullet, setShowBullet] = useState(false);

  // Effect to toggle the bullet animation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShowBullet((prev) => !prev);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Side: Text Content */ }
        <motion.div
          initial={ { x: -100, opacity: 0 } }
          animate={ { x: 0, opacity: 1 } }
          transition={ { duration: 0.8, ease: 'easeOut' } }
          className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-4">
            Hi, I&apos;m{ ' ' }
            <motion.span
              initial={ { x: -50, opacity: 0 } }
              animate={ { x: 0, opacity: 1 } }
              transition={ { duration: 0.5, ease: 'easeOut' } }
              className="text-blue-600 dark:text-blue-400"
            >
              { Bio.name }
            </motion.span>
          </h1>
          <div className='h-10'>
            <h2 className="text-2xl  font-semibold lg:text-3xl text-gray-600 dark:text-gray-300 mb-4">
              <TypeAnimation
                sequence={ Bio.roles.flatMap((role) => [role, 1000]) }
                wrapper="span"
                cursor={ false } // Disable the default cursor
                repeat={ Infinity }
              />
              {/* Custom Bullet Animation */ }
              { showBullet && (
                <motion.span
                  initial={ { x: -20, opacity: 0 } }
                  animate={ { x: 0, opacity: 1 } }
                  transition={ { duration: 0.5, ease: 'easeOut' } }
                  className="ml-2 text-blue-600 dark:text-blue-400 "
                >
                  •
                </motion.span>
              ) }
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{ Bio.description }</p>
          <div className="flex justify-center lg:justify-start space-x-4 mb-6">
            <SocialIcon href={ Bio.github } icon={ FaGithub } label="GitHub" />
            <SocialIcon href={ Bio.linkedin } icon={ FaLinkedin } label="LinkedIn" />
            <SocialIcon href={ Bio.twitter } icon={ FaTwitter } label="Twitter" />
            <SocialIcon href={ Bio.insta } icon={ FaInstagram } label="Instagram" />
            <SocialIcon href={ Bio.facebook } icon={ FaFacebook } label="Facebook" />
            <SocialIcon href={ Bio.stack_overflow } icon={ FaStackOverflow } label="Stack Overflow" />
          </div>
          <Link href="/omkar-chebale-resume">
            <ResumeButton />
          </Link>
        </motion.div>

        {/* Right Side: Profile Image */ }
        <motion.div
          initial={ { opacity: 0, scale: 0.5 } }
          animate={ { opacity: 1, scale: 1 } }
          transition={ { duration: 0.8, ease: 'easeOut' } }
          className="lg:w-1/2 flex justify-center lg:justify-end"
        >
          <motion.div
            className="relative w-80 h-80 lg:w-96 lg:h-96"
            whileHover={ { scale: 1.1 } } // Zoom effect on hover
            transition={ { type: 'spring', stiffness: 300 } } // Smooth spring animation
          >
            <Image
              src="/profile.jpg"
              alt="Omkar Chebale"
              fill
              style={ { objectFit: 'cover' } }
              className="rounded-full shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const SocialIcon = ({ href, icon: Icon, label }: SocialIconProps) => (
  <motion.a
    href={ href }
    target="_blank"
    rel="noopener noreferrer"
    whileHover={ { scale: 1.2 } }
    whileTap={ { scale: 0.9 } }
    className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-300"
    aria-label={ label }
  >
    <Icon size={ 24 } />
  </motion.a>
);
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { darkColors, lightColors, NavbarLinks } from '@/utils/constants';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Header = () => {
    const { theme } = useTheme();
    const [headerColor, setHeaderColor] = useState('');
    const getRandomColor = (isDarkMode: boolean) => {
        const colors = isDarkMode ? darkColors : lightColors;
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Update header color whenever the theme changes
    useEffect(() => {
        const isDarkMode = theme === 'dark';
        setHeaderColor(getRandomColor(isDarkMode));
    }, [theme]);

    // Animation variants for the header
    const headerVariants = {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    // Animation variants for navigation links
    const linkVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        hover: { scale: 1.1, color: '#3B82F6', transition: { duration: 0.2 } }, // Blue color on hover
    };

    // Animation for the logo
    const logoVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        hover: { rotate: [0, 10, -10, 0], transition: { duration: 0.5 } }, // Fun wobble effect on hover
    };

    return (
        <motion.header
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="rounded-md sticky top-0 z-50 border-b border-border shadow-sm backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
            style={{ backgroundColor: headerColor }} // Apply random color
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo with animation */}
                <motion.div
                    variants={logoVariants}
                    whileHover="hover"
                >
                    <Link href="/" className="text-2xl font-bold">
                        Omkar Chebale
                    </Link>
                </motion.div>

                {/* Navigation with animations */}
                <nav className="hidden md:flex items-center space-x-6">
                    {NavbarLinks.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={linkVariants}
                            whileHover="hover"
                        >
                            <Link
                                href={item.link}
                                className="font-semibold hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Theme Toggle */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }}
                >
                    <ThemeToggle />
                </motion.div>
            </div>
        </motion.header>
    );
};
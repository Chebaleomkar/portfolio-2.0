'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useActiveSection } from '@/hooks/useActiveSections';
import { lightColors, NavbarLinks } from '@/utils/constants';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Header = () => {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [headerColor, setHeaderColor] = useState('');
  const sectionIds = ['freelance', 'review', 'skills', 'projects', 'contactMe'];
  const activeSection = useActiveSection(sectionIds);


  const getRandomColor = (isDarkMode: boolean) => {
    const colors = isDarkMode ? ['white'] : lightColors;
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

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={ headerVariants }
      className="rounded-md sticky top-0 z-50 dark:text-black  border-b border-border shadow-sm backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
      style={ { backgroundColor: headerColor } }
    >
      <div className="container mx-auto px-4 p-1 flex justify-between items-center">
        {/* Logo with slight tilt */ }
        <motion.div
          className='dark:bg-white '
        >
          <Link href="/">
            <Image
              src="/sign-removebg-preview.png"
              alt="Omkar Chebale"
              width={ 150 }
              height={ 100 }
              className="object-contain max-sm:w-[50%]   "
            />
          </Link>
        </motion.div>

        <div className="flex gap-5 items-center justify-center">

          { NavbarLinks.map((item, index) => {
            const sectionId = item.link.startsWith('/#') ? item.link.split('#')[1] : '';
            const isActive =
              (sectionId && sectionId === activeSection) ||
              (!activeSection && item.link === '/');

            return (
              <motion.div key={ index } variants={ linkVariants } whileHover="hover">
                <Link
                  href={ item.link }
                  className={ `font-semibold transition-colors ${isActive
                    ? 'text-xl text-blue-600 dark:text-yellow-400'
                    : 'dark:hover:text-yellow-500'
                    }` }
                >
                  { item.name }
                </Link>
              </motion.div>
            );
          }) }


        </div>


        {/* Theme Toggle */ }
        <motion.div
          initial={ { opacity: 0, x: 50 } }
          animate={ { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } } }
        >
          <ThemeToggle />
        </motion.div>
      </div>
    </motion.header>
  );
};
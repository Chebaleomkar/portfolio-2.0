"use client";
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const iconSize = 30;

  return (
    <div
      className="flex items-center space-x-4 cursor-pointer"
      onClick={ toggleTheme }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={ theme }
          initial={ { opacity: 0, rotate: -45 } }
          animate={ { opacity: 1, rotate: 0 } }
          exit={ { opacity: 0, rotate: 45 } }
          transition={ { duration: 0.3, ease: "easeInOut" } }
          className="text-muted-foreground"
        >
          { theme === 'light' ? <Sun size={ iconSize } /> : <Moon size={ iconSize } /> }
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
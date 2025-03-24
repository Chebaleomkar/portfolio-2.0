'use client';
import GithubAnimatedButton from '@/components/GithubAnimationButton';
import LiveDemoButton from '@/components/LiveDemoButton';
import { Bio, projects } from '@/utils/data';
import { motion, useAnimation } from 'framer-motion';
import { MoveRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  webapp?: string;
  TitleColor?: string;
}

export const Projects = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
    setTimeout(() => setIsLoading(false), 1500);
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.section
      id="projects"
      initial={ { opacity: 0 } }
      animate={ { opacity: 1 } }
      transition={ { duration: 0.8 } }
      className="px-8 py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
    >
      { isLoading ? (
        <LoadingAnimation />
      ) : (
        <>
          <motion.h2
            initial={ { opacity: 0, y: -20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.5 } }
            className="text-4xl font-bold mb-10 text-center text-gray-800 dark:text-white"
          >
            Projects
          </motion.h2>
          <motion.div
            ref={ ref }
            variants={ containerVariants }
            initial="hidden"
            animate={ controls }
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-[90rem] mx-auto"
          >
            { projects.map((project, i) => (
              <ProjectCard key={ i } project={ project } index={ i } />
            )) }
          </motion.div>
          <Link href={ Bio.github }>
            <motion.div
              whileHover={ { scale: 1.05 } }
              whileTap={ { scale: 0.95 } }
              className="h-20 mt-10 flex items-center justify-center gap-8 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-gray-700 dark:to-gray-900 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center">
                <span className="text-lg font-medium">
                  See More Projects on <span className="font-semibold underline">GitHub</span>
                </span>
              </div>
              <MoveRightIcon size={ 35 } className="text-white animate-pulse" />
            </motion.div>
          </Link>
        </>
      ) }
    </motion.section>
  );
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      ref={ ref }
      variants={ cardVariants }
      initial="hidden"
      animate={ inView ? "visible" : "hidden" }
      whileHover={ { scale: 1.05, rotate: [0, -2, 2, -2, 0] } }
      transition={ { type: "spring", stiffness: 300 } }
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={ project.image }
          alt={ project.title }
          fill
          style={ { objectFit: 'cover' } }
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <motion.h3
          style={ { color: project.TitleColor } }
          whileHover={ { scale: 1.1, borderRadius: "50%" } }
          transition={ { type: "spring", stiffness: 300 } }
          className="text-xl font-semibold mb-2 h-14"
        >
          { project.title }
        </motion.h3>
        <p className="text-sm mb-4 text-clip line-clamp-3 text-gray-600 dark:text-gray-300">
          { project.description }
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          { project.tags.map((tag, index) => (
            <span
              key={ index }
              className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
            >
              { tag }
            </span>
          )) }
        </div>
        <div className="flex gap-4">
          { project.github && (
            <Link href={ project.github } target="_blank">
              <GithubAnimatedButton />
            </Link>
          ) }
          { project.webapp && (
            <Link href={ project.webapp } target="_blank">
              <LiveDemoButton />
            </Link>
          ) }
        </div>
      </div>
    </motion.div>
  );
};

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={ { rotate: 360 } }
        transition={ { duration: 1, repeat: Infinity, ease: 'linear' } }
      />
    </div>
  );
};
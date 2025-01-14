"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { skills } from "@/utils/data";

export const Skills = () => {
    return (
        <section id="skills" className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                    My Skills
                </h2>
                <div className="grid grid-cols-1 gap-8">
                    {skills.map((category, index) => (
                        <SkillCategory key={index} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const SkillCategory = ({ category }) => {
    const [ref, inView] = useInView({
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transform transition-all hover:scale-105 hover:shadow-xl"
        >
            <h3 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white tracking-wide">
                {category.title}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.skills.map((skill, skillIndex) => (
                    <SkillItem key={skillIndex} skill={skill} index={skillIndex} />
                ))}
            </div>
        </motion.div>
    );
};


const SkillItem = ({ skill, index }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            className="flex items-center space-x-3 p-2 rounded-lg bg-white dark:bg-gray-700 shadow-md transform transition-all hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-900"
        >
            <div className="relative w-10 h-10">
                <Image
                    src={skill.image}
                    alt={skill.name}
                    className="object-contain rounded-full border-2 border-gray-300 dark:border-gray-600"
                    layout="fill" // Use layout "fill" for responsive image sizes
                    objectFit="contain"
                />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-md font-semibold text-gray-700 dark:text-gray-200">
                    {skill.name}
                </span>
                {skill.description && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{skill.description}</span>
                )}
            </div>
        </motion.div>
    );
};

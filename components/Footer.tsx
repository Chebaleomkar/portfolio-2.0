"use client"
import { Bio } from "@/utils/data";
import { motion } from "framer-motion";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="dark:bg-gray-800 rounded-md py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground">
          © { new Date().getFullYear() } { Bio.name }. All rights reserved.
        </p>
        {/* Animated Sign Image */ }
        <motion.div
          initial={ { opacity: 0, y: 20 } }
          whileInView={ { opacity: 1, y: 0 } }
          transition={ { duration: 0.8, ease: "easeOut" } }
          viewport={ { once: true } }
          className="mt-6 bg-white dark:bg-white rounded-lg p-4 h-52 flex items-center justify-center"
        >
          <Image
            src="/sign.png"
            alt="Omkar Chebale"
            width={ 200 } // Adjust width as needed
            height={ 100 } // Adjust height as needed
            className="object-contain"
          />
        </motion.div>
      </div>
    </footer>
  );
};
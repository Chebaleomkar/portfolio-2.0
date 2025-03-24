import { motion } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
const GithubAnimatedButton = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Button */ }
      <motion.button
        whileHover={ { scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)" } }
        whileTap={ { scale: 0.95 } }
        transition={ { type: "spring", stiffness: 300, damping: 20 } }
        style={ { backgroundColor: ' #111827 ' } }
        className="w-10 h-10 p-2 bg-gray-900 dark:bg-gray-800 text-gray-700 dark:text-gray-100 font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        <motion.span
          whileHover={ {
            x: [0, -10, 10, -10, 10, 0],
            rotate: [0, -15, 15, -15, 15, 0],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          } }
        >
          <FaGithub size={ 35 } className="text-slate-200 " />
        </motion.span>
      </motion.button>
    </div>
  );
};

export default GithubAnimatedButton;
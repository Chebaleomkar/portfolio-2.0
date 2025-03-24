import { motion } from 'framer-motion';
import { FaGlobe } from 'react-icons/fa';
const LiveDemoButton = () => {
  return (
    <div className="relative flex items-center justify-center">

      {/* Button */ }
      <motion.button
        whileHover={ { scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)" } }
        whileTap={ { scale: 0.95 } }
        transition={ { type: "spring", stiffness: 300, damping: 20 } }
        className="w-20 h-10 p-2 bg-gray-100 dark:bg-gray-800 text-gray-700  dark:text-gray-100 font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        <motion.span
          whileHover={ {
            x: [0, 10, -10, 10, -10, 0],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            },
          } }
        >
          <FaGlobe size={ 25 } className="text-gray-700 dark:text-gray-100" />
        </motion.span>
      </motion.button>
    </div>
  );
};

export default LiveDemoButton;
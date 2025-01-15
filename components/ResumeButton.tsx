import { motion } from 'framer-motion';
import { IoDocumentOutline } from 'react-icons/io5';

const ResumeButton = () => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#7C3AED' }} // Purple on hover
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className=" text-white font-bold py-3 bg-green-500 dark:bg-yellow-500 px-6 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
            <div className="flex items-center justify-center gap-2">
                <motion.span
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                >
                    <IoDocumentOutline className="w-6 h-6" />
                </motion.span>
                <span>View Resume</span>
            </div>
        </motion.button>
    );
};

export default ResumeButton;
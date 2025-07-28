import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackdropLoaderProps {
  isVisible: boolean;
}

export const BackdropLoader: React.FC<BackdropLoaderProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            
            {/* Optional: Future Lottie animation placeholder */}
            {/* <div className="absolute inset-0 flex items-center justify-center">
              <Lottie animationData={loaderAnimation} loop={true} />
            </div> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 
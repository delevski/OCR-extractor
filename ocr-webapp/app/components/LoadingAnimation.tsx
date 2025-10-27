'use client';

import { motion } from 'framer-motion';

export default function LoadingAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-12 text-center"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Spinner */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.svg
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </motion.svg>
          </div>
        </div>

        <div className="space-y-2">
          <motion.h3
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xl font-semibold text-gray-800"
          >
            Processing OCR...
          </motion.h3>
          <p className="text-gray-500">
            Extracting text from your image
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

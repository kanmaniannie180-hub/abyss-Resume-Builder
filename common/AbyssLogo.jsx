import React from 'react';
import { motion } from 'framer-motion';

export default function AbyssLogo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { icon: 32, text: 'text-xl' },
    md: { icon: 48, text: 'text-3xl' },
    lg: { icon: 64, text: 'text-5xl' }
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex items-center justify-center"
        style={{ width: s.icon, height: s.icon }}
      >
        {/* Lavender Feather Icon */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none"
          className="w-full h-full drop-shadow-md"
        >
          <path 
            d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" 
            fill="#C4B5FD"
            stroke="#C4B5FD"
            strokeWidth="0.5"
          />
        </svg>
      </motion.div>
      
      {showText && (
        <motion.span
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={`font-bold tracking-tight ${s.text} text-[#0B1F3B] dark:text-white`}
        >
          Abyss
        </motion.span>
      )}
    </div>
  );
}
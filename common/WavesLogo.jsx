import React from 'react';
import { motion } from 'framer-motion';

export default function WavesLogo({ size = 'default' }) {
  const sizes = {
    small: 'w-12 h-12',
    default: 'w-24 h-24',
    splash: 'w-48 h-48'
  };

  const floatingVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      variants={floatingVariants}
      animate="animate"
      className={`${sizes[size]} relative flex items-center justify-center`}
    >
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 via-[#14B8A6]/20 to-transparent rounded-full blur-3xl" />
      
      {/* Main logo container */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#14B8A6', stopOpacity: 1 }} />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle with subtle shadow */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="url(#waveGradient)" strokeWidth="1" opacity="0.3" />
        
        {/* Wave 1 - Flowing top wave */}
        <path
          d="M 30 100 Q 50 60, 70 70 T 110 80 T 150 90 T 170 100"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          opacity="0.9"
        />
        
        {/* Wave 2 - Middle wave */}
        <path
          d="M 30 110 Q 55 85, 75 95 T 115 105 T 165 115"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
        
        {/* Wave 3 - Lower wave */}
        <path
          d="M 35 125 Q 60 105, 80 115 T 120 130 T 170 140"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Accent dots for premium feel */}
        <circle cx="70" cy="70" r="1.5" fill="#2563EB" opacity="0.8" />
        <circle cx="110" cy="80" r="1.5" fill="#14B8A6" opacity="0.8" />
        <circle cx="150" cy="90" r="1.5" fill="#06B6D4" opacity="0.8" />
      </svg>
    </motion.div>
  );
}
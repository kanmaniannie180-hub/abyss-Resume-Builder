import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, FileText, Sparkles, Briefcase, Award } from 'lucide-react';
import WavesLogo from '@/components/common/WavesLogo';

export default function Splash() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const buttonRef = useRef(null);



  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden" style={{ fontFamily: 'system-ui' }}>
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-24 border-r border-white/10 flex flex-col items-center justify-center gap-8 z-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="text-blue-600 font-bold text-sm tracking-widest" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            ABYSS
          </div>
        </motion.div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          {['TEMPLATES', 'PORTFOLIO', 'FEATURES', 'CAREERS'].map((text, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <a href="#" className="text-xs tracking-widest text-white/50 hover:text-white/80 transition" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                {text}
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-24 h-screen flex items-center justify-between px-16 gap-12">
        {/* Left Section - Text */}
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex-1 space-y-8">
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <span className="text-blue-600 text-sm font-bold tracking-widest flex items-center gap-2">
                <FileText className="w-4 h-4" /> CRAFT YOUR STORY
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-6xl md:text-7xl font-bold mt-4 leading-tight"
            >
              Your Perfect Resume
            </motion.h1>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white/60 text-sm">
            Abyss • Editorial Resume Builder
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => navigate(createPageUrl('Home'))}
            className="relative inline-block cursor-pointer mt-6"
          >
            {/* White bubble background */}
            <motion.div
              className="absolute inset-0 bg-white rounded-full"
              style={{
                width: '56px',
                height: '56px',
                left: isHovering ? mousePos.x - 28 : '0px',
                top: isHovering ? mousePos.y - 28 : '0px'
              }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            />

            {/* Button text and icon */}
            <div className="relative z-10 px-6 py-3 flex items-center gap-2 font-semibold text-sm tracking-wider">
              <span className={isHovering ? 'text-black' : 'text-white'}>EXPLORE</span>
              <ArrowRight className={`w-4 h-4 ${isHovering ? 'text-black' : 'text-white'}`} />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-white/50 text-sm max-w-sm leading-relaxed mt-12">
            Craft beautiful, ATS-optimized resumes with AI-powered intelligence. Stand out to employers with precision-engineered professional documents.
          </motion.p>
        </motion.div>

        {/* Right Section - Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex-1 relative h-96 space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-blue-500/20 to-transparent rounded-xl border border-white/20 p-6 flex flex-col items-center justify-center gap-3"
            >
              <Sparkles className="w-8 h-8 text-blue-400" />
              <p className="text-white/70 text-xs font-medium">AI-Enhanced</p>
            </motion.div>
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-teal-500/20 to-transparent rounded-xl border border-white/20 p-6 flex flex-col items-center justify-center gap-3"
            >
              <Award className="w-8 h-8 text-teal-400" />
              <p className="text-white/70 text-xs font-medium">ATS-Optimized</p>
            </motion.div>
          </div>
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-purple-500/20 to-transparent rounded-xl border border-white/20 p-8 flex flex-col items-center justify-center gap-3 h-40"
          >
            <Briefcase className="w-10 h-10 text-purple-400" />
            <p className="text-white/70 text-xs font-medium">Professional Templates</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 right-6 z-20">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex items-center gap-4 cursor-pointer hover:gap-6 transition-all" onClick={() => navigate(createPageUrl('Home'))}>
          <span className="text-xs text-white/50">Next</span>
          <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowRight className="w-4 h-4 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
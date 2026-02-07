import { useState, useEffect } from 'react';
import { motion } from "motion/react";
import { fetchSettings } from '@/hooks/useSiteSettings';

export function WelcomeSection() {
  const [tagline, setTagline] = useState('Explore My Digital World');
  const [bgImage, setBgImage] = useState('/background1.jpg');

  useEffect(() => {
    fetchSettings().then((s) => {
      setTagline(s.tagline);
      setBgImage(s.welcome_bg);
    });
  }, []);

  return (
    <section
      className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url("${bgImage}")`,
      }}
    >
      {/* 黑色半透明遮罩，让白色文字更清晰 */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-6 drop-shadow-lg"
        >
          WELCOME
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xl md:text-2xl text-gray-200 font-light tracking-widest uppercase"
        >
          {tagline}
        </motion.p>
      </div>
      
      {/* 底部指示箭头 */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/70"
      >
        <span className="text-sm tracking-widest">SCROLL DOWN</span>
      </motion.div>
    </section>
  );
}
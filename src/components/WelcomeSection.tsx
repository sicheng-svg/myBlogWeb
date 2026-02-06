import { motion } from "motion/react";

export function WelcomeSection() {
  return (
    <section 
      className="relative h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        // 这里换成你想要的【Welcome 顶部大背景图】
        backgroundImage: 'url("/background1.jpg")',
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
          Explore My Digital World
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
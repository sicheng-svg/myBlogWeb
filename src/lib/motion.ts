import type { Transition, Variants } from 'motion/react';

// ── 标准 spring 过渡（通用默认） ──
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
  mass: 0.8,
};

// ── 柔和 spring（大面积揭示动画） ──
export const gentleSpring: Transition = {
  type: 'spring',
  stiffness: 60,
  damping: 18,
  mass: 1,
};

// ── 快速 spring（hover、tap 微交互） ──
export const quickSpring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 25,
};

// ── 持续时间过渡（页面级淡入等场景） ──
export const fadeDuration: Transition = {
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1],
};

// ── 常用动画变体 ──

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: fadeDuration,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
};

// ── 容器变体（子元素交错入场） ──
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

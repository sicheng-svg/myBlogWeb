import { motion, type Variants, type Transition } from 'motion/react';
import { springTransition, fadeInUp } from '@/lib/motion';
import { cn } from '@/components/ui/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  transition?: Transition;
  delay?: number;
  once?: boolean;
  margin?: string;
}

export function ScrollReveal({
  children,
  className,
  variants = fadeInUp,
  transition,
  delay,
  once = true,
  margin = '-50px',
}: ScrollRevealProps) {
  const resolvedTransition = transition
    ?? (delay != null ? { ...springTransition, delay } : undefined);

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={resolvedTransition}
    >
      {children}
    </motion.div>
  );
}

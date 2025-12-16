'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import content from '@/content/landing.ru.json';

interface Screen1_ContextProps {
  onNext: () => void;
}

export default function Screen1_Context({ onNext }: Screen1_ContextProps) {
  const screenContent = content.screens.s1;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: prefersReducedMotion ? 0.1 : 0.3,
      },
    }),
  };

  return (
    <section
      data-screen="1"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="relative z-10 max-w-4xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.5 }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-3 md:mb-4 text-gray-900"
        >
          {screenContent.h1}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: prefersReducedMotion ? 0.1 : 0.5 }}
          className="text-lg md:text-xl text-center mb-6 md:mb-12 text-gray-600 max-w-2xl mx-auto"
        >
          {screenContent.sub}
        </motion.p>

        <ul className="max-w-2xl mx-auto mb-6 md:mb-12 space-y-3">
          {screenContent.bullets.map((bullet, index) => (
            <motion.li
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="flex items-start gap-3 text-gray-700"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-2" />
              <span className="leading-relaxed">{bullet}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: prefersReducedMotion ? 0.1 : 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-800 to-cyan-400 text-white rounded-lg hover:from-blue-700 hover:to-cyan-300 transition-all text-base font-medium"
          >
            {screenContent.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

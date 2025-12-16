'use client';

import { motion } from 'framer-motion';
import { ArrowRight, TrendingDown, FileWarning, Percent, Landmark, AlertTriangle } from 'lucide-react';
import content from '@/content/landing.ru.json';

interface Screen1_ContextProps {
  onNext: () => void;
}

const icons = [AlertTriangle, Percent, FileWarning, Landmark, TrendingDown];

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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 pt-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="relative z-10 max-w-4xl w-full">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center mb-4 text-gray-900"
        >
          {screenContent.h1}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: prefersReducedMotion ? 0.1 : 0.5 }}
          className="text-lg md:text-xl text-center mb-12 text-gray-600 max-w-2xl mx-auto"
        >
          {screenContent.sub}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {screenContent.bullets.map((bullet, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm">{bullet}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: prefersReducedMotion ? 0.1 : 0.5 }}
          className="flex justify-center"
        >
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-base font-medium"
          >
            {screenContent.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

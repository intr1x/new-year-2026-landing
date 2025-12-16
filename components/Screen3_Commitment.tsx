'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import content from '@/content/landing.ru.json';

interface Screen3_CommitmentProps {
  onNext: () => void;
}

export default function Screen3_Commitment({ onNext }: Screen3_CommitmentProps) {
  const screenContent = content.screens.s3;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      data-screen="3"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      <div className="relative z-10 max-w-4xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-3 md:mb-4 text-gray-900"
        >
          {screenContent.h2}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-center mb-6 md:mb-12 text-gray-600 leading-relaxed max-w-2xl mx-auto"
        >
          {screenContent.text}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.5 }}
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

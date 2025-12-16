'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Eye, BarChart3, Shield } from 'lucide-react';
import content from '@/content/landing.ru.json';

interface Screen3_CommitmentProps {
  onNext: () => void;
}

const icons = [Eye, BarChart3, Shield];

export default function Screen3_Commitment({ onNext }: Screen3_CommitmentProps) {
  const screenContent = content.screens.s3;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      data-screen="3"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 pt-32 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      <div className="relative z-10 max-w-4xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-4 text-gray-900"
        >
          {screenContent.h2}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-center mb-12 text-gray-600 leading-relaxed max-w-2xl mx-auto"
        >
          {screenContent.text}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {screenContent.principles.map((principle, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gray-900 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {principle}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.5 }}
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

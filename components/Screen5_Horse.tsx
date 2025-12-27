'use client';

import { motion } from 'framer-motion';
import content from '@/content/landing.ru.json';
import Image from 'next/image';

export default function Screen5_Horse() {
  const screenContent = content.screens.s5;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section
      data-screen="5"
      className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 relative overflow-hidden bg-gradient-to-b from-white to-red-50"
    >
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center px-6">
        <div className="text-left order-2 lg:order-1">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 text-gray-900 leading-[1.15] tracking-tight"
          >
            {screenContent.h2}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: prefersReducedMotion ? 0.1 : 1 }}
            className="text-xl md:text-2xl font-handwriting text-gray-600"
          >
            Ваша команда — всегда рядом.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: prefersReducedMotion ? 0.1 : 0.8 }}
          className="relative order-1 lg:order-2 flex flex-col items-center lg:items-end"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-white max-w-[85%] lg:max-w-full bg-white">
            <img
              src={screenContent.image}
              alt={screenContent.imageAlt}
              className="w-full h-auto max-h-[40vh] lg:max-h-[55vh] object-contain block"
            />
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-[10px] md:text-xs text-gray-400 font-sans italic"
          >
            К. Петров-Водкин, «Купание красного коня», 1912
          </motion.p>
        </motion.div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl" />
      </div>
    </section>
  );
}

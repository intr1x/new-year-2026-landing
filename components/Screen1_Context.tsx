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
      className="h-screen flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 md:pt-32"
    >
      {/* Background 2025 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-0 overflow-hidden">
        <span className="text-[30vw] md:text-[45vw] font-display font-bold text-gray-400/10 leading-none">
          2025
        </span>
      </div>

      {/* Pulsing Heart - Absolute positioned to not interfere with text flow */}
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{
            scale: [1, 1.2, 1.1, 1.15, 1],
            transition: {
              duration: 0.8,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              times: [0, 0.2, 0.4, 0.6, 1]
            }
          }}
          className="cursor-pointer drop-shadow-2xl pointer-events-auto"
        >
          <svg width="240" height="240" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#cc0000" />
              </linearGradient>
            </defs>
            <path
              d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
              fill="url(#heartGradient)"
            />
          </svg>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center justify-between h-full pb-12 md:pb-24">
        {/* Top: Curved Text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.5 }}
          className="w-full"
        >
          <svg viewBox="0 0 1000 350" className="w-full h-auto overflow-visible">
            <defs>
              <path
                id="textCurve"
                d="M 100,300 A 400,250 0 0,1 900,300"
              />
            </defs>
            <text className="font-display font-bold fill-gray-900 uppercase">
              <textPath
                xlinkHref="#textCurve"
                startOffset="50%"
                textAnchor="middle"
                style={{ fontSize: '90px' }}
              >
                {screenContent.h1}
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Bottom part: Subtitle, Bullets, and Button */}
        <div className="flex flex-col items-center gap-8 w-full">
          {screenContent.sub && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: prefersReducedMotion ? 0.1 : 0.5 }}
              className="text-lg md:text-xl text-center text-gray-600 max-w-2xl mx-auto"
            >
              {screenContent.sub}
            </motion.p>
          )}

          {screenContent.bullets && screenContent.bullets.length > 0 && (
            <ul className="max-w-2xl mx-auto space-y-3">
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
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: prefersReducedMotion ? 0.1 : 0.5 }}
            className="flex justify-center"
          >
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-light text-white rounded-full hover:from-brand-dark hover:to-brand-blue transition-all text-lg font-medium shadow-lg shadow-brand-blue/25 hover:scale-105 active:scale-95"
            >
              {screenContent.cta}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

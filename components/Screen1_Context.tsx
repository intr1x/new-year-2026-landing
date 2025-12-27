'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Screen1_ContextProps {
  onNext: () => void;
}

export default function Screen1_Context({ onNext }: Screen1_ContextProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const yearRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const screenContent = content.screens.s1;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const title = containerRef.current?.querySelector('h1');

      // 0. Красивая анимация появления заголовка
      if (title) {
        gsap.fromTo(title, 
          {
            opacity: 0,
            scale: 0.5,
            y: 100,
            rotateX: -90,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            duration: 1.4,
            ease: 'expo.out',
            delay: 0.5,
            clearProps: 'y,scale,rotateX', // Очищаем свойства после анимации
          }
        );
      }

      // 1. Анимация 2025 (уменьшение)
      gsap.to(yearRef.current, {
        scale: 0.15,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });

      // 2. Анимация исчезновения заголовка при скролле (fromTo для точного контроля)
      if (title) {
        gsap.fromTo(title, 
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
          },
          {
            opacity: 0,
            y: -100,
            scale: 0.8,
            rotateX: 90,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '50% top',
              scrub: true,
            }
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      data-screen="1"
      className="h-screen flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-gray-50 to-white pt-20 md:pt-32"
    >
      {/* Background 2025 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span
          ref={yearRef}
          className="text-[30vw] md:text-[45vw] font-display font-bold text-gray-400 leading-none will-change-transform opacity-30"
        >
          2025
        </span>
      </div>

      {/* Pulsing Heart */}
      <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{
            scale: [1, 1.2, 1.1, 1.15, 1],
            transition: {
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 0.8,
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

      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center justify-between h-full pb-12 md:pb-24">
        {/* Заголовок в одну линию */}
        <div ref={containerRef} className="w-full text-center px-4 mt-20" style={{ perspective: '1000px' }}>
          <h1 className="font-display font-bold text-gray-900 uppercase text-[40px] md:text-[80px] lg:text-[100px] leading-none opacity-0 will-change-transform">
            {screenContent.h1}
          </h1>
        </div>

        {/* Bottom part */}
        <div className="flex flex-col items-center gap-8 w-full">
          {screenContent.sub && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-center text-gray-600 max-w-2xl mx-auto"
            >
              {screenContent.sub}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
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

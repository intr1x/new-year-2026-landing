'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

export default function Screen5_Horse() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const screenContent = content.screens.s5;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Параллакс для изображения
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        y: -50,
        rotate: 2,
        scale: 1.05,
        ease: 'none',
      });

      // Анимация текста
      gsap.from(textRef.current, {
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
        },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      data-screen="5"
      className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 relative overflow-hidden bg-gradient-to-b from-white to-red-50"
    >
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center px-6">
        <div ref={textRef} className="text-left order-2 lg:order-1">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 text-gray-900 leading-[1.15] tracking-tight"
          >
            {screenContent.h2}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xl md:text-2xl font-handwriting text-gray-600"
          >
            Ваша команда — всегда рядом.
          </motion.p>
        </div>

        <div
          ref={imageRef}
          className="relative order-1 lg:order-2 flex flex-col items-center lg:items-end"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 md:border-8 border-white max-w-[85%] lg:max-w-full bg-white transition-transform duration-500">
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
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-3xl" />
      </div>
    </section>
  );
}

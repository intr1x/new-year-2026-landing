'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

interface Screen3_CommitmentProps {
  onNext: () => void;
}

export default function Screen3_Commitment({ onNext }: Screen3_CommitmentProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const screenContent = content.screens.s3;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Pinning and Text Reveal
      const chars = gsap.utils.toArray('.char');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%', // Немного увеличим длину скролла для плавности
          pin: true,
          pinType: 'transform',
          scrub: 1,
        }
      });

      tl.to(chars, {
        color: '#111827', // dark gray (gray-900)
        stagger: 0.1,
        ease: 'none',
      });

      // Фоновые элементы параллакс
      gsap.to('.bg-decor', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: true,
        },
        y: -150,
        rotate: 15,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div data-screen="3">
      <section
        ref={sectionRef}
        className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden bg-white"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="bg-decor absolute -top-20 -left-20 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
          <div className="bg-decor absolute top-1/2 -right-20 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl" />
        </div>

        <div ref={containerRef} className="relative z-10 max-w-7xl w-full">
        <div className="max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-3xl md:text-5xl lg:text-[72px] font-display font-bold text-left mb-6 md:mb-8 text-gray-900 leading-tight"
          >
            {screenContent.h2}
          </motion.h2>

          <p className="text-xl md:text-2xl lg:text-3xl text-left mb-8 md:mb-12 font-bold leading-tight tracking-tight text-gray-200">
            {screenContent.text.split('').map((char, i) => (
              <span key={i} className="char">
                {char}
              </span>
            ))}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.4 }}
            className="flex justify-start"
          >
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full hover:bg-brand-dark transition-all text-lg font-bold shadow-2xl shadow-brand-blue/20 hover:scale-105 active:scale-95"
            >
              {screenContent.cta}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
      </section>
    </div>
  );
}

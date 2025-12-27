'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, ShieldCheck } from 'lucide-react';
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

  const icons = [Zap, BarChart3, ShieldCheck];

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Анимация карточек принципов
      gsap.from('.principle-card', {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Фоновые элементы параллакс
      gsap.to('.bg-decor', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
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
    <section
      ref={sectionRef}
      data-screen="3"
      className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="bg-decor absolute -top-20 -left-20 w-64 h-64 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="bg-decor absolute top-1/2 -right-20 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl" />
      </div>

      <div ref={containerRef} className="relative z-10 max-w-5xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-4xl md:text-6xl font-display font-bold text-center mb-6 text-gray-900"
        >
          {screenContent.h2}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-center mb-12 md:mb-16 text-gray-600 leading-relaxed max-w-3xl mx-auto"
        >
          {screenContent.text}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-20">
          {screenContent.principles.map((principle, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={index}
                className="principle-card bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-xl transition-shadow duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  {principle}
                </h3>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center"
        >
          <button
            onClick={onNext}
            className="flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-blue to-brand-light text-white rounded-full hover:from-brand-dark hover:to-brand-blue transition-all text-lg font-bold shadow-xl shadow-brand-blue/25 hover:scale-105 active:scale-95"
          >
            {screenContent.cta}
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

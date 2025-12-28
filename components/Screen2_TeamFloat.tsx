'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Check, Star, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CARD_COLORS = [
  { border: 'border-[#84CC16]', icon: Check, color: '#84CC16' }, // Зеленый
  { border: 'border-[#F97316]', icon: Star, color: '#F97316' },  // Оранжевый
  { border: 'border-[#0245EE]', icon: Zap, color: '#0245EE' },   // Синий (бренд)
  { border: 'border-[#EC4899]', icon: Heart, color: '#EC4899' }, // Розовый
];

export default function Screen2_TeamFloat() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);

  const screenContent = content.screens.s2;
  const [isMounted, setIsMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion || !isMounted) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.team-card');
      
      gsap.fromTo(
        textBlockRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textBlockRef.current,
            start: 'top 85%',
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cards.length * 60}%`,
          pin: true,
          pinType: 'transform',
          scrub: 1,
        },
      });

      cards.forEach((card: any, i: number) => {
        tl.fromTo(
          card,
          { 
            y: '200%', 
            rotate: i % 2 === 0 ? -20 : 20,
          },
          {
            y: 0,
            rotate: (i % 2 === 0 ? -1.5 : 1.5) * (i + 1),
            duration: 1.2,
            ease: 'power3.out'
          },
          i > 0 ? "-=0.6" : undefined
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMounted]);

  return (
    <div data-screen="2" className="relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gray-200/50 z-20" />

      <section
        ref={sectionRef}
        className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden bg-[#F9F7F2]"
      >
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-7xl w-full"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            <div ref={textBlockRef} className="flex-1 max-w-2xl">
              <h2 className="text-3xl md:text-5xl lg:text-[72px] font-display font-bold text-left mb-6 md:mb-8 text-gray-900 leading-tight">
                Мы прошли этот год <span className="relative inline-block underline-wave">
                  вместе
                </span>
              </h2>
              <p className="text-lg md:text-xl lg:text-2xl text-left text-gray-600 leading-relaxed">
                {screenContent.text}
              </p>
            </div>

            <div ref={cardsRef} className="flex-1 relative h-[280px] sm:h-[320px] md:h-[380px] w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] flex items-center justify-center lg:mt-0 mt-8">
              {screenContent.points.map((point, index) => {
                const cardStyle = CARD_COLORS[index % CARD_COLORS.length];
                const Icon = cardStyle.icon;
                return (
                  <div
                    key={index}
                    className={`team-card absolute inset-0 bg-white border-4 md:border-[6px] ${cardStyle.border} shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] p-8 md:p-12 flex flex-col items-center justify-center text-center aspect-square translate-y-[200%]`}
                    style={{ zIndex: index }}
                  >
                    <div className="absolute top-6 right-6 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: cardStyle.color }}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <p className="text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-[1.1] tracking-tight py-2 text-gray-900">
                      {point}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </section>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200/50 z-20" />
    </div>
  );
}

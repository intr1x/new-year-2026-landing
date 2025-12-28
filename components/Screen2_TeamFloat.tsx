'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

export default function Screen2_TeamFloat() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Анимация листания карточек при скролле
      const cards = gsap.utils.toArray('.team-card');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cards.length * 60}%`, // Продолжительность скролла
          pin: true,
          pinType: 'transform',
          scrub: 1, // Привязка к скроллу
        },
      });

      cards.forEach((card: any, i: number) => {
        tl.fromTo(
          card,
          { 
            y: '120%', 
            rotate: i % 2 === 0 ? -10 : 10,
            opacity: 0 
          },
          {
            y: 0,
            rotate: (i % 2 === 0 ? -1.5 : 1.5) * (i + 1),
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
          },
          // Первая карточка появляется сразу, остальные с небольшим перекрытием
          i > 0 ? "-=0.4" : undefined
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMounted]);

  return (
    <div data-screen="2">
      <section
        ref={sectionRef}
        className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden bg-white"
      >
        <div className="relative z-10 max-w-7xl w-full">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-center">
          {/* Левая колонка: заголовок и текст */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-3xl md:text-5xl lg:text-[72px] font-display font-bold text-left mb-6 md:mb-8 text-gray-900 leading-tight">
              {screenContent.h2}
            </h2>

            <p className="text-lg md:text-xl lg:text-2xl text-left text-gray-600 leading-relaxed">
              {screenContent.text}
            </p>
          </div>

          {/* Правая колонка: квадратные карточки стопкой */}
          <div 
            ref={cardsRef} 
            className="flex-1 relative h-[280px] sm:h-[320px] md:h-[380px] w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] flex items-center justify-center lg:mt-0 mt-8"
          >
            {screenContent.points.map((point, index) => (
              <div
                key={index}
                className="team-card absolute inset-0 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] p-8 md:p-12 border border-gray-50 flex flex-col items-center justify-center text-center aspect-square opacity-0 translate-y-[120%]"
                style={{
                  zIndex: index,
                }}
              >
                <p className="bg-gradient-to-br from-brand-blue to-brand-dark bg-clip-text text-transparent text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight py-2">
                  {point}
                </p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

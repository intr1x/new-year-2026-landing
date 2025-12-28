'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

export default function Screen5_Horse() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const screenContent = content.screens.s5;
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Pinning the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinType: 'transform',
        scrub: 1,
      });

      // Параллакс для изображения
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
        },
        y: -30,
        rotate: 1,
        scale: 1.02,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div data-screen="5">
      <section
        ref={sectionRef}
        className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden bg-white"
      >
        <div className="relative z-10 max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
            
            {/* Левая колонка: заголовок */}
            <div ref={textRef} className="flex-1 max-w-xl text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-brand-blue to-brand-dark bg-clip-text text-transparent text-3xl md:text-5xl lg:text-[72px] font-display font-bold leading-[1.1] tracking-tight mb-8"
              >
                {screenContent.h2}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-3xl font-handwriting text-gray-400"
              >
                Ваша команда — всегда рядом.
              </motion.p>
            </div>

            {/* Правая колонка: изображение */}
            <div
              ref={imageRef}
              className="flex-[1.2] w-full max-w-xl flex flex-col items-center lg:items-end"
              style={{ perspective: "1000px" }}
            >
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }}
                className="relative rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.25)] bg-transparent inline-block"
              >
                <img
                  src={screenContent.image}
                  alt={screenContent.imageAlt}
                  className="w-auto h-auto max-w-full max-h-[65vh] object-contain block"
                />
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-[10px] md:text-xs text-gray-300 font-sans italic text-right w-full"
              >
                К. Петров-Водкин, «Купание красного коня», 1912
              </motion.p>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-light/5 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}

'use client';

import { useLayoutEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

export default function Screen5_Horse() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

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
  const messageContent = content.screens.s6;
  
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Анимация заголовка
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        }
      );

      // Анимация подзаголовка
      gsap.fromTo(
        subTextRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
          },
        }
      );

      // Параллакс изображения
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
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
    <div data-screen="6">
      <section
        ref={sectionRef}
        className="min-h-screen md:h-screen flex flex-col items-center justify-center px-4 pt-20 pb-10 md:pt-24 md:pb-16 relative overflow-hidden bg-slate-950"
      >
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-7xl w-full flex flex-col items-center justify-center h-full"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center w-full justify-center max-w-none">
            <div ref={textRef} className="flex-[1.4] text-center lg:text-left flex flex-col items-center lg:items-start">
              <h2
                ref={titleRef}
                className="bg-gradient-to-br from-white to-brand-light bg-clip-text text-transparent text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-4 md:mb-6 w-full"
              >
                Желаем оседлать своего <br className="hidden xl:block" />
                огненного коня в <span className="whitespace-nowrap">2026-м году!</span>
              </h2>

              <p
                ref={subTextRef}
                className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-handwriting text-brand-light/80 mb-6 md:mb-8"
              >
                Ваша команда Relevant — всегда рядом.
              </p>

              {/* Финальная кнопка рядом с текстом */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="flex flex-col items-center lg:items-start"
              >
                <a
                  href={messageContent.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-brand-blue text-white rounded-[20px] md:rounded-[24px] hover:bg-brand-dark transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_15px_30px_rgba(59,130,246,0.2)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.4)]"
                >
                  <div className="bg-white/20 p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:rotate-12 transition-transform duration-500">
                    <MessageSquareText className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span className="text-base md:text-lg lg:text-xl font-display font-bold">
                    {messageContent.cta}
                  </span>
                  
                  <div className="absolute inset-0 rounded-[20px] md:rounded-[24px] overflow-hidden pointer-events-none">
                    <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rotate-45 transform translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000" />
                  </div>
                </a>
                <p className="mt-3 text-gray-500 font-sans text-[10px] md:text-xs opacity-40 uppercase tracking-widest text-center lg:text-left">
                  Напишите нам, мы на связи
                </p>
              </motion.div>
            </div>

            <div
              ref={imageRef}
              className="flex-1 w-full max-w-2xl flex flex-col items-center lg:items-end"
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
                className="relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] bg-transparent inline-block"
              >
                <img
                  src={screenContent.image}
                  alt={screenContent.imageAlt}
                  className="w-auto h-auto max-w-full max-h-[40vh] md:max-h-[50vh] lg:max-h-[55vh] object-contain block"
                />
              </motion.div>
              <p className="mt-4 text-[10px] md:text-xs text-gray-500 font-sans italic text-right w-full">
                К. Петров-Водкин, «Купание красного коня», 1912
              </p>
            </div>
          </div>
        </motion.div>

        {/* Фоновые градиенты */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-light/10 rounded-full blur-[120px]" />
        </div>

        {/* Футер */}
        <footer className="absolute bottom-4 w-full text-center px-4">
          <p className="text-gray-600 text-[10px] md:text-xs font-sans tracking-[0.2em] uppercase opacity-50">
            &copy; {new Date().getFullYear()} Relevant. Рядом, шаг за шагом.
          </p>
        </footer>
      </section>
    </div>
  );
}

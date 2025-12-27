'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

interface FloatingPhoto {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  imageUrl: string;
}

export default function Screen2_TeamFloat() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const screenContent = content.screens.s2;
  const [photos, setPhotos] = useState<FloatingPhoto[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const animationRef = useRef<number>();
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
    if (typeof window === 'undefined') return;
    const photoCount = window.innerWidth < 768 ? 10 : 20;
    const initialPhotos: FloatingPhoto[] = Array.from({ length: photoCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.015,
      vy: (Math.random() - 0.5) * 0.015,
      size: 60 + Math.random() * 40,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      imageUrl: `https://i.pravatar.cc/150?u=team-${i}`,
    }));
    setPhotos(initialPhotos);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const animate = () => {
      setPhotos((prev) =>
        prev.map((photo) => ({
          ...photo,
          x: photo.x + photo.vx,
          y: photo.y + photo.vy,
          rotation: photo.rotation + photo.rotationSpeed,
          vx:
            photo.x <= 0 || photo.x >= 100
              ? -photo.vx
              : photo.vx + (Math.random() - 0.5) * 0.001,
          vy:
            photo.y <= 0 || photo.y >= 100
              ? -photo.vy
              : photo.vy + (Math.random() - 0.5) * 0.001,
        }))
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [prefersReducedMotion]);

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
          pin: true, // Закрепляем экран
          scrub: 1, // Привязка к скроллу
        },
      });

      cards.forEach((card: any, i: number) => {
        if (i === 0) {
          gsap.set(card, { opacity: 1, y: 0, scale: 1, rotate: -1.5 });
          return;
        }
        
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
          // Каждая следующая карточка начинает движение чуть раньше окончания предыдущей
          i > 1 ? "-=0.2" : undefined
        );
      });

      // Параллакс для всех фото фона при скролле внутри зафиксированного экрана
      gsap.to(photosRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cards.length * 60}%`,
          scrub: true,
        },
        y: -150,
        ease: 'none',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isMounted]);

  return (
    <section
      ref={sectionRef}
      data-screen="2"
      className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-white"
    >
      <div className="relative z-10 max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-center">
          {/* Левая колонка: заголовок и текст */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-4xl md:text-6xl lg:text-[80px] font-display font-bold text-left mb-6 md:mb-8 text-gray-900 leading-tight">
              {screenContent.h2}
            </h2>

            <p className="text-xl md:text-2xl text-left text-gray-600 leading-relaxed">
              {screenContent.text}
            </p>
          </div>

          {/* Правая колонка: квадратные карточки стопкой */}
          <div 
            ref={cardsRef} 
            className="flex-1 relative h-[300px] sm:h-[350px] md:h-[400px] w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] flex items-center justify-center lg:mt-0 mt-12"
          >
            {screenContent.points.map((point, index) => (
              <div
                key={index}
                className="team-card absolute inset-0 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[40px] p-8 md:p-12 border border-gray-50 flex flex-col items-center justify-center text-center aspect-square opacity-0 translate-y-[120%]"
                style={{
                  zIndex: index,
                }}
              >
                <p className="text-gray-900 text-2xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tight">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isMounted && (
        <div
          ref={photosRef}
          className="absolute inset-0 overflow-hidden pointer-events-none opacity-40"
        >
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                className="absolute rounded-full border-2 border-white shadow-lg overflow-hidden transition-all duration-500"
                style={{
                  left: `${photo.x}%`,
                  top: `${photo.y}%`,
                  width: `${photo.size}px`,
                  height: `${photo.size}px`,
                  rotate: prefersReducedMotion ? 0 : photo.rotation,
                }}
                animate={
                  !prefersReducedMotion
                    ? {
                        x: [0, 5, -5, 0],
                        y: [0, -5, 5, 0],
                      }
                    : {}
                }
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <img
                  src={photo.imageUrl}
                  alt={`Team member ${photo.id}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
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
  const screenContent = content.screens.s2;
  const [photos, setPhotos] = useState<FloatingPhoto[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
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
      size: 60 + Math.random() * 40, // Slightly larger photos
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

  return (
    <section
      data-screen="2"
      className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-white"
    >
      <div className="relative z-10 max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start">
          {/* Левая колонка: заголовок и текст */}
          <div className="flex-1 max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-5xl md:text-7xl lg:text-[90px] font-display font-bold text-left mb-6 md:mb-8 text-gray-900 leading-tight"
            >
              {screenContent.h2}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-left text-gray-600 leading-relaxed"
            >
              {screenContent.text}
            </motion.p>
          </div>

          {/* Правая колонка: карточки с наезжанием */}
          <div className="flex-1 relative h-[400px] lg:h-[500px] w-full max-w-md">
            {screenContent.points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50, rotate: 5 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                className="absolute w-full bg-white shadow-xl rounded-2xl p-6 border border-gray-100"
                style={{
                  top: `${index * 80}px`,
                  zIndex: screenContent.points.length - index,
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index + 1)}deg)`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center shadow-md">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-gray-700 text-base md:text-lg font-medium leading-snug">{point}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {isMounted && (
        <div
          ref={containerRef}
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

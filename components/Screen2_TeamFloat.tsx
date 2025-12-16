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
      size: 48 + Math.random() * 24,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-white"
    >
      <div className="relative z-10 max-w-3xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-center mb-3 md:mb-4 text-gray-900"
        >
          {screenContent.h2}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-center mb-6 md:mb-10 text-gray-600 leading-relaxed"
        >
          {screenContent.text}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 md:mb-10">
          {screenContent.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700 text-sm">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {isMounted && (
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
        >
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                className="absolute rounded-full bg-blue-600"
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
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

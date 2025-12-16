'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import content from '@/content/landing.ru.json';
import {
  trackGameHit,
  trackGameComplete,
  trackGameRetry,
} from '@/lib/analytics';

interface Screen4_GameCrisisProps {
  onNext: () => void;
}

interface Letter {
  char: string;
  broken: boolean;
  removed: boolean;
  experienceChar: string | null; // Буква из ОПЫТ, которая появится на месте этой буквы
  index: number;
}

export default function Screen4_GameCrisis({ onNext }: Screen4_GameCrisisProps) {
  const screenContent = content.screens.s4;
  const [letters, setLetters] = useState<Letter[]>([]);
  const [phase, setPhase] = useState<'first' | 'second'>('first');
  const [isComplete, setIsComplete] = useState(false);
  const [hammerPosition, setHammerPosition] = useState({ x: 0, y: 0 });
  const [isHitting, setIsHitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Маппинг букв КРИЗИС к буквам ОПЫТ
  const crisisToExperienceMap: Record<number, string> = {
    1: 'О', // Р -> О
    2: 'П', // И -> П
    3: 'Ы', // З -> Ы
    4: 'Т', // И -> Т
  };

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    setIsMobile(window.innerWidth < 768);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    mediaQuery.addEventListener('change', handleChange);
    window.addEventListener('resize', handleResize);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const word = screenContent.word;
    setLetters(
      word.split('').map((char, index) => ({
        char,
        broken: false,
        removed: false,
        experienceChar: crisisToExperienceMap[index] || null,
        index,
      }))
    );
  }, [screenContent.word, isMounted]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setHammerPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0] && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setHammerPosition({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleHit = (index: number) => {
    const letter = letters[index];
    if (isHitting) return;
    
    if (phase === 'first') {
      // Фаза 1: делаем букву серой (broken)
      if (letter.broken) return;
      
      setIsHitting(true);
      trackGameHit(letter.char, index);

      setLetters((prev) =>
        prev.map((l, i) => (i === index ? { ...l, broken: true } : l))
      );

      setTimeout(() => {
        setIsHitting(false);
        setLetters((currentLetters) => {
          const allBroken = currentLetters.every((l) => l.broken);
          if (allBroken) {
            // Переходим ко второй фазе
            setTimeout(() => {
              setPhase('second');
            }, 300);
          }
          return currentLetters;
        });
      }, 300);
    } else {
      // Фаза 2: удаляем буквы и показываем ОПЫТ на их месте
      if (letter.removed) return;
      
      setIsHitting(true);
      trackGameHit(letter.char, index);

      const isEdgeLetter = index === 0 || index === 5; // К или С
      
      if (isEdgeLetter) {
        // Крайние буквы просто исчезают
        setLetters((prev) =>
          prev.map((l, i) => (i === index ? { ...l, removed: true } : l))
        );
      } else {
        // Остальные буквы исчезают, но появляется буква из ОПЫТ на их месте
        setLetters((prev) =>
          prev.map((l, i) => (i === index ? { ...l, removed: true } : l))
        );
      }

      setTimeout(() => {
        setIsHitting(false);
        setLetters((currentLetters) => {
          const allRemoved = currentLetters.every((l) => l.removed);
          if (allRemoved) {
            setTimeout(() => {
              setIsComplete(true);
              trackGameComplete();
            }, 100);
          }
          return currentLetters;
        });
      }, 300);
    }
  };

  const handleRetry = () => {
    const word = screenContent.word;
    setLetters(
      word.split('').map((char, index) => ({
        char,
        broken: false,
        removed: false,
        experienceChar: crisisToExperienceMap[index] || null,
        index,
      }))
    );
    setPhase('first');
    setIsComplete(false);
    trackGameRetry();
  };


  return (
    <section
      data-screen="4"
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-white ${!isComplete ? 'cursor-none' : ''}`}
    >
      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-2xl md:text-3xl font-display font-bold mb-2 text-gray-900"
        >
          {screenContent.h2}
        </motion.h2>

        <p className="text-gray-500 mb-4 md:mb-8 text-sm">Нажимайте на буквы, чтобы разбить их</p>

        <div
          ref={containerRef}
          className={`relative min-h-[300px] flex items-center justify-center mb-4 md:mb-8 ${!isComplete ? 'cursor-none' : ''}`}
        >
          {!isComplete ? (
            <div className="flex gap-1 md:gap-3 items-center justify-center flex-wrap max-w-full px-2">
              {letters.map((letter, index) => {
                const isEdgeLetter = index === 0 || index === 5;
                const showExperience = phase === 'second' && letter.removed && letter.experienceChar && !isEdgeLetter;
                
                if (letter.removed && isEdgeLetter) {
                  // Крайние буквы просто исчезают, оставляя пустое место
                  return (
                    <div
                      key={`empty-${index}`}
                      className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
                    />
                  );
                }
                
                return (
                  <motion.div
                    key={`letter-${index}`}
                    className="relative flex items-center justify-center flex-shrink-0"
                  >
                    {showExperience ? (
                      // Показываем букву из ОПЫТ (зеленый градиент)
                      <motion.div
                        className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-display font-bold text-xl sm:text-2xl md:text-5xl flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {letter.experienceChar}
                      </motion.div>
                    ) : (
                      // Показываем букву из КРИЗИС (красный градиент)
                      <motion.button
                        onClick={() => handleHit(index)}
                        disabled={phase === 'first' && letter.broken}
                        className={`transition-all cursor-none flex items-center justify-center flex-shrink-0 ${
                          letter.removed
                            ? 'opacity-0 scale-0 pointer-events-none'
                            : ''
                        }`}
                        style={{
                          padding: 0,
                        }}
                        whileHover={!letter.removed && !(phase === 'first' && letter.broken) ? {} : {}}
                        whileTap={!letter.removed && !(phase === 'first' && letter.broken) ? {} : {}}
                        aria-label={`Разбить букву ${letter.char}`}
                        animate={
                          letter.removed
                            ? { opacity: 0, scale: 0 }
                            : {}
                        }
                      >
                        <div
                          className={`w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-lg sm:rounded-xl font-display font-bold text-xl sm:text-2xl md:text-5xl flex items-center justify-center ${
                            letter.broken
                              ? phase === 'first'
                                ? 'bg-gray-100 text-gray-300 scale-90'
                                : 'bg-gray-100 text-gray-300 scale-90'
                              : 'bg-gradient-to-r from-red-600 to-red-800 text-white'
                          }`}
                        >
                          {letter.char}
                        </div>
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
              className="space-y-4"
            >
              <div className="flex gap-1 sm:gap-2 md:gap-3 items-center justify-center flex-wrap">
                {screenContent.resultWord.split('').map((char, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-display font-bold text-xl sm:text-3xl md:text-5xl flex items-center justify-center"
                  >
                    {char}
                  </div>
                ))}
              </div>
              <p className="text-lg text-gray-600 font-medium mt-4">
                {screenContent.subtitleAfterWin}
              </p>
            </motion.div>
          )}

          {!isComplete && isMounted && (
            <motion.div
              className="absolute pointer-events-none z-20"
              style={{
                left: hammerPosition.x - 40,
                top: hammerPosition.y - 40,
              }}
              animate={
                isHitting
                  ? {
                      rotate: [0, -30, 0],
                      scale: [1, 1.3, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.2 }}
            >
              <div className="text-6xl md:text-7xl select-none">
                🔨
              </div>
            </motion.div>
          )}
        </div>

        {isComplete && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-800 to-cyan-400 text-white rounded-lg hover:from-blue-700 hover:to-cyan-300 transition-all font-medium text-sm"
              aria-label="Ещё раз"
            >
              <RotateCcw className="w-4 h-4" />
              {screenContent.buttons.retry}
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-800 to-cyan-400 text-white rounded-lg hover:from-blue-700 hover:to-cyan-300 transition-all font-medium text-sm"
            >
              {screenContent.buttons.next}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

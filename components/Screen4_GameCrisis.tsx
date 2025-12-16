'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hammer, ArrowRight, RotateCcw, SkipForward } from 'lucide-react';
import content from '@/content/landing.ru.json';
import {
  trackGameHit,
  trackGameComplete,
  trackGameRetry,
  trackGameSkip,
} from '@/lib/analytics';

interface Screen4_GameCrisisProps {
  onNext: () => void;
}

interface Letter {
  char: string;
  broken: boolean;
  index: number;
}

export default function Screen4_GameCrisis({ onNext }: Screen4_GameCrisisProps) {
  const screenContent = content.screens.s4;
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [hammerPosition, setHammerPosition] = useState({ x: 0, y: 0 });
  const [isHitting, setIsHitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
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
    if (!isMounted) return;
    const word = screenContent.word;
    setLetters(
      word.split('').map((char, index) => ({
        char,
        broken: false,
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
    if (letter.broken || isHitting) return;

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
          setTimeout(() => {
            setIsComplete(true);
            trackGameComplete();
          }, 100);
        }
        return currentLetters;
      });
    }, 300);
  };

  const handleRetry = () => {
    const word = screenContent.word;
    setLetters(
      word.split('').map((char, index) => ({
        char,
        broken: false,
        index,
      }))
    );
    setIsComplete(false);
    trackGameRetry();
  };

  const handleSkip = () => {
    trackGameSkip();
    onNext();
  };

  return (
    <section
      data-screen="4"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 pt-32 relative overflow-hidden bg-white"
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

        <p className="text-gray-500 mb-8 text-sm">Нажимайте на буквы, чтобы разбить их</p>

        <div
          ref={containerRef}
          className="relative min-h-[300px] flex items-center justify-center mb-8"
        >
          {!isComplete ? (
            <div className="flex gap-2 md:gap-3 items-center justify-center flex-wrap">
              {letters.map((letter, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleHit(index)}
                  disabled={letter.broken}
                  className={`relative w-14 h-14 md:w-20 md:h-20 rounded-xl font-display font-bold text-3xl md:text-5xl transition-all ${
                    letter.broken
                      ? 'bg-gray-100 text-gray-300 scale-90'
                      : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
                  }`}
                  whileHover={!letter.broken ? { scale: 1.05 } : {}}
                  whileTap={!letter.broken ? { scale: 0.95 } : {}}
                  aria-label={`Разбить букву ${letter.char}`}
                >
                  {letter.char}
                </motion.button>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
              className="space-y-4"
            >
              <div className="flex gap-2 md:gap-3 items-center justify-center">
                {screenContent.resultWord.split('').map((char, index) => (
                  <div
                    key={index}
                    className="w-14 h-14 md:w-20 md:h-20 rounded-xl bg-blue-600 text-white font-display font-bold text-3xl md:text-5xl flex items-center justify-center"
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
                left: hammerPosition.x - 20,
                top: hammerPosition.y - 20,
              }}
              animate={
                isHitting
                  ? {
                      rotate: [0, -30, 0],
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                <Hammer className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {isComplete ? (
            <>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                aria-label="Ещё раз"
              >
                <RotateCcw className="w-4 h-4" />
                {screenContent.buttons.retry}
              </button>
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                {screenContent.buttons.next}
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={handleSkip}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
              aria-label="Пропустить игру"
            >
              <SkipForward className="w-4 h-4" />
              {screenContent.buttons.skip}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

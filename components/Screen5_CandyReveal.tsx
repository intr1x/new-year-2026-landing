'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';
import content from '@/content/landing.ru.json';
import {
  trackCandyOpen,
  trackMessageRevealed,
  trackShareMessage,
} from '@/lib/analytics';

type CandyState = 'closed' | 'opening' | 'open' | 'unfolded';

export default function Screen5_CandyReveal() {
  const screenContent = content.screens.s5;
  const [state, setState] = useState<CandyState>('closed');
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
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

  const handleOpen = () => {
    if (state === 'closed') {
      setState('opening');
      trackCandyOpen();

      setTimeout(() => {
        setState('open');
        const randomMessage =
          screenContent.messages[
            Math.floor(Math.random() * screenContent.messages.length)
          ];
        setSelectedMessage(randomMessage);
        const messageId = screenContent.messages.indexOf(randomMessage);
        trackMessageRevealed(messageId);

        setTimeout(() => {
          setState('unfolded');
        }, prefersReducedMotion ? 100 : 400);
      }, prefersReducedMotion ? 100 : 600);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Послание на 2026',
          text: selectedMessage,
        });
        trackShareMessage('webShare');
      } catch (err) {
        // Пользователь отменил
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        trackShareMessage('copyLink');
        alert('Ссылка скопирована!');
      } catch {
        alert('Поделиться не удалось.');
      }
    }
  };

  return (
    <section
      data-screen="5"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-20 pt-16 md:pt-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-8 text-gray-900"
        >
          {screenContent.h2}
        </motion.h2>

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {state === 'closed' && (
              <motion.button
                key="closed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4 cursor-pointer group"
                onClick={handleOpen}
              >
                <div className="relative w-48 h-48 md:w-56 md:h-56 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                  {/* Конфета эмоджи */}
                  <motion.div
                    animate={{
                      y: [0, -6, 0],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <span className="text-9xl md:text-[12rem]">🍬</span>
                  </motion.div>
                </div>
                <p className="text-gray-500 text-sm">{screenContent.hint}</p>
              </motion.button>
            )}

            {state === 'opening' && (
              <motion.div
                key="opening"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  scale: { duration: 0.8, repeat: Infinity },
                  rotate: { duration: 0.6, repeat: Infinity },
                }}
                exit={{ opacity: 0 }}
                className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center"
              >
                {/* Конфета эмоджи с анимацией открытия */}
                  <motion.div
                    initial={{ scale: 1, rotate: 0 }}
                    animate={{ 
                    scale: [1, 1.2, 1.1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 0.8 }}
                  className="flex items-center justify-center"
                >
                  <span className="text-9xl md:text-[12rem]">🍬</span>
                </motion.div>
              </motion.div>
            )}

            {state === 'open' && (
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0 }}
                className="relative w-64 h-64 md:w-80 md:h-80"
              >
                {/* Смятая бумажка с посланием */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 150,
                    damping: 12,
                    delay: 0.2 
                  }}
                  className="relative w-full h-full"
                >
                  {/* Основная бумажка */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-lg shadow-2xl border-2 border-amber-200/50"
                    style={{
                      transform: 'rotate(-2deg) scale(0.95)',
                      clipPath: 'polygon(5% 0%, 100% 3%, 98% 95%, 0% 100%)',
                    }}
                  >
                    {/* Складки и морщины */}
                    <div className="absolute top-1/4 left-0 right-0 h-1 bg-amber-200/40 transform rotate-12"></div>
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-amber-200/40 transform -rotate-6"></div>
                    <div className="absolute top-3/4 left-0 right-0 h-1 bg-amber-200/40 transform rotate-8"></div>
                    <div className="absolute top-0 left-1/4 bottom-0 w-1 bg-amber-200/40 transform rotate-12"></div>
                    <div className="absolute top-0 left-3/4 bottom-0 w-1 bg-amber-200/40 transform -rotate-6"></div>
                    
                    {/* Тень от складок */}
                    <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-amber-200/20 rounded-full blur-xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-amber-200/20 rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Вторая бумажка (для объема) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 rounded-lg shadow-xl border border-amber-300/30"
                    style={{
                      transform: 'rotate(1deg) scale(0.98) translateY(4px)',
                      clipPath: 'polygon(3% 2%, 98% 0%, 100% 98%, 2% 100%)',
                    }}
                  ></div>
                  
                  {/* Третья бумажка (задний план) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-300 rounded-lg shadow-lg"
                    style={{
                      transform: 'rotate(-1deg) scale(0.96) translateY(8px)',
                      clipPath: 'polygon(0% 5%, 95% 2%, 98% 95%, 5% 100%)',
                    }}
                  ></div>
                </motion.div>
              </motion.div>
            )}

            {state === 'unfolded' && (
              <motion.div
                key="unfolded"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: prefersReducedMotion ? 0.1 : 0.5,
                  type: "spring",
                  stiffness: 100,
                }}
                className="relative max-w-lg w-full"
              >
                {/* Развернутая смятая бумажка */}
                <div className="relative w-full min-h-[300px] md:min-h-[400px]">
                  {/* Третья бумажка (задний план) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-yellow-200 to-amber-300 rounded-lg shadow-lg z-0"
                    style={{
                      transform: 'rotate(-1deg) scale(0.96) translateY(8px)',
                      clipPath: 'polygon(0% 2%, 97% 0%, 98% 98%, 2% 100%)',
                    }}
                  ></div>
                  
                  {/* Вторая бумажка (для объема) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 rounded-lg shadow-xl border border-amber-300/30 z-10"
                    style={{
                      transform: 'rotate(1deg) scale(0.98) translateY(4px)',
                      clipPath: 'polygon(1% 0%, 98% 1%, 99% 98%, 0% 99%)',
                    }}
                  ></div>
                  
                  {/* Основная бумажка (развернутая) */}
                  <motion.div
                    initial={{ rotate: -2, scale: 0.95 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 rounded-lg shadow-2xl border-2 border-amber-200/50 p-6 md:p-10 z-20 flex items-center justify-center"
                    style={{
                      clipPath: 'polygon(2% 1%, 99% 2%, 98% 97%, 1% 99%)',
                    }}
                  >
                    {/* Текст послания */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="relative z-10 text-xl md:text-3xl text-amber-950 leading-relaxed font-handwriting text-center font-medium"
                    >
                      {(() => {
                        const firstDotIndex = selectedMessage.indexOf('.');
                        if (firstDotIndex === -1) return <p>{selectedMessage}</p>;
                        const firstSentence = selectedMessage.slice(0, firstDotIndex + 1);
                        const rest = selectedMessage.slice(firstDotIndex + 1).trim();
                        return (
                          <>
                            <p>{firstSentence}</p>
                            {rest && <p className="mt-4 md:mt-6">{rest}</p>}
                          </>
                        );
                      })()}
                    </motion.div>
                  </motion.div>
                </div>

                {/* Кнопка действия */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center mt-8 relative z-20"
                >
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-800 to-cyan-400 text-white rounded-lg hover:from-blue-700 hover:to-cyan-300 transition-all font-medium text-sm shadow-lg"
                  >
                    <Share2 className="w-4 h-4" />
                    {screenContent.buttons.share}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

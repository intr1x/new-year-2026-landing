'use client';

import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';
import {
  trackMessageRevealed,
  trackShareMessage,
} from '@/lib/analytics';

type ScratchState = 'idle' | 'scratching' | 'revealed';

interface Screen4Props {
  onNext?: () => void;
}

export default function Screen4_CandyReveal({ onNext }: Screen4Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const screenContent = content.screens.s4;
  const [state, setState] = useState<ScratchState>('idle');
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressCheckCounter = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    if (screenContent.messages.length > 0 && !selectedMessage) {
      const randomMessage = screenContent.messages[Math.floor(Math.random() * screenContent.messages.length)];
      setSelectedMessage(randomMessage);
    }
  }, [screenContent.messages, selectedMessage]);

  useLayoutEffect(() => {
    if (!isMounted) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinType: 'transform',
        scrub: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMounted]);

  const initCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (typeof document !== 'undefined' && 'fonts' in document) {
      await document.fonts.ready;
    }

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, '#ADB5BD');
      gradient.addColorStop(0.2, '#CED4DA');
      gradient.addColorStop(0.5, '#DEE2E6');
      gradient.addColorStop(0.8, '#CED4DA');
      gradient.addColorStop(1, '#6C757D');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1, 1);
      }

      const text = 'Сотри, чтобы получить';
      let fontSize = 44;
      ctx.font = `${fontSize}px Caveat, cursive`;
      
      while (ctx.measureText(text).width > rect.width * 0.9 && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `${fontSize}px Caveat, cursive`;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, rect.width / 2, rect.height / 2);
      
      ctx.globalCompositeOperation = 'destination-out';
    }
  }, []);

  useEffect(() => {
    if (isMounted) initCanvas();
  }, [isMounted, initCanvas]);

  const drawScratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    progressCheckCounter.current++;
    if (progressCheckCounter.current % 15 === 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparent++;
      }
      const progress = (transparent / (pixels.length / 4)) * 100;
      setScratchProgress(progress);
      if (progress > 45 && state !== 'revealed') {
        setState('revealed');
        trackMessageRevealed(screenContent.messages.indexOf(selectedMessage));
      }
    }
  }, [selectedMessage, screenContent.messages, state]);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing || state === 'revealed') return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      if (x >= -20 && x <= rect.width + 20 && y >= -20 && y <= rect.height + 20) {
        if (state === 'idle') {
          setState('scratching');
        }
        drawScratch(x, y);
      }
    }
  }, [isDrawing, state, drawScratch]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', () => setIsDrawing(false));
    window.addEventListener('touchend', () => setIsDrawing(false));
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', () => setIsDrawing(false));
      window.removeEventListener('touchend', () => setIsDrawing(false));
    };
  }, [handleMove]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Послание 2026', text: selectedMessage });
        trackShareMessage('webShare');
      } catch {}
    } else {
      await navigator.clipboard.writeText(selectedMessage);
      alert('Послание скопировано!');
    }
  };

  if (!isMounted) return null;

  const getFontSizeClass = (text: string) => {
    const len = text.length;
    if (len > 250) return 'text-xl md:text-2xl lg:text-3xl';
    if (len > 180) return 'text-2xl md:text-3xl lg:text-4xl';
    if (len > 120) return 'text-3xl md:text-4xl lg:text-5xl';
    return 'text-4xl md:text-5xl lg:text-6xl';
  };

  return (
    <div data-screen="4">
      <section 
        ref={sectionRef}
        className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden bg-white"
      >
        <div className="relative z-10 max-w-7xl w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          
          {/* Левая колонка: Заголовок и кнопка перехода */}
          <div className="flex-1 max-w-xl text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-[72px] font-display font-bold mb-8 md:mb-12 text-gray-900 leading-[1.1] whitespace-pre-line"
            >
              {screenContent.h2}
            </motion.h2>

            <AnimatePresence>
              {state === 'revealed' && onNext && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hidden lg:block mt-8"
                >
                  <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full hover:bg-brand-dark transition-all text-lg font-bold shadow-2xl shadow-brand-blue/20 hover:scale-105 active:scale-95"
                  >
                    Вперёд в 2026
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Правая колонка: Послание (скретч-карта) */}
          <div className="flex-[1.5] w-full max-w-2xl flex flex-col items-center">
            <div 
              ref={containerRef}
              onMouseDown={() => setIsDrawing(true)}
              onTouchStart={() => setIsDrawing(true)}
              className="relative w-full aspect-[16/10] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-8 border-white cursor-crosshair"
            >
              {/* Текст послания */}
              <div className="absolute inset-0 flex items-center justify-center px-8 py-10 md:px-12 bg-white">
                <p className={`${getFontSizeClass(selectedMessage)} text-gray-900 font-handwriting text-left leading-tight w-full`}>
                  {selectedMessage || '...'}
                </p>
              </div>

              {/* Серебристое напыление */}
              <AnimatePresence>
                {state !== 'revealed' && (
                  <motion.canvas
                    ref={canvasRef}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 z-20 touch-none"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Инструкция или кнопка Share */}
            <div className="mt-8 h-12 flex items-center justify-center w-full">
              <AnimatePresence mode="wait">
                {state !== 'revealed' ? (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-gray-400 font-medium text-center animate-pulse"
                  >
                    Просто нажми и сотри пальцем или курсором
                  </motion.p>
                ) : (
                  <motion.div
                    key="actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-600 border border-gray-100 rounded-full font-bold shadow-sm hover:bg-gray-50 transition-all text-sm"
                    >
                      <Share2 size={16} />
                      {screenContent.buttons.share}
                    </button>
                    
                    {/* Кнопка "Next" для мобильных */}
                    {onNext && (
                      <button
                        onClick={onNext}
                        className="lg:hidden flex items-center gap-2 px-8 py-4 bg-brand-blue text-white rounded-full font-bold shadow-lg text-lg"
                      >
                        Вперёд в 2026
                        <ArrowRight size={20} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          </div>
        </div>
      </section>
    </div>
  );
}

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

    // Используем clientWidth/Height, так как они возвращают размер внутренней области (без границ)
    // и не зависят от CSS-трансформаций (scale), в отличие от getBoundingClientRect
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Принудительно задаем CSS-размеры, чтобы они точно совпадали с внутренней областью контейнера
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
      
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#ADB5BD');
      gradient.addColorStop(0.2, '#CED4DA');
      gradient.addColorStop(0.5, '#DEE2E6');
      gradient.addColorStop(0.8, '#CED4DA');
      gradient.addColorStop(1, '#6C757D');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 2000; i++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
        ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
      }

      const text = 'Сотри, чтобы получить';
      let fontSize = 44;
      ctx.font = `${fontSize}px Caveat, cursive`;
      
      while (ctx.measureText(text).width > width * 0.9 && fontSize > 20) {
        fontSize -= 2;
        ctx.font = `${fontSize}px Caveat, cursive`;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Используем точный центр
      ctx.fillText(text, width / 2, height / 2);
      
      ctx.globalCompositeOperation = 'destination-out';
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    initCanvas();

    const observer = new ResizeObserver(() => {
      if (state === 'idle') {
        initCanvas();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isMounted, initCanvas, state]);

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

    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      if (x >= -40 && x <= rect.width + 40 && y >= -40 && y <= rect.height + 40) {
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
    <div data-screen="5">
      <section 
        ref={sectionRef}
        className="h-screen flex flex-col items-center justify-center px-4 py-8 md:py-16 relative overflow-hidden bg-white"
      >
        {/* Фоновые декоративные элементы */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2, delay: 0.6 }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-brand-light/10 rounded-full blur-3xl" 
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-7xl w-full"
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          
          {/* Левая колонка: Заголовок и кнопка перехода */}
          <div className="flex-1 max-w-xl text-left">
            <h2 className="text-3xl md:text-5xl lg:text-[72px] font-display font-bold mb-8 md:mb-12 text-gray-900 leading-[1.1] whitespace-pre-line">
              {screenContent.h2}
            </h2>

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
              className="relative w-full aspect-[16/10] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden cursor-crosshair"
            >
              {/* Текст послания */}
              <div className="absolute inset-8 flex items-center justify-center bg-white">
                <p className={`${getFontSizeClass(selectedMessage)} text-gray-900 font-handwriting text-left leading-tight w-full`}>
                  {selectedMessage || '...'}
                </p>
              </div>

              {/* Серебристое напыление */}
              <AnimatePresence>
                {state !== 'revealed' && (
                  <motion.canvas
                    ref={canvasRef}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute top-0 left-0 z-20 touch-none"
                    style={{ 
                      // Гарантируем, что canvas занимает всю внутреннюю площадь
                      width: '100%',
                      height: '100%',
                      display: 'block'
                    }}
                  />
                )}
              </AnimatePresence>
              
              {/* Декоративная рамка поверх всего */}
              <div className="absolute inset-0 border-[12px] border-white rounded-[40px] pointer-events-none z-30" />
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
        </motion.div>
      </section>
    </div>
  );
}

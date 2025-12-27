'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2 } from 'lucide-react';
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

  // Инициализация холста (серебристое напыление с текстом)
  const initCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Ждем загрузки шрифтов, чтобы Caveat применился к холсту
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
      
      // Создаем эффект серебристого металла
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

      // Автоподбор размера шрифта для подсказки, чтобы она точно влезла
      const text = 'Сотри, чтобы узнать';
      let fontSize = 44; // Оптимальный размер
      ctx.font = `${fontSize}px Caveat, cursive`;
      
      // Если текст шире 90% карточки, уменьшаем его
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

    // Увеличиваем кисть для стирания курсором
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
      
      // Стираем
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
    if (len > 250) return 'text-lg md:text-xl';
    if (len > 180) return 'text-xl md:text-2xl';
    if (len > 120) return 'text-2xl md:text-3xl';
    return 'text-3xl md:text-5xl';
  };

  return (
    <section data-screen="4" className="h-screen flex flex-col items-center justify-center px-4 pt-16 md:pt-20 relative overflow-hidden bg-slate-50">
      <div className="max-w-2xl w-full text-center z-10 flex flex-col items-center">
        <motion.h2 className="text-2xl md:text-5xl font-bold mb-6 md:mb-12 text-slate-900 font-display">
          {screenContent.h2}
        </motion.h2>

        <div className="relative flex flex-col items-center w-full">
          {/* Бумажка (Карточка) */}
          <div 
            ref={containerRef}
            onMouseDown={() => setIsDrawing(true)}
            onTouchStart={() => setIsDrawing(true)}
            className="relative w-full max-w-md aspect-[4/3] bg-white rounded-xl shadow-2xl overflow-hidden border-4 md:border-8 border-white"
          >
            {/* Текст послания (под напылением) */}
            <div className="absolute inset-0 flex items-center justify-center px-8 py-12 md:px-12 md:py-16 bg-white">
              <p className={`${getFontSizeClass(selectedMessage)} text-black font-handwriting text-left leading-tight w-full`}>
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

          {/* Инструкция (вместо монетки) */}
          <AnimatePresence>
            {state !== 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-8 text-slate-400 font-medium text-center"
              >
                <p className="animate-pulse">Просто нажми и сотри пальцем или курсором</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка Share и Next */}
          <AnimatePresence>
            {state === 'revealed' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex flex-col md:flex-row gap-4"
              >
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-all"
                >
                  <Share2 size={20} />
                  {screenContent.buttons.share}
                </button>

                {onNext && (
                  <button
                    onClick={onNext}
                    className="flex items-center justify-center gap-2 px-12 py-4 bg-gradient-to-r from-brand-blue to-brand-light text-white rounded-full font-bold shadow-lg hover:from-brand-dark hover:to-brand-blue transition-all shadow-brand-blue/25"
                  >
                    Вперёд в 2026
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

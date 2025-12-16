'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Copy, Share2, MessageCircle } from 'lucide-react';
import content from '@/content/landing.ru.json';
import {
  trackCandyOpen,
  trackMessageRevealed,
  trackCopyMessage,
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedMessage);
      trackCopyMessage(true);
      alert('Послание скопировано!');
    } catch (err) {
      trackCopyMessage(false);
      const textArea = document.createElement('textarea');
      textArea.value = selectedMessage;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        trackCopyMessage(true);
        alert('Послание скопировано!');
      } catch {
        trackCopyMessage(false);
        alert('Не удалось скопировать. Скопируйте вручную.');
      }
      document.body.removeChild(textArea);
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

  const handleContact = () => {
    window.open('https://wa.me/1234567890', '_blank');
  };

  return (
    <section
      data-screen="5"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 pt-32 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-8 text-gray-900"
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
                <div className="w-32 h-32 rounded-2xl bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                  <Gift className="w-16 h-16 text-white" />
                </div>
                <p className="text-gray-500 text-sm">{screenContent.hint}</p>
              </motion.button>
            )}

            {state === 'opening' && (
              <motion.div
                key="opening"
                initial={{ opacity: 0, rotate: -5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1.05 }}
                exit={{ opacity: 0 }}
                className="w-32 h-32 rounded-2xl bg-gray-900 flex items-center justify-center"
              >
                <Gift className="w-16 h-16 text-white animate-pulse" />
              </motion.div>
            )}

            {state === 'open' && (
              <motion.div
                key="open"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center"
              >
                <div className="w-12 h-16 bg-white rounded shadow-sm" />
              </motion.div>
            )}

            {state === 'unfolded' && (
              <motion.div
                key="unfolded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.1 : 0.4 }}
                className="bg-white p-8 md:p-10 rounded-2xl border border-gray-200 shadow-sm max-w-lg w-full"
              >
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8 font-handwriting">
                  «{selectedMessage}»
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                    aria-label="Скопировать послание"
                  >
                    <Copy className="w-4 h-4" />
                    {screenContent.buttons.copy}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    {screenContent.buttons.share}
                  </button>
                  <button
                    onClick={handleContact}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {screenContent.buttons.contact}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

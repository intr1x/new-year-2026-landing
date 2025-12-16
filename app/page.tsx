'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProgressDots from '@/components/ProgressDots';
import Screen1_Context from '@/components/Screen1_Context';
import Screen2_TeamFloat from '@/components/Screen2_TeamFloat';
import Screen3_Commitment from '@/components/Screen3_Commitment';
import Screen4_GameCrisis from '@/components/Screen4_GameCrisis';
import Screen5_CandyReveal from '@/components/Screen5_CandyReveal';
import { trackScreenView } from '@/lib/analytics';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const screens = document.querySelectorAll('[data-screen]');
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY + viewportHeight * 0.6;

      screens.forEach((screen, index) => {
        const rect = screen.getBoundingClientRect();
        const screenTop = rect.top + window.scrollY;
        const screenBottom = screenTop + rect.height;

        if (scrollPosition >= screenTop && scrollPosition < screenBottom) {
          const screenNumber = index + 1;
          if (activeScreen !== screenNumber) {
            setActiveScreen(screenNumber);
            trackScreenView(screenNumber);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeScreen, isMounted]);

  const scrollToScreen = (screenNumber: number) => {
    const screen = document.querySelector(`[data-screen="${screenNumber}"]`);
    if (screen) {
      screen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="relative">
      <Header onOpenGift={() => scrollToScreen(5)} />
      <ProgressDots
        activeScreen={activeScreen}
        onScreenClick={scrollToScreen}
      />
      <Screen1_Context onNext={() => scrollToScreen(2)} />
      <Screen2_TeamFloat />
      <Screen3_Commitment onNext={() => scrollToScreen(4)} />
      <Screen4_GameCrisis onNext={() => scrollToScreen(5)} />
      <Screen5_CandyReveal />
    </main>
  );
}


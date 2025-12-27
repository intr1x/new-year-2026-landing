'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ProgressDots from '@/components/ProgressDots';
import Screen1_Context from '@/components/Screen1_Context';
import Screen2_TeamFloat from '@/components/Screen2_TeamFloat';
import Screen3_Commitment from '@/components/Screen3_Commitment';
import Screen4_CandyReveal from '@/components/Screen4_CandyReveal';
import Screen5_Horse from '@/components/Screen5_Horse';
import { trackScreenView } from '@/lib/analytics';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState(1);

  useEffect(() => {
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
  }, [activeScreen]);

  const scrollToScreen = (screenNumber: number) => {
    const screen = document.querySelector(`[data-screen="${screenNumber}"]`);
    if (screen) {
      screen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="relative">
      <Header onOpenGift={() => scrollToScreen(4)} />
      <ProgressDots
        activeScreen={activeScreen}
        onScreenClick={scrollToScreen}
      />
      <Screen1_Context onNext={() => scrollToScreen(2)} />
      <Screen2_TeamFloat />
      <Screen3_Commitment onNext={() => scrollToScreen(4)} />
      <Screen4_CandyReveal onNext={() => scrollToScreen(5)} />
      <Screen5_Horse />
    </main>
  );
}


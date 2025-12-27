'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Header from '@/components/Header';
import ProgressDots from '@/components/ProgressDots';
import Screen1_Context from '@/components/Screen1_Context';
import Screen2_TeamFloat from '@/components/Screen2_TeamFloat';
import Screen3_Commitment from '@/components/Screen3_Commitment';
import Screen4_CandyReveal from '@/components/Screen4_CandyReveal';
import Screen5_Horse from '@/components/Screen5_Horse';
import { SmoothScroll } from '@/components/SmoothScroll';
import { trackScreenView } from '@/lib/analytics';

export default function Home() {
  const [activeScreen, setActiveScreen] = useState(1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const screens = gsap.utils.toArray('[data-screen]');
    
    screens.forEach((screen: any, index: number) => {
      ScrollTrigger.create({
        trigger: screen,
        start: 'top 60%',
        end: 'bottom 60%',
        onToggle: (self) => {
          if (self.isActive) {
            const screenNumber = index + 1;
            setActiveScreen(screenNumber);
            trackScreenView(screenNumber);
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const scrollToScreen = (screenNumber: number) => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(`[data-screen="${screenNumber}"]`, true, 'start top');
    } else {
      const screen = document.querySelector(`[data-screen="${screenNumber}"]`);
      if (screen) {
        screen.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <Header onOpenGift={() => scrollToScreen(4)} />
      <ProgressDots
        activeScreen={activeScreen}
        onScreenClick={scrollToScreen}
      />
      <SmoothScroll>
        <main className="relative">
          <Screen1_Context onNext={() => scrollToScreen(2)} />
          <Screen2_TeamFloat />
          <Screen3_Commitment onNext={() => scrollToScreen(4)} />
          <Screen4_CandyReveal onNext={() => scrollToScreen(5)} />
          <Screen5_Horse />
        </main>
      </SmoothScroll>
    </>
  );
}


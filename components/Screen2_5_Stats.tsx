'use client';

import { useLayoutEffect, useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import content from '@/content/landing.ru.json';

interface Stat {
  label: string;
  value: number;
}

function StatPill({ stat }: { stat: Stat }) {
  return (
    <div className="flex-shrink-0 bg-white/5 border border-white/10 backdrop-blur-sm rounded-full px-6 py-4 md:px-10 md:py-6 flex items-center gap-3 md:gap-4 mx-2 md:mx-3">
      <span className="text-2xl md:text-4xl font-display font-bold text-white whitespace-nowrap">
        {stat.value.toLocaleString('ru-RU')}
      </span>
      <span className="text-sm md:text-lg text-gray-400 font-medium whitespace-nowrap">
        {stat.label}
      </span>
    </div>
  );
}

function MarqueeRow({ stats, direction = 'left', speed = 50 }: { stats: Stat[], direction?: 'left' | 'right', speed?: number }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const totalWidth = row.scrollWidth / 3;
    const duration = totalWidth / speed;

    if (direction === 'left') {
      gsap.set(row, { x: 0 });
    } else {
      gsap.set(row, { x: -totalWidth });
    }

    const anim = gsap.to(row, {
      x: direction === 'left' ? -totalWidth : 0,
      duration: duration,
      ease: 'none',
      repeat: -1,
    });

    const st = ScrollTrigger.create({
      trigger: row,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity() / 1000);
        gsap.to(anim, { timeScale: 1 + velocity, duration: 0.5 });
      }
    });

    return () => {
      anim.kill();
      st.kill();
    };
  }, [direction, speed]);

  const displayStats = [...stats, ...stats, ...stats];

  return (
    <div className="w-full overflow-hidden py-1 md:py-2">
      <div ref={rowRef} className="flex whitespace-nowrap w-max">
        {displayStats.map((stat, i) => (
          <StatPill key={i} stat={stat} />
        ))}
      </div>
    </div>
  );
}

export default function Screen2_5_Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsContent = content.screens.s2_5;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isMounted) return;

    const ctx = gsap.context(() => {
      // Pinning the section
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinType: 'transform',
        scrub: 1,
      });

      // Entrance animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      });

      tl.fromTo('.stats-title', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      )
      .fromTo('.marquee-row-container',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out' },
        '-=0.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMounted]);

  if (!isMounted) return null;

  const row1 = statsContent.stats.slice(0, 3);
  const row2 = statsContent.stats.slice(3, 6);
  const row3 = statsContent.stats.slice(6, 9);

  return (
    <div data-screen="3" className="relative">
      <section
        ref={sectionRef}
        className="h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gray-900"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#F9F7F2] to-transparent opacity-20" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#EC4899]/20 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 w-full flex flex-col items-center justify-center"
        >
          <div className="max-w-6xl mx-auto px-4 mb-8 md:mb-12 stats-title opacity-0">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-center text-white leading-tight">
              {statsContent.h2}
            </h2>
          </div>

          <div className="flex flex-col gap-1 md:gap-2 w-full">
            <div className="marquee-row-container opacity-0">
              <MarqueeRow stats={row1} direction="left" speed={20} />
            </div>
            <div className="marquee-row-container opacity-0">
              <MarqueeRow stats={row2} direction="right" speed={25} />
            </div>
            <div className="marquee-row-container opacity-0">
              <MarqueeRow stats={row3} direction="left" speed={22} />
            </div>
          </div>
        </motion.div>
      </section>
      
      <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200/50 z-20" />
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface GSAPThankYouTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function GSAPThankYouText({ 
  text, 
  className = '', 
  delay = 0.3
}: GSAPThankYouTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isInView) return;

    const container = containerRef.current;
    const words = text.split(' ');
    
    container.innerHTML = '';
    
    // Создаем структуру: слова и буквы
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'inline-block mr-3 md:mr-6';
      
      const chars = word.split('');
      chars.forEach((char, charIndex) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.className = 'inline-block relative';
        charSpan.style.opacity = '0';
        charSpan.style.transformOrigin = 'center center';
        
        wordSpan.appendChild(charSpan);
      });
      
      container.appendChild(wordSpan);
    });

    const chars = container.querySelectorAll('span span');
    
    // Создаем timeline для последовательной анимации
    const tl = gsap.timeline({ delay });

    // 1. Основная анимация появления букв с вращением и масштабированием
    tl.from(chars, {
      opacity: 0,
      scale: 0,
      rotation: () => gsap.utils.random(-180, 180),
      y: () => gsap.utils.random(-100, 100),
      x: () => gsap.utils.random(-50, 50),
      duration: 1.2,
      stagger: {
        amount: 0.8,
        from: 'random',
        ease: 'power2.out'
      },
      ease: 'back.out(2)',
    });

    // 2. Волновое покачивание после появления
    tl.to(chars, {
      y: -15,
      duration: 0.4,
      stagger: {
        amount: 0.3,
        from: 'start',
        ease: 'sine.inOut'
      },
      ease: 'sine.inOut'
    }, '-=0.3');

    tl.to(chars, {
      y: 0,
      duration: 0.5,
      stagger: {
        amount: 0.3,
        from: 'start',
        ease: 'sine.inOut'
      },
      ease: 'elastic.out(1, 0.4)'
    });

    // 3. Добавляем тонкую пульсацию для живости
    tl.to(chars, {
      scale: 1.05,
      duration: 0.6,
      stagger: {
        amount: 0.4,
        from: 'center',
        repeat: 1,
        yoyo: true
      },
      ease: 'sine.inOut'
    }, '-=0.2');

    // 4. Создаем эффект светового блика
    tl.to(chars, {
      color: '#60A5FA',
      textShadow: '0 0 20px rgba(96, 165, 250, 0.8), 0 0 40px rgba(96, 165, 250, 0.4)',
      duration: 0.15,
      stagger: {
        amount: 0.6,
        from: 'start'
      },
      ease: 'power2.inOut'
    }, '-=0.3');

    tl.to(chars, {
      color: 'inherit',
      textShadow: '0 0 0px rgba(96, 165, 250, 0)',
      duration: 0.15,
      stagger: {
        amount: 0.6,
        from: 'start'
      },
      ease: 'power2.inOut'
    }, '-=0.45');

    // 5. Финальное небольшое подрагивание
    tl.to(chars, {
      rotation: () => gsap.utils.random(-2, 2),
      y: () => gsap.utils.random(-3, 3),
      duration: 0.2,
      stagger: 0.02,
      ease: 'power1.inOut'
    });

    tl.to(chars, {
      rotation: 0,
      y: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.6)'
    });

    // Добавляем бесконечную тонкую анимацию дыхания
    gsap.to(chars, {
      scale: 1.02,
      duration: 2,
      stagger: {
        amount: 0.5,
        from: 'random',
        repeat: -1,
        yoyo: true
      },
      ease: 'sine.inOut',
      delay: delay + 3
    });

  }, [text, delay, isInView]);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }} 
    />
  );
}


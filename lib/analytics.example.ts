// Пример подключения GA4 или Яндекс.Метрики
// Скопируйте этот файл в analytics.ts и раскомментируйте нужный вариант

// ===== ВАРИАНТ 1: Google Analytics 4 =====
/*
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

function sendEvent(event: { name: string; params?: Record<string, string | number> }) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.name, event.params || {});
  }
}
*/

// ===== ВАРИАНТ 2: Яндекс.Метрика =====
/*
declare global {
  interface Window {
    ym?: (id: number, method: string, target: string, params?: Record<string, unknown>) => void;
  }
}

const YANDEX_METRICA_ID = 12345678; // Замените на ваш ID

function sendEvent(event: { name: string; params?: Record<string, string | number> }) {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YANDEX_METRICA_ID, 'reachGoal', event.name, event.params || {});
  }
}
*/

// ===== ВАРИАНТ 3: Amplitude =====
/*
import * as amplitude from '@amplitude/analytics-browser';

amplitude.init('YOUR_API_KEY');

function sendEvent(event: { name: string; params?: Record<string, string | number> }) {
  amplitude.track(event.name, event.params || {});
}
*/

export {};


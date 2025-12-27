// Простой слой аналитики для событий
// Можно подключить GA4, Яндекс.Метрику и т.д.

interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number>;
}

function sendEvent(event: AnalyticsEvent) {
  // В продакшене здесь будет отправка в GA4/Я.Метрику
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }

  // Пример для GA4:
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event.name, event.params);
  // }
}

export function trackScreenView(screenNumber: number) {
  sendEvent({
    name: `view_screen_${screenNumber}`,
  });
}

export function trackClick(eventName: string, params?: Record<string, string | number>) {
  sendEvent({
    name: `click_${eventName}`,
    params,
  });
}

export function trackGameHit(letter: string, hitIndex: number) {
  sendEvent({
    name: 'game_hit_letter',
    params: { letter, hitIndex },
  });
}

export function trackGameComplete() {
  sendEvent({
    name: 'game_complete',
  });
}

export function trackGameRetry() {
  sendEvent({
    name: 'game_retry',
  });
}

export function trackGameSkip() {
  sendEvent({
    name: 'game_skip',
  });
}

export function trackCoinScratch() {
  sendEvent({
    name: 'coin_scratch',
  });
}

export function trackMessageRevealed(messageId: number) {
  sendEvent({
    name: 'message_revealed',
    params: { messageId },
  });
}

export function trackCopyMessage(success: boolean) {
  sendEvent({
    name: 'copy_message',
    params: { success: success ? 'success' : 'fail' },
  });
}

export function trackShareMessage(method: string) {
  sendEvent({
    name: 'share_message',
    params: { method },
  });
}

export function trackTogglePauseTeamPhotos(isPaused: boolean) {
  sendEvent({
    name: 'toggle_pause_team_photos',
    params: { state: isPaused ? 'on' : 'off' },
  });
}


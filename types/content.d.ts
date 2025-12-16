// Типы для контента лендинга
export interface LandingContent {
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };
  header: {
    label: string;
    ctaToGift: string;
  };
  screens: {
    s1: {
      h1: string;
      sub: string;
      bullets: string[];
      cta: string;
    };
    s2: {
      h2: string;
      text: string;
      points: string[];
      pause: string;
    };
    s3: {
      h2: string;
      text: string;
      principles: string[];
      cta: string;
    };
    s4: {
      h2: string;
      word: string;
      resultWord: string;
      subtitleAfterWin: string;
      buttons: {
        retry: string;
        next: string;
        skip: string;
      };
    };
    s5: {
      h2: string;
      hint: string;
      messages: string[];
      buttons: {
        copy: string;
        share: string;
        contact: string;
      };
    };
  };
}


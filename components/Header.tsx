'use client';

import { Gift, Sparkles } from 'lucide-react';
import { trackClick } from '@/lib/analytics';
import content from '@/content/landing.ru.json';

interface HeaderProps {
  onOpenGift: () => void;
}

export default function Header({ onOpenGift }: HeaderProps) {
  const handleOpenGift = () => {
    trackClick('header_open_gift');
    onOpenGift();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-display font-semibold text-gray-900">
            {content.header.label}
          </span>
        </div>
        <button
          onClick={handleOpenGift}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-cyan-400 text-white rounded-lg hover:from-blue-700 hover:to-cyan-300 transition-all text-sm font-medium"
          aria-label="Открыть послание"
        >
          <Gift className="w-4 h-4" />
          {content.header.ctaToGift}
        </button>
      </div>
    </header>
  );
}

'use client';

interface ProgressDotsProps {
  activeScreen: number;
  onScreenClick: (screenNumber: number) => void;
}

export default function ProgressDots({
  activeScreen,
  onScreenClick,
}: ProgressDotsProps) {
  const screens = [1, 2, 3, 4, 5];

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
      aria-label="Навигация по экранам"
    >
      {screens.map((screen) => (
        <button
          key={screen}
          onClick={() => onScreenClick(screen)}
          className={`w-3 h-3 rounded-full transition-all ${
            activeScreen === screen
              ? 'bg-brand-blue scale-125'
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`Перейти к экрану ${screen}`}
          aria-current={activeScreen === screen ? 'step' : undefined}
        />
      ))}
    </nav>
  );
}


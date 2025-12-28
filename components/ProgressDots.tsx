'use client';

interface ProgressDotsProps {
  activeScreen: number;
  onScreenClick: (screenNumber: number) => void;
}

export default function ProgressDots({
  activeScreen,
  onScreenClick,
}: ProgressDotsProps) {
  const screens = [1, 2, 3, 4, 5, 6];

  return (
    <nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
      aria-label="Навигация по экранам"
    >
      {screens.map((screen) => (
        <button
          key={screen}
          onClick={() => onScreenClick(screen)}
          className={`w-3 h-3 rounded-full transition-all duration-500 ${
            activeScreen === screen
              ? 'bg-brand-blue scale-150 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              : [1, 3, 6].includes(activeScreen)
                ? 'bg-white/30 hover:bg-white/60' 
                : 'bg-gray-400 hover:bg-gray-600'
          }`}
          aria-label={`Перейти к экрану ${screen}`}
          aria-current={activeScreen === screen ? 'step' : undefined}
        />
      ))}
    </nav>
  );
}


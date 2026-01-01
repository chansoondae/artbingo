'use client';

import { useEffect, useState } from 'react';

interface HorseAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export default function HorseAnimation({ trigger, onComplete }: HorseAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <div className="animate-horseRun">
        <div className="text-8xl filter drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]">
          🐴
        </div>
        {/* Fire trail effect */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-transparent via-[#E63946]/50 to-transparent blur-xl" />
      </div>
    </div>
  );
}

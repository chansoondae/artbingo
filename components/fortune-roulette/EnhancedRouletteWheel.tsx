'use client';

import { useState, useEffect, useRef } from 'react';
import { Artist } from '@/lib/artists';

interface EnhancedRouletteWheelProps {
  artists: Artist[];
  rotation: number;
  duration: number;
  isSpinning: boolean;
  phase: 'idle' | 'spinning' | 'slowing' | 'stopping' | 'result';
  onTick?: () => void;
}

export default function EnhancedRouletteWheel({
  artists,
  rotation,
  duration,
  isSpinning,
  phase,
  onTick,
}: EnhancedRouletteWheelProps) {
  const sectionAngle = 360 / artists.length;
  const [currentRotation, setCurrentRotation] = useState(0);
  const lastSectionRef = useRef(-1);

  // 작가 순서 출력
  useEffect(() => {
    if (artists.length > 0) {
      console.log('🎨 룰렛 작가 순서 (시계방향, 12시 방향부터):');
      artists.forEach((artist, index) => {
        const angle = index * sectionAngle;
        console.log(`${index}: ${artist.koreanName} (각도: ${angle}°)`);
      });
    }
  }, [artists, sectionAngle]);

  useEffect(() => {
    if (!isSpinning) {
      setCurrentRotation(0);
      lastSectionRef.current = -1;
      return;
    }

    const startTime = Date.now();
    const startRotation = currentRotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Custom easing for suspenseful ending
      let easedProgress;
      if (progress < 0.1) {
        // Quick acceleration
        easedProgress = progress * 5;
      } else if (progress < 0.5) {
        // Maintain speed
        easedProgress = 0.5 + (progress - 0.1) * 1.25;
      } else if (progress < 0.8) {
        // First deceleration
        easedProgress = 1 - Math.pow(1 - progress, 2) * 0.2;
      } else {
        // Suspenseful slow ending
        easedProgress = 1 - Math.pow(1 - progress, 4) * 0.05;
      }

      const newRotation = startRotation + rotation * easedProgress;
      setCurrentRotation(newRotation);

      // Tick sound trigger
      if (phase === 'slowing' || phase === 'stopping') {
        const currentSection = Math.floor((newRotation % 360) / sectionAngle);
        if (currentSection !== lastSectionRef.current) {
          lastSectionRef.current = currentSection;
          if (onTick) onTick();
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [rotation, duration, isSpinning, phase, sectionAngle, onTick]);

  return (
    <div className="relative w-full h-full">
      {/* Idle animation glow */}
      {!isSpinning && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFD700]/20 via-[#E63946]/20 to-[#FFD700]/20 animate-pulse blur-xl" />
      )}

      {/* 중앙 허브 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] via-[#E63946] to-[#9D0208] shadow-2xl flex items-center justify-center transition-transform ${
          isSpinning ? 'scale-110' : 'scale-100'
        }`}>
          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-3xl animate-pulse">🐴</span>
          </div>
        </div>
      </div>

      {/* 화살표 포인터 */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 pointer-events-none transition-transform ${
        phase === 'stopping' ? 'animate-bounce' : ''
      }`}>
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]" />
      </div>

      {/* 룰렛 휠 */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
        style={{
          transform: `rotate(${currentRotation}deg)`,
          filter: isSpinning ? 'blur(0.5px)' : 'none',
        }}
      >
        {/* SVG 배경 섹션 */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <defs>
            <radialGradient id="wheelGradient">
              <stop offset="0%" stopColor="#E63946" />
              <stop offset="50%" stopColor="#9D0208" />
              <stop offset="100%" stopColor="#780000" />
            </radialGradient>
          </defs>
          {artists.map((artist, index) => {
            const startAngle = (index * sectionAngle - 90) * (Math.PI / 180);
            const endAngle = ((index + 1) * sectionAngle - 90) * (Math.PI / 180);
            const x1 = 50 + 50 * Math.cos(startAngle);
            const y1 = 50 + 50 * Math.sin(startAngle);
            const x2 = 50 + 50 * Math.cos(endAngle);
            const y2 = 50 + 50 * Math.sin(endAngle);
            const largeArcFlag = sectionAngle > 180 ? 1 : 0;

            const isEvenSection = index % 2 === 0;
            const sectionColor = isEvenSection ? '#9D0208' : '#C1121F';

            return (
              <path
                key={`section-${index}`}
                d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={sectionColor}
              />
            );
          })}
        </svg>

        {/* 텍스트 레이어 */}
        {artists.map((artist, index) => {
          const startAngle = index * sectionAngle;

          return (
            <div
              key={`${artist.englishName}-${index}`}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${startAngle}deg)`,
                transformOrigin: 'center',
              }}
            >
              {/* 텍스트 */}
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  paddingTop: '30px',
                }}
              >
                <div
                  className="text-white text-xs font-bold"
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                    textShadow: '0 0 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.5)',
                    letterSpacing: '1px',
                  }}
                >
                  {artist.koreanName}
                </div>
              </div>
            </div>
          );
        })}

        {/* 구분선 */}
        {artists.map((artist, index) => {
          const lineAngle = index * sectionAngle;
          return (
            <div
              key={`line-${index}`}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${lineAngle}deg)`,
                transformOrigin: 'center',
              }}
            >
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{
                  width: '1px',
                  height: '50%',
                  backgroundColor: '#FFD700',
                  opacity: 0.2,
                }}
              />
            </div>
          );
        })}

        {/* 외곽 금테 */}
        <div className="absolute inset-0 rounded-full border-4 border-[#FFD700]" />
      </div>

      {/* 외곽 장식 링 */}
      <div className="absolute inset-0 -m-4 rounded-full border-2 border-[#FFBE0B] opacity-50 pointer-events-none animate-pulse" />
    </div>
  );
}

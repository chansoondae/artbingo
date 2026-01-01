'use client';

import { Artist } from '@/lib/artists';

interface RouletteWheelProps {
  artists: Artist[];
  rotation: number;
  duration: number;
  isSpinning: boolean;
}

export default function RouletteWheel({ artists, rotation, duration, isSpinning }: RouletteWheelProps) {
  const sectionAngle = 360 / artists.length;

  return (
    <div className="relative w-full h-full">
      {/* 중앙 허브 */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] via-[#E63946] to-[#9D0208] shadow-2xl flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-3xl">🐴</span>
          </div>
        </div>
      </div>

      {/* 화살표 포인터 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 pointer-events-none">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-[#FFD700] drop-shadow-lg" />
      </div>

      {/* 룰렛 휠 */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.3, 0.99)` : 'none',
        }}
      >
        {artists.map((artist, index) => {
          const centerAngle = index * sectionAngle + (sectionAngle / 2) - 90;

          return (
            <div
              key={`${artist.englishName}-${index}`}
              className="absolute w-full h-full"
              style={{
                transform: `rotate(${centerAngle}deg)`,
                transformOrigin: 'center',
              }}
            >
              {/* 텍스트 */}
              <div
                className="absolute left-1/2 top-0 origin-bottom flex items-start justify-center"
                style={{
                  width: '1px',
                  height: '50%',
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
          const lineAngle = index * sectionAngle - 90;
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
                className="absolute left-1/2 top-0 origin-bottom"
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
      <div className="absolute inset-0 -m-4 rounded-full border-2 border-[#FFBE0B] opacity-50 pointer-events-none" />
    </div>
  );
}

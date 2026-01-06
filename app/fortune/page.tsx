import { Suspense } from 'react';
import Link from 'next/link';
import { parseArtistsJSON } from '@/lib/artists';
import FortuneRoulette from '@/components/fortune-roulette/FortuneRoulette';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '2026 병오년 새해 운세 룰렛 | 아트프렌즈',
  description: '붉은 말의 해 2026년, 예술가와 함께하는 특별한 새해 운세를 확인해보세요. Art Friends와 함께하는 병오년 운세 룰렛.',
  keywords: '2026 운세, 병오년, 새해 운세, 아트프렌즈, 예술가 운세, 말의 해',
  openGraph: {
    title: '2026 병오년 새해 운세 룰렛 | 아트프렌즈',
    description: '붉은 말의 해 2026년, 예술가와 함께하는 특별한 새해 운세',
    images: [
      {
        url: '/og-fortune.jpg',
        width: 1200,
        height: 630,
        alt: '2026 병오년 운세 룰렛',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 병오년 새해 운세 룰렛',
    description: '붉은 말의 해 2026년, 예술가와 함께하는 특별한 새해 운세',
    images: ['/og-fortune.jpg'],
  },
};

export default function Fortune2026Page() {
  const artists = parseArtistsJSON();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E63946] via-[#9D0208] to-[#1A1A1A]">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-2">
          {/* <Link href="/" className="inline-block text-white/80 hover:text-white mb-4 transition-colors">
            ← 홈으로 돌아가기
          </Link> */}

          <div className="mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFBE0B] to-[#FFD700] mb-2 animate-shimmer">
              🐴 2026 병오년 새해 운세 룰렛
            </h1>
            {/* <p className="text-white/90 text-lg mb-8">
              Art Friends × 붉은 말의 해
            </p> */}
          </div>
        </div>

        {/* 룰렛 */}
        <Suspense fallback={<div className="text-center text-white">로딩 중...</div>}>
          <FortuneRoulette allArtists={artists} />
        </Suspense>

        {/* 안내 텍스트 */}
        <div className="mt-8 text-center">
          <p className="text-white/90 text-lg leading-relaxed">
            2026년 병오년(丙午年)은 붉은색과 불의 기운을 지닌 &apos;병(丙)&apos;과<br />
            말을 상징하는 &apos;오(午)&apos;가 만나는 해입니다.
          </p>
        </div>

        {/* 푸터 */}
        {/* <div className="mt-12 text-center text-white/60 text-sm">
          <p>예술가와 함께하는 특별한 한 해를 응원합니다</p>
          <p className="mt-2">Art Friends × 2026</p>
        </div> */}
      </div>
    </main>
  );
}

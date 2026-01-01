'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Artist {
  koreanName: string;
  englishName: string;
  popularityScore: number;
}

type SortType = 'korean' | 'english' | 'popularity';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [sortType, setSortType] = useState<SortType>('korean');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/artists')
      .then((res) => res.json())
      .then((data) => {
        setArtists(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load artists:', error);
        setIsLoading(false);
      });
  }, []);

  const sortedArtists = [...artists].sort((a, b) => {
    switch (sortType) {
      case 'korean':
        return a.koreanName.localeCompare(b.koreanName, 'ko');
      case 'english':
        return a.englishName.localeCompare(b.englishName, 'en');
      case 'popularity':
        return b.popularityScore - a.popularityScore;
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen bg-bg-primary">
      <div className="max-w-[800px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-white hover:underline mb-4 inline-block">
            ← 홈으로
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">작가 목록</h1>
          <p className="text-white/90">총 {artists.length}명의 작가</p>
        </div>

        {/* Sort Buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSortType('korean')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              sortType === 'korean'
                ? 'bg-white text-[#F5847A]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            가나다순
          </button>
          <button
            onClick={() => setSortType('english')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              sortType === 'english'
                ? 'bg-white text-[#F5847A]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            ABC순
          </button>
          <button
            onClick={() => setSortType('popularity')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              sortType === 'popularity'
                ? 'bg-white text-[#F5847A]'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            인지도 점수순
          </button>
        </div>

        {/* Artists List */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white/20 rounded-lg h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedArtists.map((artist, index) => (
              <div
                key={`${artist.koreanName}-${index}`}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      {artist.koreanName}
                    </h2>
                    <p className="text-sm text-gray-600">{artist.englishName}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-500 mb-1">인지도</div>
                    <div className="text-xl font-bold text-[#F5847A]">
                      {artist.popularityScore}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

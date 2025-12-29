'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import BingoBoard from '@/components/BingoBoard';
import RankingButton from '@/components/RankingButton';
import { BingoCell } from '@/lib/types';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(16);
  const [cells, setCells] = useState<BingoCell[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVisitedCountChange = useCallback((count: number) => {
    setVisitedCount(count);
  }, []);

  const handleCellsChange = useCallback((newCells: BingoCell[]) => {
    setCells(newCells);
  }, []);

  return (
    <main className="min-h-screen bg-bg-primary">
      <div id="bingo-export" className="bg-bg-primary pb-4">
        <div className="max-w-[480px] mx-auto px-4">
          <Header visitedCount={visitedCount} totalCount={totalCount} />

          <div className="mb-4">
            {isMounted ? (
              <BingoBoard
                onVisitedCountChange={handleVisitedCountChange}
                onCellsChange={handleCellsChange}
              />
            ) : (
              <div className="grid grid-cols-4 gap-2 md:gap-3 w-full max-w-[480px] mx-auto">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            )}
          </div>

          <div className="text-center space-y-3 mb-2">
            <p className="text-xl md:text-2xl font-bold text-white">
              올해 미술 전시 어디까지 가봤니?
            </p>
            <p className="text-sm text-white/90 leading-relaxed">
              마지막 4칸은 자유롭게 채워서<br />
              네이버카페 아트프렌즈에 인증!<br />
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 pb-8 space-y-3">
        <RankingButton cells={cells} />
      </div>
    </main>
  );
}

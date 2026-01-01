'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Artist } from '@/lib/artists';
import { useRouletteLogic } from '@/hooks/useRouletteLogic';
import EnhancedRouletteWheel from './EnhancedRouletteWheel';
import SpinButton from './SpinButton';
import ResultCard from './ResultCard';
import ParticleSystem from './ParticleSystem';
import Fireworks from './Fireworks';
import HorseAnimation from './HorseAnimation';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, runTransaction, increment } from 'firebase/firestore';

interface FortuneRouletteProps {
  allArtists: Artist[];
}

export default function FortuneRoulette({ allArtists }: FortuneRouletteProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showResult, setShowResult] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showHorse, setShowHorse] = useState(false);
  const [wheelCenter, setWheelCenter] = useState({ x: 0, y: 0 });
  const [displayArtists, setDisplayArtists] = useState<Artist[]>([]);
  const [urlArtist, setUrlArtist] = useState<Artist | null>(null);

  // URL 파라미터에서 id 확인하고 해당 예술가 찾기
  useEffect(() => {
    const artistId = searchParams.get('id');
    if (artistId) {
      const artist = allArtists.find(a => a.id === artistId);
      if (artist) {
        setUrlArtist(artist);
        setShowResult(true);
      }
    }
  }, [searchParams, allArtists]);

  // 룰렛에 표시할 예술가 (30명 랜덤 선택) - 클라이언트에서만 초기화
  useEffect(() => {
    const count = 30;
    const shuffled = [...allArtists].sort(() => Math.random() - 0.5);
    setDisplayArtists(shuffled.slice(0, count));
  }, [allArtists]);

  const {
    phase,
    selectedArtist,
    rotation,
    duration,
    startSpin,
    reset,
  } = useRouletteLogic(displayArtists);

  // Tick sound effect (can be replaced with actual sound)
  const handleTick = useCallback(() => {
    // Vibrate on mobile if supported
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }, []);

  const handleSpin = () => {
    setShowResult(false);
    setShowFireworks(false);
    setShowHorse(false);
    startSpin();

    // Get wheel center position
    const wheelElement = document.querySelector('[data-wheel-center]');
    if (wheelElement) {
      const rect = wheelElement.getBoundingClientRect();
      setWheelCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  const handleReset = () => {
    setShowResult(false);
    setShowFireworks(false);
    setShowHorse(false);
    setUrlArtist(null);

    // URL 파라미터가 있으면 제거
    if (searchParams.get('id')) {
      router.push('/fortune');
    }

    reset();
  };

  // Firebase에 결과 저장 및 통계 업데이트
  const saveFortuneResult = async (artist: Artist) => {
    try {
      const nickname = localStorage.getItem('artbingo-nickname');
      const timestamp = new Date();

      // 운세 결과 저장
      await addDoc(collection(db, 'fortuneResults'), {
        nickname: nickname || '',
        artistId: artist.id || '',
        artistName: artist.koreanName || '',
        timestamp
      });

      // 통계 업데이트
      const statsRef = doc(db, 'statistics', 'fortuneStats');
      await runTransaction(db, async (transaction) => {
        const statsDoc = await transaction.get(statsRef);

        if (!statsDoc.exists()) {
          // 문서가 없으면 생성
          const initialData = {
            totalSpins: 1,
            artists: {
              [artist.id || '']: 1
            }
          };

          // 닉네임이 있으면 닉네임별 통계도 추가
          if (nickname) {
            initialData.nicknames = {
              [nickname]: 1
            };
          }

          transaction.set(statsRef, initialData);
        } else {
          // 총 시도 횟수 및 예술가별 횟수 증가
          const updates = {
            totalSpins: increment(1),
            [`artists.${artist.id || ''}`]: increment(1)
          };

          // 닉네임이 있으면 닉네임별 횟수도 증가
          if (nickname) {
            updates[`nicknames.${nickname}`] = increment(1);
          }

          transaction.update(statsRef, updates);
        }
      });

      console.log('운세 결과 및 통계가 저장되었습니다.');
    } catch (error) {
      console.error('운세 결과 저장 중 오류 발생:', error);
      // 저장 실패해도 사용자 경험에 영향을 주지 않도록 에러를 삼킴
    }
  };

  // 결과 표시 시퀀스
  if (phase === 'result' && selectedArtist && !showResult && !showFireworks) {
    // Firebase에 결과 저장
    saveFortuneResult(selectedArtist);

    setTimeout(() => {
      setShowFireworks(true);
      setShowHorse(true);
    }, 300);

    setTimeout(() => {
      setShowResult(true);
    }, 2000);
  }

  const isSpinning = phase === 'spinning' || phase === 'slowing' || phase === 'stopping';
  const particleIntensity = phase === 'spinning' ? 'high' : phase === 'slowing' ? 'medium' : 'low';

  // 로딩 중일 때
  if (displayArtists.length === 0) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 파티클 시스템 */}
      <ParticleSystem
        isActive={isSpinning || phase === 'idle'}
        centerX={wheelCenter.x || (typeof window !== 'undefined' ? window.innerWidth / 2 : 400)}
        centerY={wheelCenter.y || (typeof window !== 'undefined' ? window.innerHeight / 3 : 300)}
        intensity={particleIntensity}
        type="flame"
      />

      {/* 불꽃놀이 */}
      <Fireworks trigger={showFireworks} />

      {/* 말 달리기 */}
      <HorseAnimation trigger={showHorse} />

      {/* 룰렛 영역 */}
      <div className="flex flex-col items-center gap-6">
        {/* 버튼 */}
        <SpinButton
          onClick={handleSpin}
          disabled={isSpinning}
          isSpinning={isSpinning}
        />

        {/* 룰렛 */}
        <div
          data-wheel-center
          className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
        >
          <EnhancedRouletteWheel
            artists={displayArtists}
            rotation={rotation}
            duration={duration}
            isSpinning={isSpinning}
            phase={phase}
            onTick={handleTick}
          />
        </div>
      </div>

      {/* 결과 카드 */}
      {showResult && (urlArtist || selectedArtist) && (
        <ResultCard
          artist={urlArtist || selectedArtist!}
          onClose={handleReset}
        />
      )}
    </div>
  );
}

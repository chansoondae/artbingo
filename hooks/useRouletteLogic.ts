import { useState, useCallback } from 'react';
import { Artist } from '@/lib/artists';

interface SpinConfig {
  minRotations: number;
  maxRotations: number;
  baseDuration: number;
  suspenseDuration: number;
}

const DEFAULT_CONFIG: SpinConfig = {
  minRotations: 5,
  maxRotations: 8,
  baseDuration: 4000,
  suspenseDuration: 2000,
};

export type RoulettePhase = 'idle' | 'spinning' | 'slowing' | 'stopping' | 'result';

interface RouletteState {
  phase: RoulettePhase;
  selectedIndex: number | null;
  selectedArtist: Artist | null;
  rotation: number;
  duration: number;
}

export function useRouletteLogic(artists: Artist[], config: SpinConfig = DEFAULT_CONFIG) {
  const [state, setState] = useState<RouletteState>({
    phase: 'idle',
    selectedIndex: null,
    selectedArtist: null,
    rotation: 0,
    duration: 0,
  });

  const startSpin = useCallback(() => {
    if (state.phase !== 'idle' && state.phase !== 'result') return;
    if (artists.length === 0) return; // 예술가 목록이 비어있으면 리턴

    // 1. 랜덤하게 결과 예술가 선택
    const selectedIndex = Math.floor(Math.random() * artists.length);
    const selectedArtist = artists[selectedIndex];

    // 2. 해당 인덱스에 도달하기 위한 회전각 계산
    const sectionAngle = 360 / artists.length;
    const targetAngle = selectedIndex * sectionAngle;

    // 3. 랜덤 회전 수 + 목표 각도
    const rotations = config.minRotations +
      Math.random() * (config.maxRotations - config.minRotations);
    const totalRotation = (rotations * 360) + targetAngle;

    const totalDuration = config.baseDuration + config.suspenseDuration;

    setState({
      phase: 'spinning',
      selectedIndex,
      selectedArtist,
      rotation: totalRotation,
      duration: totalDuration,
    });

    // 스핀 단계 관리
    setTimeout(() => {
      setState(prev => ({ ...prev, phase: 'slowing' }));
    }, config.baseDuration * 0.6);

    setTimeout(() => {
      setState(prev => ({ ...prev, phase: 'stopping' }));
    }, config.baseDuration);

    setTimeout(() => {
      setState(prev => ({ ...prev, phase: 'result' }));
    }, totalDuration);

  }, [artists, config, state.phase]);

  const reset = useCallback(() => {
    setState({
      phase: 'idle',
      selectedIndex: null,
      selectedArtist: null,
      rotation: 0,
      duration: 0,
    });
  }, []);

  return {
    ...state,
    startSpin,
    reset,
  };
}

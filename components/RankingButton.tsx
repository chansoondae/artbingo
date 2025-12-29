'use client';

import { useState } from 'react';
import { BingoCell, RankingData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import RankingModal from './RankingModal';

interface RankingButtonProps {
  cells: BingoCell[];
}

export default function RankingButton({ cells }: RankingButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [currentUserRanking, setCurrentUserRanking] = useState<RankingData | null>(null);
  const [needsNickname, setNeedsNickname] = useState(false);

  const fetchAndSetRankings = async () => {
    // Fetch all rankings ordered by created_at descending (latest first)
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filter to keep only the latest entry per nickname
    const uniqueRankings = data?.reduce((acc: RankingData[], curr) => {
      if (!acc.find(item => item.nickname === curr.nickname)) {
        acc.push(curr);
      }
      return acc;
    }, []) || [];

    // Sort by visited_count descending, then by created_at ascending for ties
    uniqueRankings.sort((a, b) => {
      if (b.visited_count !== a.visited_count) {
        return b.visited_count - a.visited_count;
      }
      return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
    });

    setRankings(uniqueRankings);
  };

  const handleOpenRanking = async () => {
    // Check if nickname is set
    const nickname = localStorage.getItem('artbingo-nickname') || 'Guest';

    if (nickname === 'Guest') {
      setNeedsNickname(true);
      setIsModalOpen(true);
      return;
    }

    setIsModalOpen(true);
    setNeedsNickname(false);
    setIsLoading(true);

    try {
      // Save current ranking
      const visitedCells = cells.filter(cell => cell.isVisited);
      const visitedExhibitions = visitedCells.map(
        cell => `${cell.museum} - ${cell.exhibition}`
      );

      const rankingData: RankingData = {
        nickname,
        visited_exhibitions: visitedExhibitions,
        visited_count: visitedCells.length,
        timestamp: new Date().toISOString(),
      };

      const { data: savedData, error: saveError } = await supabase
        .from('rankings')
        .insert([rankingData])
        .select()
        .single();

      if (saveError) throw saveError;

      setCurrentUserRanking(savedData);

      // Fetch and set rankings
      await fetchAndSetRankings();
    } catch (error) {
      console.error('Error fetching rankings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveWithNickname = async (nickname: string) => {
    // Save nickname to localStorage
    localStorage.setItem('artbingo-nickname', nickname);

    setNeedsNickname(false);
    setIsLoading(true);

    try {
      // Save current ranking
      const visitedCells = cells.filter(cell => cell.isVisited);
      const visitedExhibitions = visitedCells.map(
        cell => `${cell.museum} - ${cell.exhibition}`
      );

      const rankingData: RankingData = {
        nickname,
        visited_exhibitions: visitedExhibitions,
        visited_count: visitedCells.length,
        timestamp: new Date().toISOString(),
      };

      const { data: savedData, error: saveError } = await supabase
        .from('rankings')
        .insert([rankingData])
        .select()
        .single();

      if (saveError) throw saveError;

      setCurrentUserRanking(savedData);

      // Fetch and set rankings
      await fetchAndSetRankings();
    } catch (error) {
      console.error('Error saving ranking:', error);
      alert('순위 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenRanking}
        className="w-full py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md"
      >
        순위 확인하기
      </button>

      <RankingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rankings={rankings}
        currentUserRanking={currentUserRanking}
        isLoading={isLoading}
        visitedCount={cells.filter(cell => cell.isVisited).length}
        needsNickname={needsNickname}
        onSaveWithNickname={handleSaveWithNickname}
      />
    </>
  );
}

'use client';

import { useState } from 'react';
import { RankingData } from '@/lib/types';
import { getBadge } from '@/lib/badge';
import ExhibitionListModal from './ExhibitionListModal';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: RankingData[];
  currentUserRanking: RankingData | null;
  isLoading: boolean;
  visitedCount: number;
  needsNickname: boolean;
  onSaveWithNickname: (nickname: string) => void;
}

export default function RankingModal({
  isOpen,
  onClose,
  rankings,
  currentUserRanking,
  isLoading,
  visitedCount,
  needsNickname,
  onSaveWithNickname,
}: RankingModalProps) {
  const [nickname, setNickname] = useState('');
  const [selectedRanking, setSelectedRanking] = useState<RankingData | null>(null);
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSaveWithNickname(nickname.trim());
      setNickname('');
    }
  };

  const handleRankingClick = (ranking: RankingData) => {
    setSelectedRanking(ranking);
    setIsExhibitionModalOpen(true);
  };

  const getUserRank = () => {
    if (!currentUserRanking) return null;
    const index = rankings.findIndex(r => r.id === currentUserRanking.id);
    return index !== -1 ? index + 1 : null;
  };

  const userRank = getUserRank();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">전시 관람 순위</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            나의 관람 전시: {visitedCount}개
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {needsNickname ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-gray-700 mb-4">
                  순위를 확인하려면 닉네임을 입력해주세요.
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  autoFocus
                  maxLength={10}
                />
              </div>
              <button
                type="submit"
                disabled={!nickname.trim()}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                확인
              </button>
            </form>
          ) : isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : (
            <>
              {currentUserRanking && userRank && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-500">
                  <p className="text-lg font-bold text-blue-900 mb-1">
                    내 순위: {userRank}위
                  </p>
                  <p className="text-sm text-blue-700">
                    {currentUserRanking.nickname} - {currentUserRanking.visited_count}개 관람
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-bold text-gray-900 mb-3">전체 순위 (상위 50위)</h3>
                {rankings.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    아직 등록된 기록이 없습니다.
                  </p>
                ) : (
                  rankings.slice(0, 50).map((ranking, index) => {
                    const badge = getBadge(ranking.visited_count);
                    return (
                      <div
                        key={ranking.id}
                        onClick={() => handleRankingClick(ranking)}
                        className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                          ranking.id === currentUserRanking?.id
                            ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span
                              className={`font-bold flex-shrink-0 ${
                                index === 0
                                  ? 'text-yellow-600 text-xl'
                                  : index === 1
                                  ? 'text-gray-500 text-lg'
                                  : index === 2
                                  ? 'text-orange-700 text-lg'
                                  : 'text-gray-600'
                              }`}
                            >
                              {index + 1}위
                            </span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-semibold text-gray-900">
                                  {ranking.nickname}
                                </p>
                                {badge && (
                                  <div
                                    className="px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1"
                                    style={{
                                      background: badge.gradient,
                                      color: badge.textColor
                                    }}
                                  >
                                    <span>{badge.icon}</span>
                                    <span>{badge.name}</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {new Date(ranking.timestamp).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className="font-bold text-gray-900">
                              {ranking.visited_count}개
                            </p>
                            <p className="text-xs text-gray-500">
                              클릭하여 보기
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <ExhibitionListModal
        isOpen={isExhibitionModalOpen}
        onClose={() => setIsExhibitionModalOpen(false)}
        ranking={selectedRanking}
      />
    </div>
  );
}

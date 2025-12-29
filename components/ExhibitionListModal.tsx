'use client';

import { RankingData } from '@/lib/types';

interface ExhibitionListModalProps {
  isOpen: boolean;
  onClose: () => void;
  ranking: RankingData | null;
}

export default function ExhibitionListModal({
  isOpen,
  onClose,
  ranking,
}: ExhibitionListModalProps) {
  if (!isOpen || !ranking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {ranking.nickname}님의 전시 관람 목록
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                총 {ranking.visited_count}개 관람
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {ranking.visited_exhibitions.map((exhibition, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-gray-900 leading-relaxed">
                    {exhibition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ExhibitionGroup, BingoCell } from '@/lib/types';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedExhibitions: { museum: string; exhibition: string }[]) => void;
  currentCells: BingoCell[];
}

export default function BulkAddModal({
  isOpen,
  onClose,
  onAdd,
  currentCells,
}: BulkAddModalProps) {
  const [groupedExhibitions, setGroupedExhibitions] = useState<{
    [key: string]: ExhibitionGroup[];
  }>({});
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchExhibitionGroups();
    }
  }, [isOpen]);

  const fetchExhibitionGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('exhibition_groups_stats')
        .select('*')
        .order('grouped_name', { ascending: true });

      if (error) throw error;

      // Group by grouped_name
      const grouped = (data || []).reduce((acc, item) => {
        const groupName = item.grouped_name;
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(item);
        return acc;
      }, {} as { [key: string]: ExhibitionGroup[] });

      setGroupedExhibitions(grouped);
    } catch (err) {
      console.error('Failed to fetch exhibition groups:', err);
      setError('전시 그룹을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleGroup = (groupName: string) => {
    const newSelected = new Set(selectedGroups);
    if (newSelected.has(groupName)) {
      newSelected.delete(groupName);
    } else {
      newSelected.add(groupName);
    }
    setSelectedGroups(newSelected);
  };

  const handleAdd = () => {
    const selectedExhibitions: { museum: string; exhibition: string }[] = [];

    selectedGroups.forEach((groupName) => {
      // Parse grouped_name: "{미술관}-{전시이름}" format
      const parts = groupName.split('-');
      if (parts.length >= 2) {
        const museum = parts[0].trim();
        const exhibition = parts.slice(1).join('-').trim();
        selectedExhibitions.push({
          museum,
          exhibition,
        });
      }
    });

    onAdd(selectedExhibitions);
    setSelectedGroups(new Set());
    onClose();
  };

  const handleCancel = () => {
    setSelectedGroups(new Set());
    onClose();
  };

  // Check if a group is already in the current cells by comparing with original_names
  const isGroupAlreadyAdded = (groupName: string): boolean => {
    const exhibitions = groupedExhibitions[groupName] || [];
    if (exhibitions.length === 0) return false;

    // Get all original_names from this group
    const originalNames = exhibitions[0]?.original_names || [];

    // Check if any current cell's exhibition matches any of the original_names
    return currentCells.some((cell) => {
      if (!cell.exhibition) return false;
      const cellExhibitionName = `${cell.museum}-${cell.exhibition}`;
      return originalNames.some((originalName) =>
        originalName.toLowerCase().includes(cell.exhibition.toLowerCase()) ||
        cell.exhibition.toLowerCase().includes(originalName.toLowerCase()) ||
        cellExhibitionName === originalName
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">대량 추가</h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500">{error}</div>
            </div>
          ) : Object.keys(groupedExhibitions).length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">전시 그룹이 없습니다.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(groupedExhibitions).map(([groupName, exhibitions]) => {
                const isAlreadyAdded = isGroupAlreadyAdded(groupName);
                return (
                  <div
                    key={groupName}
                    className={`p-4 border rounded-lg transition-all ${
                      isAlreadyAdded
                        ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                        : selectedGroups.has(groupName)
                        ? 'border-blue-500 bg-blue-50 cursor-pointer'
                        : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                    }`}
                    onClick={() => !isAlreadyAdded && handleToggleGroup(groupName)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedGroups.has(groupName)}
                        onChange={() => handleToggleGroup(groupName)}
                        onClick={(e) => e.stopPropagation()}
                        disabled={isAlreadyAdded}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold mb-2 ${isAlreadyAdded ? 'text-gray-500' : 'text-gray-900'}`}>
                            {groupName}
                          </h3>
                          {isAlreadyAdded && (
                            <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full">
                              이미 추가됨
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedGroups.size === 0}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {selectedGroups.size > 0
                ? `${selectedGroups.size}개 전시 추가`
                : '전시 선택'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

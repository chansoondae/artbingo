'use client';

import { useState, useEffect } from 'react';

interface CustomCellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (museum: string, exhibition: string) => void;
  onDelete?: () => void;
  initialMuseum?: string;
  initialExhibition?: string;
}

export default function CustomCellModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialMuseum = '',
  initialExhibition = '',
}: CustomCellModalProps) {
  const [museum, setMuseum] = useState(initialMuseum);
  const [exhibition, setExhibition] = useState(initialExhibition);

  useEffect(() => {
    setMuseum(initialMuseum);
    setExhibition(initialExhibition);
  }, [initialMuseum, initialExhibition, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (museum.trim() && exhibition.trim()) {
      onSave(museum.trim(), exhibition.trim());
      setMuseum('');
      setExhibition('');
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setMuseum('');
      setExhibition('');
      onClose();
    }
  };

  const handleCancel = () => {
    setMuseum('');
    setExhibition('');
    onClose();
  };

  const isEditingExistingCell = initialMuseum || initialExhibition;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          전시 추가하기
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="museum" className="block text-sm font-medium text-text-secondary mb-1">
              미술관명 *
            </label>
            <input
              id="museum"
              type="text"
              value={museum}
              onChange={(e) => setMuseum(e.target.value)}
              placeholder="예: 국립현대미술관"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bg-primary"
            />
          </div>

          <div>
            <label htmlFor="exhibition" className="block text-sm font-medium text-text-secondary mb-1">
              전시제목 *
            </label>
            <input
              id="exhibition"
              type="text"
              value={exhibition}
              onChange={(e) => setExhibition(e.target.value)}
              placeholder="예: 피카소 특별전"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bg-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          {isEditingExistingCell && onDelete && (
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              삭제
            </button>
          )}
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!museum.trim() || !exhibition.trim()}
            className="flex-1 px-4 py-2 bg-bg-primary text-white rounded-lg font-medium hover:bg-bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

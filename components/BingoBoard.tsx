'use client';

import { useState, useEffect } from 'react';
import { BingoCell as BingoCellType } from '@/lib/types';
import { initialExhibitions } from '@/lib/exhibitions';
import { saveToLocalStorage, loadFromLocalStorage } from '@/lib/storage';
import BingoCellComponent from './BingoCell';
import CustomCellModal from './CustomCellModal';

interface BingoBoardProps {
  onVisitedCountChange: (count: number) => void;
  onCellsChange?: (cells: BingoCellType[]) => void;
}

export default function BingoBoard({ onVisitedCountChange, onCellsChange }: BingoBoardProps) {
  const [cells, setCells] = useState<BingoCellType[]>(initialExhibitions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved) {
      setCells(saved);
    }
  }, []);

  // Save to localStorage whenever cells change
  useEffect(() => {
    saveToLocalStorage(cells);
    // Update visited count
    const visitedCount = cells.filter(cell => cell.isVisited).length;
    onVisitedCountChange(visitedCount);
    // Update cells in parent
    onCellsChange?.(cells);
  }, [cells, onVisitedCountChange, onCellsChange]);

  const handleToggleVisited = (id: string) => {
    setCells((prev) =>
      prev.map((cell) =>
        cell.id === id ? { ...cell, isVisited: !cell.isVisited } : cell
      )
    );
  };

  const handleEditCell = (id: string) => {
    setEditingCellId(id);
    setIsModalOpen(true);
  };

  const handleSaveCustomCell = (museum: string, exhibition: string) => {
    if (editingCellId) {
      setCells((prev) =>
        prev.map((cell) =>
          cell.id === editingCellId
            ? { ...cell, museum, exhibition }
            : cell
        )
      );
    }
    setEditingCellId(null);
  };

  const handleAddRow = () => {
    const newRowCells: BingoCellType[] = Array.from({ length: 4 }, (_, i) => ({
      id: `custom-${Date.now()}-${i}`,
      type: 'custom',
      museum: '',
      exhibition: '',
      isVisited: false,
      order: cells.length + i,
    }));
    setCells((prev) => [...prev, ...newRowCells]);
  };

  const editingCell = cells.find((cell) => cell.id === editingCellId);

  return (
    <>
      <div className="w-full max-w-[480px] mx-auto">
        <div className="grid grid-cols-4 gap-2 md:gap-3">
          {cells
            .sort((a, b) => a.order - b.order)
            .map((cell) => (
              <BingoCellComponent
                key={cell.id}
                cell={cell}
                onToggle={() => handleToggleVisited(cell.id)}
                onEdit={() => handleEditCell(cell.id)}
              />
            ))}
        </div>

        {/* Add row button */}
        <button
          onClick={handleAddRow}
          className="w-full mt-3 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span>
          <span>행 추가하기 (4칸)</span>
        </button>
      </div>

      <CustomCellModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCellId(null);
        }}
        onSave={handleSaveCustomCell}
        initialMuseum={editingCell?.museum}
        initialExhibition={editingCell?.exhibition}
      />
    </>
  );
}

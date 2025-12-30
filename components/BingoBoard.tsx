'use client';

import { useState, useEffect } from 'react';
import { BingoCell as BingoCellType } from '@/lib/types';
import { initialExhibitions } from '@/lib/exhibitions';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '@/lib/storage';
import BingoCellComponent from './BingoCell';
import CustomCellModal from './CustomCellModal';
import BulkAddModal from './BulkAddModal';

interface BingoBoardProps {
  onVisitedCountChange: (count: number) => void;
  onCellsChange?: (cells: BingoCellType[]) => void;
}

export default function BingoBoard({ onVisitedCountChange, onCellsChange }: BingoBoardProps) {
  const [cells, setCells] = useState<BingoCellType[]>(() => {
    // Load from localStorage on initial state
    const saved = loadFromLocalStorage();
    return saved || initialExhibitions;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [isBulkAddModalOpen, setIsBulkAddModalOpen] = useState(false);

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

  const handleDeleteCell = (id: string) => {
    if (confirm('이 전시를 삭제하시겠습니까?')) {
      setCells((prev) =>
        prev.map((cell) =>
          cell.id === id && cell.type === 'custom'
            ? { ...cell, museum: '', exhibition: '', isVisited: false }
            : cell
        )
      );
    }
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

  const handleReset = () => {
    if (confirm('정말 초기화하시겠습니까? 모든 데이터가 삭제됩니다.')) {
      clearLocalStorage();
      setCells(initialExhibitions);
    }
  };

  const handleBulkAdd = (selectedExhibitions: { museum: string; exhibition: string }[]) => {
    setCells((prev) => {
      // Find empty cells (cells with no museum and no exhibition)
      const emptyCells = prev.filter(
        (cell) => cell.type === 'custom' && !cell.museum && !cell.exhibition
      );

      // Count how many exhibitions we can fill in empty cells
      const exhibitionsForEmptyCells = Math.min(emptyCells.length, selectedExhibitions.length);

      // Fill empty cells first
      let exhibitionIndex = 0;
      const updatedCells = prev.map((cell) => {
        if (
          cell.type === 'custom' &&
          !cell.museum &&
          !cell.exhibition &&
          exhibitionIndex < exhibitionsForEmptyCells
        ) {
          const exhibition = selectedExhibitions[exhibitionIndex++];
          return {
            ...cell,
            museum: exhibition.museum,
            exhibition: exhibition.exhibition,
          };
        }
        return cell;
      });

      // If there are remaining exhibitions, create new rows
      const remainingExhibitions = selectedExhibitions.slice(exhibitionIndex);

      if (remainingExhibitions.length > 0) {
        // Calculate how many rows we need (4 cells per row)
        const rowsNeeded = Math.ceil(remainingExhibitions.length / 4);
        const totalCellsNeeded = rowsNeeded * 4;

        const currentMaxOrder = Math.max(...updatedCells.map(c => c.order), -1);
        const newCells: BingoCellType[] = [];

        for (let i = 0; i < totalCellsNeeded; i++) {
          const exhibition = remainingExhibitions[i];
          newCells.push({
            id: `bulk-${Date.now()}-${i}`,
            type: 'custom',
            museum: exhibition?.museum || '',
            exhibition: exhibition?.exhibition || '',
            isVisited: false,
            order: currentMaxOrder + 1 + i,
          });
        }

        return [...updatedCells, ...newCells];
      }

      return updatedCells;
    });
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

        {/* Add row, bulk add, and reset buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleAddRow}
            className="flex-1 py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>행 추가하기</span>
          </button>
          <button
            onClick={() => setIsBulkAddModalOpen(true)}
            className="flex-1 py-3 bg-blue-500/80 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">📋</span>
            <span>대량 추가</span>
          </button>
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-red-500/80 hover:bg-red-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-xl">↻</span>
            <span>초기화</span>
          </button>
        </div>
      </div>

      <CustomCellModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCellId(null);
        }}
        onSave={handleSaveCustomCell}
        onDelete={editingCellId ? () => handleDeleteCell(editingCellId) : undefined}
        initialMuseum={editingCell?.museum}
        initialExhibition={editingCell?.exhibition}
      />

      <BulkAddModal
        isOpen={isBulkAddModalOpen}
        onClose={() => setIsBulkAddModalOpen(false)}
        onAdd={handleBulkAdd}
        currentCells={cells}
      />
    </>
  );
}

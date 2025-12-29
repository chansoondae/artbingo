import { BingoCell as BingoCellType } from '@/lib/types';
import StampOverlay from './StampOverlay';

interface BingoCellProps {
  cell: BingoCellType;
  onToggle: () => void;
  onEdit?: () => void;
}

export default function BingoCell({ cell, onToggle, onEdit }: BingoCellProps) {
  const handleClick = () => {
    if (cell.type === 'custom' && !cell.museum && !cell.exhibition) {
      // Empty custom cell - open edit modal
      onEdit?.();
    } else {
      // Toggle visited state
      onToggle();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const isEmptyCustomCell = cell.type === 'custom' && !cell.museum && !cell.exhibition;
  const isFilledCustomCell = cell.type === 'custom' && (cell.museum || cell.exhibition);

  return (
    <div
      onClick={handleClick}
      className="relative aspect-square bg-bg-card rounded-lg overflow-hidden shadow-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      {/* Background image if available */}
      {cell.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${cell.backgroundImage})` }}
        />
      )}

      {/* Poster image if available */}
      {cell.posterImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${cell.posterImage})` }}
        />
      )}

      {/* Edit button for filled custom cells */}
      {isFilledCustomCell && (
        <button
          onClick={handleEditClick}
          className="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
          aria-label="수정"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-3.5 h-3.5 text-gray-700"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-3 text-center">
        {isEmptyCustomCell ? (
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl text-gray-400">+</div>
            <div className="text-xs text-text-secondary">추가하기</div>
          </div>
        ) : (
          <>
            <div className="text-xs text-text-secondary mb-1 line-clamp-1 break-keep">
              {cell.museum}
            </div>
            <div className="text-sm md:text-base font-bold text-text-primary line-clamp-2 break-keep">
              {cell.exhibition}
            </div>
          </>
        )}
      </div>

      {/* Stamp overlay */}
      <StampOverlay isVisible={cell.isVisited} />
    </div>
  );
}

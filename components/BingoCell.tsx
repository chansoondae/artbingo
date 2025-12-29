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

  const isEmptyCustomCell = cell.type === 'custom' && !cell.museum && !cell.exhibition;

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

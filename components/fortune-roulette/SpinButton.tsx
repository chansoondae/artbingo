'use client';

interface SpinButtonProps {
  onClick: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export default function SpinButton({ onClick, disabled, isSpinning }: SpinButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg
        bg-gradient-to-r from-[#FFD700] via-[#E63946] to-[#9D0208]
        text-white shadow-2xl
        border-4 border-white
        transform transition-all duration-200
        ${disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:scale-110 hover:shadow-xl active:scale-95'
        }
        ${isSpinning ? 'animate-pulse' : ''}
      `}
    >
      <span className="relative z-10 drop-shadow-lg">
        {isSpinning ? '회전 중...' : '🐴 룰렛 돌리기'}
      </span>
    </button>
  );
}

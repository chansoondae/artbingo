import Image from 'next/image';

interface StampOverlayProps {
  isVisible: boolean;
}

export default function StampOverlay({ isVisible }: StampOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 animate-stamp pointer-events-none">
      <div className="relative w-20 h-20 md:w-24 md:h-24 opacity-40">
        <Image
          src="/images/completed-stamp.png"
          alt="다녀옴 도장"
          fill
          className="object-contain"
          style={{ transform: 'rotate(12deg)' }}
          sizes="96px"
          unoptimized
        />
      </div>
    </div>
  );
}

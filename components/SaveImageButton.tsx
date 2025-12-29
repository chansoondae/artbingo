'use client';

import { toPng } from 'html-to-image';

interface SaveImageButtonProps {
  targetId: string;
}

export default function SaveImageButton({ targetId }: SaveImageButtonProps) {
  const handleSaveImage = async () => {
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Check if Web Share API is available (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], '아트프렌즈_전시빙고_2025.png', { type: 'image/png' })] })) {
        const file = new File([blob], '아트프렌즈_전시빙고_2025.png', { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: '아트프렌즈 전시빙고 2025',
        });
      } else {
        // Fallback for desktop or browsers without share support
        const link = document.createElement('a');
        link.download = '아트프렌즈_전시빙고_2025.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Failed to save image:', error);
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <button
      onClick={handleSaveImage}
      className="w-full max-w-md mx-auto px-6 py-3 bg-accent text-text-primary font-bold rounded-lg shadow-lg hover:bg-accent/90 transition-all hover:scale-105"
    >
      이미지로 저장하기
    </button>
  );
}

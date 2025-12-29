'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BingoCell } from '@/lib/types';

interface ProfileGeneratorProps {
  cells: BingoCell[];
}

export default function ProfileGenerator({ cells }: ProfileGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [exhibitionImages, setExhibitionImages] = useState<{ [key: string]: File }>({});
  const [exhibitionImagePreviews, setExhibitionImagePreviews] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{
    imageUrl: string;
    description: string;
  } | null>(null);

  const visitedCells = cells.filter(c => c.isVisited);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExhibitionImageUpload = (cellId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExhibitionImages(prev => ({ ...prev, [cellId]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setExhibitionImagePreviews(prev => ({ ...prev, [cellId]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    setIsGenerating(true);
    try {
      const visitedCount = cells.filter(c => c.isVisited).length;

      const formData = new FormData();
      formData.append('nickname', nickname.trim());
      formData.append('exhibitions', JSON.stringify(cells));
      formData.append('visitedCount', visitedCount.toString());
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      // 전시 이미지들 추가
      Object.entries(exhibitionImages).forEach(([cellId, file]) => {
        formData.append(`exhibitionImage_${cellId}`, file);
      });

      const response = await fetch('/api/generate-profile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate profile');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('프로필 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setResult(null);
    setNickname('');
    setProfileImage(null);
    setProfileImagePreview(null);
    setExhibitionImages({});
    setExhibitionImagePreviews({});
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full max-w-md mx-auto px-6 py-3 bg-white text-bg-primary font-bold rounded-lg shadow-lg hover:bg-white/90 transition-all hover:scale-105"
      >
        🎨 이미지로 표현하기
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-text-primary">
            나를 이미지로 표현하기
          </h2>
          <button
            onClick={handleClose}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-text-secondary mb-2">
                닉네임을 입력해주세요
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 미술관 탐험가"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-bg-primary"
                disabled={isGenerating}
              />
            </div>

            <div>
              <label htmlFor="profile-image" className="block text-sm font-medium text-text-secondary mb-2">
                프로필 사진 (선택)
              </label>
              <div className="flex items-center gap-4">
                {profileImagePreview && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-300">
                    <Image
                      src={profileImagePreview}
                      alt="프로필 미리보기"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <label
                  htmlFor="profile-image"
                  className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-bg-primary transition-colors"
                >
                  <span className="text-sm text-text-secondary">
                    {profileImage ? '다른 사진 선택' : '📷 사진 업로드'}
                  </span>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isGenerating}
                  />
                </label>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                사진을 업로드하면 그 사진을 기반으로 일러스트 캐릭터를 만들어드려요!
              </p>
            </div>

            {visitedCells.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  방문한 전시 포스터 (선택)
                </label>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {visitedCells.map((cell) => (
                    <div key={cell.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {cell.museum}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {cell.exhibition}
                        </p>
                      </div>
                      {exhibitionImagePreviews[cell.id] && (
                        <div className="relative w-12 h-12 rounded overflow-hidden border border-gray-300 flex-shrink-0">
                          <Image
                            src={exhibitionImagePreviews[cell.id]}
                            alt="전시 포스터"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <label
                        htmlFor={`exhibition-${cell.id}`}
                        className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 flex-shrink-0"
                      >
                        {exhibitionImages[cell.id] ? '변경' : '추가'}
                        <input
                          id={`exhibition-${cell.id}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleExhibitionImageUpload(cell.id, e)}
                          className="hidden"
                          disabled={isGenerating}
                        />
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  전시 포스터를 추가하면 더 정확한 이미지를 생성할 수 있어요!
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-text-secondary">
                AI가 당신의 미술 관람 성향을 분석하여 <br />
                당신을 표현하는 이미지와 설명을 생성합니다.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-6 py-3 bg-bg-primary text-white font-bold rounded-lg hover:bg-bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? '생성 중... (30초 정도 소요됩니다)' : '생성하기'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={result.imageUrl}
                alt={`${nickname}의 프로필 이미지`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
{/* 
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg text-text-primary mb-2">
                {nickname}님은요...
              </h3>
              <p className="text-text-secondary whitespace-pre-wrap">
                {result.description}
              </p>
            </div> */}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = result.imageUrl;
                  link.download = `${nickname}_프로필.png`;
                  link.click();
                }}
                className="flex-1 px-6 py-3 bg-accent text-text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors"
              >
                이미지 저장
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-text-primary font-bold rounded-lg hover:bg-gray-300 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

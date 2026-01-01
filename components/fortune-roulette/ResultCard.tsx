'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Artist } from '@/lib/artists';
import { generateShareImage, downloadImage, shareToClipboard } from '@/lib/shareUtils';

interface ResultCardProps {
  artist: Artist;
  onClose: () => void;
}

export default function ResultCard({ artist, onClose }: ResultCardProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [nickname, setNickname] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(false);

  // 로컬스토리지에서 닉네임 가져오기
  useEffect(() => {
    const savedNickname = localStorage.getItem('artbingo-nickname');
    setNickname(savedNickname);
  }, []);

  // 이미지 존재 여부 확인
  useEffect(() => {
    if (artist.id) {
      const img = new window.Image();
      img.src = `/images/fortune/${artist.id}.jpg`;
      img.onload = () => setHasImage(true);
      img.onerror = () => setHasImage(false);
    }
  }, [artist.id]);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const blob = await generateShareImage(artist);
      if (blob) {
        downloadImage(blob, `fortune-2026-${artist.englishName.replace(/\s+/g, '-')}.png`);
        setShareMessage('이미지가 다운로드되었습니다! 📸');
      } else {
        setShareMessage('이미지 생성에 실패했습니다 😢');
      }
    } catch (error) {
      setShareMessage('이미지 생성에 실패했습니다 😢');
    } finally {
      setTimeout(() => {
        setIsSharing(false);
        setShareMessage('');
      }, 2000);
    }
  };

  const handleCopyText = async () => {
    const success = await shareToClipboard(artist);
    if (success) {
      setShareMessage('텍스트가 복사되었습니다! 📋');
      setTimeout(() => setShareMessage(''), 2000);
    }
  };

  const fortuneText = artist.fortuneText || `${artist.koreanName}의 예술 세계처럼, 2026년 당신의 삶도 독특하고 아름다운 작품이 될 것입니다. 자신만의 색깔로 한 해를 채워가세요.`;
  const keywords = artist.keywords || ['예술', '개성', '아름다움'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pb-20 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative max-w-md w-full bg-gradient-to-br from-[#FFF8E7] to-[#FFE7CC] rounded-2xl shadow-2xl p-8 border-4 border-[#FFD700] animate-scaleIn my-4">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-md transition-all hover:scale-110 z-10"
          aria-label="닫기"
        >
          <span className="text-gray-600 text-xl font-bold">×</span>
        </button>

        {/* 데코레이션 */}
        <div className="absolute top-4 left-4 text-2xl">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl">🔥</div>
        <div className="absolute bottom-4 right-4 text-2xl">🔥</div>

        {/* 헤더 */}
        <div className="text-center mb-2">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#E63946] to-[#9D0208] rounded-full mb-4">
            <h2 className="text-white font-bold text-sm">
              🐴 2026 병오년 {nickname ? `${nickname}님의` : '당신의'} 예술가 🐴
            </h2>
          </div>
        </div>

        {/* 예술가 정보 */}
        <div className="mb-2 text-center">
          <div className="mb-4 p-4 bg-white/50 rounded-xl">
            <h3 className="text-2xl font-bold text-[#9D0208] mb-1">
              🎨 {artist.koreanName}
            </h3>
            <p className="text-sm text-gray-600">
              {artist.englishName}
            </p>
          </div>
        </div>

        {/* 예술가 이미지 */}
        {hasImage && artist.id && (
          <div className="mb-4 relative w-full aspect-video rounded-xl overflow-hidden border-4 border-[#FFD700]">
            <Image
              src={`/images/fortune/${artist.id}.jpg`}
              alt={artist.koreanName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
        )}

        {/* 운세 */}
        <div className="mb-6">
          <div className="bg-white/70 rounded-xl p-5 border-2 border-[#FFD700]">
            <h4 className="text-center font-bold text-[#E63946] mb-4 text-lg">
              ✦ 2026년 {nickname ? `${nickname}님의` : '당신의'} 운세 ✦
            </h4>
            <div className="text-gray-800 leading-relaxed text-left text-lg font-medium space-y-3">
              {fortuneText.split('.').filter(sentence => sentence.trim()).map((sentence, index) => (
                <p key={index}>{sentence.trim()}.</p>
              ))}
            </div>
          </div>
        </div>

        {/* 키워드 */}
        <div className="mb-6">
          <div className="flex gap-2 justify-center flex-wrap">
            {keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFBE0B] rounded-full text-lg font-bold text-[#1A1A1A]"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 공유 메시지 */}
        {shareMessage && (
          <div className="mb-4 text-center py-2 bg-green-100 border-2 border-green-500 rounded-lg text-green-700 font-bold animate-fadeIn">
            {shareMessage}
          </div>
        )}

        {/* 버튼 */}
        <div className="space-y-2 mb-4">
          {/* <button
            onClick={handleShare}
            disabled={isSharing}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#E63946] to-[#9D0208] text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50"
          >
            {isSharing ? '생성 중...' : '📸 이미지로 저장'}
          </button> */}
          {/* <button
            onClick={handleCopyText}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFBE0B] text-[#1A1A1A] rounded-lg font-bold hover:shadow-lg transition-shadow"
          >
            📋 텍스트 복사
          </button> */}
        </div>

        {/* <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-white border-2 border-[#E63946] text-[#E63946] rounded-lg font-bold hover:bg-[#E63946] hover:text-white transition-colors"
        >
          다시하기
        </button> */}

        {/* 푸터 */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Art Friends × 2026 병오년
        </div>
      </div>
    </div>
  );
}

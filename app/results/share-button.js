'use client';

import { useState } from 'react';
import styles from './share-button.module.css';

export default function ShareButton({ type, nickname }) {
  const [showToast, setShowToast] = useState(false);
  
  const handleShare = async () => {
    // 공유할 텍스트 생성
    let shareText = '';
    if (nickname) {
      shareText = `${nickname}님의 미술 감상 유형은 ${type}입니다! 당신의 미술 감상 유형도 알아보세요.`;
    } else {
      shareText = `나의 미술 감상 유형은 ${type}입니다! 당신의 미술 감상 유형도 알아보세요.`;
    }

    // URL에 type과 nickname만 포함 (encodeURIComponent 사용)
    const shareUrl = `${window.location.origin}/results?type=${encodeURIComponent(type)}${nickname ? `&nickname=${encodeURIComponent(nickname)}` : ''}`;
    
    // 공유 기능 지원 여부 확인
    if (navigator.share) {
      try {
        await navigator.share({
          title: '미술 감상 유형 테스트 결과',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        // 사용자가 공유를 취소한 경우 (AbortError)는 에러 로그를 출력하지 않음
        if (error.name !== 'AbortError') {
          console.error('공유 실패:', error);
          
          // 공유 API 실패 시 클립보드로 대체
          try {
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
          } catch (clipboardError) {
            console.error('클립보드 복사 실패:', clipboardError);
          }
        }
      }
    } else {
      // 공유 API가 지원되지 않는 경우 클립보드에 복사
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        // 토스트 메시지 표시
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
      }
    }
  };
  
  return (
    <>
      <button className={styles.shareButton} onClick={handleShare}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.shareIcon}>
          <circle cx="18" cy="5" r="3"></circle>
          <circle cx="6" cy="12" r="3"></circle>
          <circle cx="18" cy="19" r="3"></circle>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
        결과 공유하기
      </button>
      
      {showToast && (
        <div className={styles.toast}>
          클립보드에 복사되었습니다!
        </div>
      )}
    </>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './personality.module.css';
import { artworks } from '@/data/artworks';
import { determinePersonalityType } from '@/components/personality';
import Image from 'next/image';
import NicknameModal from '@/components/NicknameModal';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, setDoc, runTransaction, increment } from 'firebase/firestore';

export default function PersonalityPageClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(Array(artworks.length).fill(null));
  const [testCompleted, setTestCompleted] = useState(false);
  const [personalityType, setPersonalityType] = useState(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  // Check for saved progress on component mount
  useEffect(() => {
    const savedResponses = sessionStorage.getItem('artworkResponses');
    // Only restore if we have incomplete responses
    if (savedResponses) {
      const parsedResponses = JSON.parse(savedResponses);
      // Find the first null response to set as current question
      const nextQuestionIndex = parsedResponses.findIndex(r => r === null);
      if (nextQuestionIndex !== -1) {
        setCurrentQuestion(nextQuestionIndex);
        setResponses(parsedResponses);
      } else {
        // All questions were answered, but we're back here - let's start over
        sessionStorage.removeItem('artworkResponses');
      }
    }
  }, []);

  // 선택지 선택 시 처리
  const handleSelection = (optionId) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = optionId;
    setResponses(newResponses);

    // Save progress to sessionStorage
    sessionStorage.setItem('artworkResponses', JSON.stringify(newResponses));

    // 다음 질문으로 이동 또는 결과 표시
    if (currentQuestion < artworks.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 모든 질문에 답했으면 결과 계산
      const type = determinePersonalityType(newResponses);
      setPersonalityType(type);
      setTestCompleted(true);

      // 로컬스토리지에 닉네임이 있는지 확인
      const savedNickname = localStorage.getItem('artbingo-nickname');
      if (savedNickname) {
        // 닉네임이 이미 있으면 바로 저장하고 결과 페이지로 이동
        // type을 직접 전달 (state가 아직 업데이트되지 않았을 수 있음)
        saveResultsAndRedirectWithType(savedNickname, type, newResponses);
      } else {
        // 닉네임이 없으면 모달 표시
        setShowNicknameModal(true);
      }
    }
  };

  // 결과 저장 및 결과 페이지로 이동 처리 (type과 responses를 직접 받음)
  const saveResultsAndRedirectWithType = async (nickname, type, selectedResponses) => {
    setIsSubmitting(true);
    try {
      // Firebase에 결과 저장
      const timestamp = new Date();
      await addDoc(collection(db, 'personalityResults'), {
        nickname: nickname || 'anonymous',
        personalityType: type,
        selectedArtworks: selectedResponses,
        timestamp
      });

      // 통계 업데이트
      await updateStatistics(selectedResponses, type);

      // 결과 페이지로 이동
      if (nickname) {
        router.push(`/results?type=${type}&nickname=${nickname}`);
      } else {
        router.push(`/results?type=${type}`);
      }

    } catch (error) {
      console.error('Error submitting personality results:', error);
      alert('결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  // 통계 업데이트 함수
  const updateStatistics = async (selectedArtworks, type) => {
    try {
      // 아트워크 선택 통계 업데이트
      const artworkStatsRef = doc(db, 'statistics', 'artworkSelections');
      
      // 트랜잭션으로 아트워크 선택 통계 업데이트
      await runTransaction(db, async (transaction) => {
        const artworkStatsDoc = await transaction.get(artworkStatsRef);
        
        if (!artworkStatsDoc.exists()) {
          // 문서가 없으면 생성
          transaction.set(artworkStatsRef, { 
            selections: {} 
          });
        }
        
        // 각 선택된 작품에 대해 카운트 증가
        selectedArtworks.forEach(artworkId => {
          if (artworkId) {
            transaction.update(artworkStatsRef, {
              [`selections.${artworkId}`]: increment(1)
            });
          }
        });
      });
      
      // 성격 유형 통계 업데이트
      const personalityStatsRef = doc(db, 'statistics', 'personalityTypes');
      
      // 트랜잭션으로 성격 유형 통계 업데이트
      await runTransaction(db, async (transaction) => {
        const personalityStatsDoc = await transaction.get(personalityStatsRef);
        
        if (!personalityStatsDoc.exists()) {
          // 문서가 없으면 생성
          transaction.set(personalityStatsRef, { 
            types: {} 
          });
        }
        
        // 해당 성격 유형 카운트 증가
        transaction.update(personalityStatsRef, {
          [`types.${type}`]: increment(1)
        });
      });
      
      console.log('통계가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('통계 업데이트 중 오류 발생:', error);
      // 통계 업데이트 실패해도 사용자 경험에 영향을 주지 않도록 에러를 삼킴
    }
  };

  // 결과 저장 및 결과 페이지로 이동 처리
  const saveResultsAndRedirect = async (nickname = '') => {
    setIsSubmitting(true);
    try {
      // Firebase에 결과 저장 (닉네임이 없어도 저장)
      const timestamp = new Date();
      await addDoc(collection(db, 'personalityResults'), {
        nickname: nickname || 'anonymous', // 닉네임이 없으면 'anonymous'로 저장
        personalityType,
        selectedArtworks: responses,
        timestamp
      });
      
      // 통계 업데이트
      await updateStatistics(responses, personalityType);
      
      // 닉네임 모달 닫기
      setShowNicknameModal(false);
      
      // 결과 페이지로 이동 (닉네임이 있으면 포함, 없으면 제외)
      if (nickname) {
        router.push(`/results?type=${personalityType}&nickname=${nickname}`);
      } else {
        router.push(`/results?type=${personalityType}`);
      }
      
    } catch (error) {
      console.error('Error submitting personality results:', error);
      alert('결과 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  // 닉네임 제출 처리
  const handleNicknameSubmit = async (nickname) => {
    // 로컬스토리지에 닉네임 저장
    localStorage.setItem('artbingo-nickname', nickname);
    await saveResultsAndRedirect(nickname);
  };

  // 닉네임 모달 닫기 처리 (닉네임 없이 저장하고 결과 페이지로 이동)
  const handleModalClose = () => {
    saveResultsAndRedirect(); // 닉네임 없이 저장
  };

  // 테스트가 완료되면 닉네임 모달만 표시
  if (testCompleted) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-fuchsia-900 mb-4">테스트가 완료되었습니다!</h2>
          <p className="text-gray-600 mb-6">결과를 확인하기 전에 닉네임을 입력해주세요. 닉네임은 선택사항입니다.</p>
          <button
            onClick={() => setShowNicknameModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium rounded-md hover:from-fuchsia-600 hover:to-purple-700"
          >
            닉네임 입력하기
          </button>
        </div>
        
        {/* 닉네임 입력 모달 */}
        <NicknameModal 
          isOpen={showNicknameModal} 
          onClose={handleModalClose} 
          onSubmit={handleNicknameSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  // 질문 진행 상태를 보여주는 프로그레스 바
  const progress = ((currentQuestion + 1) / artworks.length) * 100;
  
  // 현재 질문 정보
  const currentArtwork = artworks[currentQuestion];

  return (
    <div className="min-h-screen py-2 px-4 max-w-5xl mx-auto">
    <div className="mb-12 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white">미술 작품으로 성격 테스트</h1>
      
      {/* 진행 상태 표시 */}
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className={styles.questionNumber}>
        질문 {currentQuestion + 1}/{artworks.length}
      </p>
      <p className={styles.instruction}>
        더 끌리는 작품을 선택해 주세요
      </p>
      
      <div className={styles.optionsGrid}>
        {currentArtwork.options.map((option, index) => (
          <div 
            key={option.id}
            onClick={() => handleSelection(option.id)}
            className={styles.optionCard}
          >
            <div className={styles.imageContainer}>
            {option.image ? (
              // When there's an image available
              <Image
                src={option.image}
                alt={`${option.title} by ${option.artist}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.optionImage}
                priority={index < 2} // Prioritize loading first few images
              />
            ) : (
              // When there's no image available, show the placeholder
              <div className={styles.imagePlaceholder}>
                <p className={styles.artworkTitle}>{option.title}</p>
                <p className={styles.artistName}>by {option.artist}</p>
              </div>
            )}
            </div>
            <div className={styles.optionInfo}>
              <h3 className={styles.artworkTitle}>{option.title}</h3>
              <p className={styles.artistName}>{option.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
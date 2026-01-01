'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { personalityTypes } from '@/data/personalityTypes';
import styles from './results.module.css';
import ShareButton from './share-button';

export default function ResultsPageClient({ searchParams: initialSearchParams }) {
  const searchParams = useSearchParams();
  const [type, setType] = useState(null);
  const [result, setResult] = useState(null);
  const [nickname, setNickname] = useState('');
  
  useEffect(() => {
    // 서버에서 전달받은 초기 searchParams가 있으면 사용하고, 없으면 useSearchParams 훅 사용
    const typeParam = initialSearchParams?.type || searchParams.get('type');
    const nicknameParam = initialSearchParams?.nickname || searchParams.get('nickname');
    
    if (typeParam && personalityTypes[typeParam]) {
      setType(typeParam);
      setResult(personalityTypes[typeParam]);
    }
    
    if (nicknameParam) {
      setNickname(nicknameParam);
    }
  }, [searchParams, initialSearchParams]);
  
  // 유형이 없으면 로딩 상태 또는 오류 메시지 표시
  if (!type || !result) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h1 className={styles.title}>결과를 찾을 수 없습니다</h1>
          <p className={styles.description}>테스트를 다시 시작해주세요.</p>
          <Link href="/personality">
            <button className={styles.button}>테스트 다시 하기</button>
          </Link>
        </div>
      </div>
    );
  }
  
  // 유형별 대표 이미지 경로
  const typeImagePath = `/images/art-types/${type.toLowerCase()}.jpg`;
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>미술 감상 유형은:</h1>
      
      <div className={styles.resultCard}>
        <div className={styles.resultHeader}>
        <h2 className={styles.resultTitle}>
         {nickname ? `${nickname}님은 ${result.name}` : result.name}
        </h2>
        </div>
        
        <div className={styles.resultContent}>
          <div className={styles.imageContainer}>
            <Image 
              src={typeImagePath}
              alt={`${result.name} 대표 이미지`}
              width={400}
              height={600}
              className={styles.typeImage}
              priority
            />
          </div>
          
          <div className={styles.infoContainer}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>성격적 특징</h3>
              <ul className={styles.traitsList}>
                <li>{result.personality.trait1}</li>
                <li>{result.personality.trait2}</li>
                <li>{result.personality.trait3}</li>
                <li>{result.personality.trait4}</li>
              </ul>
            </section>
            
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>미술관 관람 스타일</h3>
              <ul className={styles.traitsList}>
                <li>{result.viewingStyle.style1}</li>
                <li>{result.viewingStyle.style2}</li>
                <li>{result.viewingStyle.style3}</li>
                <li>{result.viewingStyle.style4}</li>
              </ul>
            </section>
            
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>추천 미술 여행지</h3>
              <ul className={styles.traitsList}>
                <li>{result.recommendedTravel.place1}</li>
                <li>{result.recommendedTravel.place2}</li>
                <li>{result.recommendedTravel.place3}</li>
                <li>{result.recommendedTravel.place4}</li>
              </ul>
            </section>
            
            {/* <section className={styles.section}>
              <h3 className={styles.sectionTitle}>선호 작가/작품</h3>
              <p className={styles.artistsList}>{result.preferredArtists}</p>
            </section> */}
          </div>
        </div>
        
        <div className={styles.buttonsContainer}>
          <Link href="/personality">
            <button className={styles.button}>테스트 다시 하기</button>
          </Link>
          
          <ShareButton type={type} nickname={nickname} />
        </div>
      </div>
      
      <div className={styles.navigation}>
        <Link href="/personality-types" className={styles.link}>
          모든 유형 보기
        </Link>
      </div>
    </div>
  );
}
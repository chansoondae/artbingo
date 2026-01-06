'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from './../../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './type.module.css';

export default function PersonalityTypeClient({ type, personalityType, typeImages }) {
  const [statistics, setStatistics] = useState({ count: 0, percentage: 0 });

  // 통계 데이터 가져오기
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const statsRef = doc(db, 'statistics', 'personalityTypes');
        const statsDoc = await getDoc(statsRef);

        if (statsDoc.exists()) {
          const data = statsDoc.data();
          const types = data.types || {};

          // 현재 유형의 카운트
          const currentTypeCount = types[type] || 0;

          // 전체 카운트 계산
          const totalCount = Object.values(types).reduce((sum, count) => sum + count, 0);

          // 비율 계산 (전체가 0이면 0%)
          const percentage = totalCount > 0 ? (currentTypeCount / totalCount) * 100 : 0;

          setStatistics({
            count: currentTypeCount,
            percentage: percentage.toFixed(1)
          });
        }
      } catch (error) {
        console.error('통계 데이터 가져오기 오류:', error);
      }
    };

    fetchStatistics();
  }, [type]);

  if (!personalityType) {
    return <div className={styles.container}>유형을 찾을 수 없습니다.</div>;
  }

  // preferredArtists를 배열로 변환
  const preferredArtworks = personalityType.preferredArtists
    .split(',')
    .map(art => art.trim());

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{personalityType.name}</h1>
        <p className={styles.typeCode}>{type}</p>
      </div>

      <div className={styles.imageContainer}>
        {typeImages[type] && (
          <Image
            src={typeImages[type]}
            alt={`${personalityType.name} 이미지`}
            width={400}
            height={600}
            className={styles.coverImage}
          />
        )}
      </div>

      <div className={styles.statsCard}>
        <h3 className={styles.statsTitle}>통계</h3>
        <p className={styles.statsText}>이 유형의 사람: <strong>{statistics.count}명</strong></p>
        <p className={styles.statsText}>전체 중 비율: <strong>{statistics.percentage}%</strong></p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>성격 특성</h2>
          <ul className={styles.list}>
            <li>{personalityType.personality.trait1}</li>
            <li>{personalityType.personality.trait2}</li>
            <li>{personalityType.personality.trait3}</li>
            <li>{personalityType.personality.trait4}</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>미술 감상 스타일</h2>
          <ul className={styles.list}>
            <li>{personalityType.viewingStyle.style1}</li>
            <li>{personalityType.viewingStyle.style2}</li>
            <li>{personalityType.viewingStyle.style3}</li>
            <li>{personalityType.viewingStyle.style4}</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>추천 여행지</h2>
        <ul className={styles.list}>
          <li>{personalityType.recommendedTravel.place1}</li>
          <li>{personalityType.recommendedTravel.place2}</li>
          <li>{personalityType.recommendedTravel.place3}</li>
          <li>{personalityType.recommendedTravel.place4}</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>선호하는 작품</h2>
        <div className={styles.artworkList}>
          {preferredArtworks.map((artwork, index) => (
            <div key={index} className={styles.artworkItem}>
              {artwork}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.navigation}>
        <Link href="/personality-types">
          <button className={styles.button}>모든 유형 보기</button>
        </Link>
      </div>
    </div>
  );
}

'use client';
//app/personality-types/page.js

import Link from 'next/link';
import Image from 'next/image';
import { personalityTypes } from './../../data/personalityTypes';
import styles from './personality-types.module.css';

export default function AllPersonalityTypesPage() {
  // 각 성격 유형별 대표 이미지
  const typeImages = {
    "ESTJ": "/images/art-types/estj.jpg",
    "ESTP": "/images/art-types/estp.jpg",
    "ESFJ": "/images/art-types/esfj.jpg",
    "ESFP": "/images/art-types/esfp.jpg",
    "ENTJ": "/images/art-types/entj.jpg",
    "ENTP": "/images/art-types/entp.jpg",
    "ENFJ": "/images/art-types/enfj.jpg",
    "ENFP": "/images/art-types/enfp.jpg",
    "ISTJ": "/images/art-types/istj.jpg",
    "ISTP": "/images/art-types/istp.jpg",
    "ISFJ": "/images/art-types/isfj.jpg",
    "ISFP": "/images/art-types/isfp.jpg",
    "INTJ": "/images/art-types/intj.jpg",
    "INTP": "/images/art-types/intp.jpg",
    "INFJ": "/images/art-types/infj.jpg",
    "INFP": "/images/art-types/infp.jpg"
  };

  // personality의 첫 번째 특성을 짧게 보여주기 위한 함수
  const getShortDescription = (type) => {
    return personalityTypes[type].personality.trait1.substring(0, 50) + '...';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>미술 감상 유형 16가지</h1>
      
      <div className={styles.grid}>
        {Object.entries(personalityTypes).map(([type, details]) => (
          <Link href={`/personality-types/${type}`} key={type} className={styles.cardLink}>
            <div className={styles.card}>
              <div className={styles.imageContainer}>
                {typeImages[type] && (
                  <Image 
                    src={typeImages[type]}
                    alt={`${details.name} 이미지`}
                    width={180}
                    height={280}
                    className={styles.cardImage}
                  />
                )}
              </div>
              <h2 className={styles.cardTitle}>{details.name}</h2>
              <p className={styles.cardType}>{type}</p>
              <p className={styles.cardDescription}>{getShortDescription(type)}</p>
              <p className={styles.preferredArt}>
                <strong>선호 작품:</strong> {details.preferredArtists.split(',')[0]}
              </p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className={styles.navigation}>
        <Link href="/">
          <button className={styles.button}>홈으로 돌아가기</button>
        </Link>
      </div>
    </div>
  );
}
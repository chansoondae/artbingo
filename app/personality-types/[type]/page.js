import { personalityTypes } from './../../../data/personalityTypes';
import PersonalityTypeClient from './PersonalityTypeClient';

// 성격 유형별 대표 이미지
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

// 동적 메타데이터 생성
export async function generateMetadata({ params }) {
  const { type } = await params;
  const personalityType = personalityTypes[type];

  if (!personalityType) {
    return {
      title: '성격 유형을 찾을 수 없습니다',
    };
  }

  return {
    title: `${personalityType.name} (${type}) | 미술 성격 유형`,
    description: `${personalityType.name} 유형의 성격 특성, 미술 감상 스타일, 추천 여행지를 확인해보세요.`,
    keywords: `${type}, ${personalityType.name}, 미술 성격 테스트, 미술 감상 유형, MBTI`,
    openGraph: {
      title: `${personalityType.name} (${type})`,
      description: `${personalityType.name} 유형의 미술 감상 스타일과 성격 특성`,
      images: [
        {
          url: typeImages[type] || '/images/art-types/default.jpg',
          width: 400,
          height: 600,
          alt: `${personalityType.name} 이미지`,
        },
      ],
      locale: 'ko_KR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${personalityType.name} (${type})`,
      description: `${personalityType.name} 유형의 미술 감상 스타일`,
      images: [typeImages[type] || '/images/art-types/default.jpg'],
    },
  };
}

// 서버 컴포넌트
export default async function PersonalityTypeDetailPage({ params }) {
  const { type } = await params;
  const personalityType = personalityTypes[type];

  return (
    <PersonalityTypeClient
      type={type}
      personalityType={personalityType}
      typeImages={typeImages}
    />
  );
}

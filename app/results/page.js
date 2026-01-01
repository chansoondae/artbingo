// app/results/page.js

import { Suspense } from 'react';
import ResultsPageClient from './ResultsPageClient';
import { personalityTypes } from '@/data/personalityTypes';

// 동적 메타데이터 생성 함수 (서버 컴포넌트에서만 사용 가능)
export async function generateMetadata({ searchParams }) {
  // searchParams를 await로 unwrap
  const unwrappedParams = await searchParams;
  const { type, nickname } = unwrappedParams;
  
  const personalityType = type && personalityTypes[type];
  
  // 유효하지 않은 유형인 경우 기본 메타데이터 반환
  if (!personalityType) {
    return {
      title: '테스트 결과 | Art Personality',
      description: '미술 작품으로 알아본 당신의 성격 유형 결과입니다.',
    };
  }

  const displayName = nickname ? `${nickname}님은` : '당신은';
  
  return {
    title: `${displayName} ${personalityType.name} 유형입니다 | Art Personality`,
    description: `미술 작품 선택을 통해 알아본 결과, ${displayName} ${personalityType.name} 유형입니다. 이 유형의 특징과 미술 감상 스타일을 알아보세요.`,
    keywords: `${personalityType.name}, ${type}, 미술 성격 테스트 결과, 미술 감상 유형, 예술 심리 테스트`,
    openGraph: {
      title: `${displayName} ${personalityType.name} 유형입니다`,
      description: `미술 작품 선택 테스트 결과, ${displayName} ${personalityType.name} 유형입니다. 이 유형의 특징을 확인해보세요.`,
      images: [
        {
          url: `/images/art-types/${type.toLowerCase()}.jpg`,
          width: 1200,
          height: 630,
          alt: `${personalityType.name} 미술 감상 유형`,
        },
      ],
      locale: 'ko_KR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${displayName} ${personalityType.name} 유형입니다 | Art Personality`,
      description: `미술 작품 선택 테스트 결과입니다. 이 유형의 특징과 미술 감상 스타일을 알아보세요.`,
      images: [`/images/art-types/${type.toLowerCase()}.jpg`],
    },
  };
}

// 로딩 UI 컴포넌트
function ResultsLoading() {
  return <div className="text-center p-8">결과 불러오는 중...</div>;
}

// 서버 컴포넌트 페이지
export default async function ResultsPage({ searchParams }) {
  // 여기도 searchParams를 await로 처리
  const unwrappedParams = await searchParams;
  
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsPageClient searchParams={unwrappedParams} />
    </Suspense>
  );
}
// app/personality/page.js

import PersonalityPageClient from './PersonalityPageClient';

// 정적 메타데이터 설정
export const metadata = {
  title: '미술 작품으로 알아보는 성격 테스트 | Art Personality',
  description: '다양한 미술 작품 선택을 통해 당신의 성격 유형을 알아보세요. 16가지 미술 감상 유형 중 어떤 유형인지 테스트해보세요.',
  keywords: '미술 성격 테스트, 예술 성향 테스트, MBTI, 미술 감상 유형, 미술 심리 테스트',
  openGraph: {
    title: '미술 작품으로 알아보는 성격 테스트',
    description: '당신의 미술 감상 스타일은 어떤 유형인가요? 작품 선택을 통해 알아보세요.',
    images: [
      {
        url: '/images/personality-test.jpg',
        width: 1200,
        height: 630,
        alt: '미술 작품 성격 테스트 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '미술 작품으로 알아보는 성격 테스트 | Art Personality',
    description: '작품 선택을 통해 당신의 미술 감상 스타일을 발견하세요.',
    images: ['/images/personality-test.jpg'],
  },
};

// 서버 컴포넌트 페이지
export default function PersonalityPage() {
  return <PersonalityPageClient />;
}
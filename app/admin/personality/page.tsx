'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { personalityTypes } from '@/data/personalityTypes';
import Link from 'next/link';

interface PersonalityResult {
  id: string;
  nickname: string;
  personalityType: string;
  selectedArtworks: string[];
  timestamp: Date | any;
}

interface PersonalityTypeCount {
  [key: string]: number;
}

export default function PersonalityStatsPage() {
  const [results, setResults] = useState<PersonalityResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personalityTypeStats, setPersonalityTypeStats] = useState<PersonalityTypeCount>({});
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [displayCount, setDisplayCount] = useState(20);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      setLoading(true);
      // personalityResults 컬렉션에서 시간 역순으로 데이터 조회
      const resultsQuery = query(
        collection(db, 'personalityResults'),
        orderBy('timestamp', 'desc')
      );

      const querySnapshot = await getDocs(resultsQuery);
      const resultsList: PersonalityResult[] = [];
      const typeCount: PersonalityTypeCount = {};

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const personalityType = data.personalityType;

        // 성격 유형 카운트 증가
        if (personalityType) {
          typeCount[personalityType] = (typeCount[personalityType] || 0) + 1;
        }

        resultsList.push({
          id: doc.id,
          nickname: data.nickname,
          personalityType: data.personalityType,
          selectedArtworks: data.selectedArtworks,
          // Firestore Timestamp를 JavaScript Date로 변환
          timestamp: data.timestamp?.toDate?.() || data.timestamp
        });
      });

      setResults(resultsList);
      setPersonalityTypeStats(typeCount);
      setTotalParticipants(resultsList.length);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('결과를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    fetchResults();
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  // 성격 유형을 정렬해서 가져오는 함수
  const sortedPersonalityTypes = Object.entries(personalityTypeStats).sort((a, b) => b[1] - a[1]);

  // 타임스탬프 포맷 함수
  function formatDate(timestamp: any) {
    if (!timestamp) return '날짜 없음';

    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

    if (isNaN(date.getTime())) return '유효하지 않은 날짜';

    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // 답변 배열을 텍스트로 변환하는 함수
  function formatResponses(responses: string[]) {
    if (!responses || !Array.isArray(responses)) return '답변 데이터 없음';

    return responses.map((response, index) =>
      `Q${index + 1}: ${response || '응답 없음'}`
    ).join(', ');
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <p className="text-white/70">로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Personality Stats</h1>
            <p className="text-white/60 mt-1">MBTI 기반 미술 감상 성향 분석</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? '로딩 중...' : '새로고침'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Total Participants */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            📊 전체 통계
          </h2>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-white/70 text-sm">총 참여자</p>
            <p className="text-3xl font-bold text-white">{totalParticipants}명</p>
          </div>
        </div>

        {/* Personality Type Distribution */}
        {sortedPersonalityTypes.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎭 성격 유형별 분포
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="px-4 py-3 text-left text-white/80 font-medium">성격 유형</th>
                    <th className="px-4 py-3 text-left text-white/80 font-medium">이름</th>
                    <th className="px-4 py-3 text-center text-white/80 font-medium">인원</th>
                    <th className="px-4 py-3 text-center text-white/80 font-medium">비율</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPersonalityTypes.map(([type, count]) => (
                    <tr key={type} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-purple-300">{type}</span>
                      </td>
                      <td className="px-4 py-3 text-white/90">
                        {(personalityTypes as any)[type]?.name || '알 수 없는 유형'}
                      </td>
                      <td className="px-4 py-3 text-center text-white font-bold">{count}명</td>
                      <td className="px-4 py-3 text-center text-white/80">
                        {totalParticipants > 0 ? ((count / totalParticipants) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Individual Results */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            📝 개인별 결과 목록 ({results.length})
          </h2>

          {!loading && results.length === 0 && (
            <p className="text-white/60 text-center py-8">아직 결과 데이터가 없습니다.</p>
          )}

          {!loading && results.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="py-3 px-4 text-left text-white/80 font-medium">번호</th>
                      <th className="py-3 px-4 text-left text-white/80 font-medium">닉네임</th>
                      <th className="py-3 px-4 text-left text-white/80 font-medium">성격 유형</th>
                      <th className="py-3 px-4 text-left text-white/80 font-medium">제출 시간</th>
                      <th className="py-3 px-4 text-left text-white/80 font-medium">답변</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, displayCount).map((result, index) => (
                      <tr key={result.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">{index + 1}</td>
                        <td className="py-3 px-4 text-white">{result.nickname || '익명'}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-purple-300">{result.personalityType || '알 수 없음'}</span>
                        </td>
                        <td className="py-3 px-4 text-white/80 text-sm">{formatDate(result.timestamp)}</td>
                        <td className="py-3 px-4">
                          <details className="cursor-pointer">
                            <summary className="text-blue-400 hover:text-blue-300 text-sm">
                              답변 보기
                            </summary>
                            <div className="mt-2 p-2 bg-white/5 rounded text-xs text-white/70">
                              {formatResponses(result.selectedArtworks)}
                            </div>
                          </details>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {displayCount < results.length && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-6 py-3 bg-purple-500/30 hover:bg-purple-500/40 text-white rounded-lg transition-colors font-medium"
                  >
                    더보기 ({displayCount} / {results.length})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Link from 'next/link';
import { personalityTypes } from './../../data/personalityTypes';

export default function PersonalityStatPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personalityTypeStats, setPersonalityTypeStats] = useState({});
  const [totalParticipants, setTotalParticipants] = useState(0);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        // personalityResults 컬렉션에서 시간 역순으로 데이터 조회
        const resultsQuery = query(
          collection(db, 'personalityResults'),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(resultsQuery);
        const resultsList = [];
        const typeCount = {};
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const personalityType = data.personalityType;
          
          // 성격 유형 카운트 증가
          if (personalityType) {
            typeCount[personalityType] = (typeCount[personalityType] || 0) + 1;
          }
          
          resultsList.push({
            id: doc.id,
            ...data,
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
    
    fetchResults();
  }, []);

  // 성격 유형을 정렬해서 가져오는 함수
  const sortedPersonalityTypes = Object.entries(personalityTypeStats).sort((a, b) => b[1] - a[1]);

  // 타임스탬프 포맷 함수
  function formatDate(timestamp) {
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
  function formatResponses(responses) {
    if (!responses || !Array.isArray(responses)) return '답변 데이터 없음';
    
    return responses.map((response, index) => 
      `Q${index + 1}: ${response || '응답 없음'}`
    ).join(', ');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-fuchsia-900 mb-8">테스트 통계</h1>
      
      <div className="mb-8 text-center">
        <div className="bg-purple-100 p-4 rounded-lg inline-block">
          <h2 className="text-2xl font-semibold text-purple-800">총 참여자</h2>
          <p className="text-3xl font-bold text-fuchsia-700">{totalParticipants}명</p>
        </div>
      </div>
      
      {/* Personality Type Statistics */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-fuchsia-800 mb-4">성격 유형별 분포</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-100">
                <th className="border px-4 py-2 text-left">성격 유형</th>
                <th className="border px-4 py-2 text-left">이름</th>
                <th className="border px-4 py-2 text-center">인원</th>
                <th className="border px-4 py-2 text-center">비율</th>
              </tr>
            </thead>
            <tbody>
              {sortedPersonalityTypes.map(([type, count]) => (
                <tr key={type} className="hover:bg-purple-50">
                  <td className="border px-4 py-2 font-semibold">
                    <Link href={`/personality-types/${type}`} className="text-fuchsia-700 hover:underline">
                      {type}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">
                    {personalityTypes[type]?.name || '알 수 없는 유형'}
                  </td>
                  <td className="border px-4 py-2 text-center">{count}명</td>
                  <td className="border px-4 py-2 text-center">
                    {totalParticipants > 0 ? ((count / totalParticipants) * 100).toFixed(1) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 개인별 상세 결과 섹션 */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-fuchsia-800 mb-4">개인별 결과 목록</h2>
      
        {loading && <p className="text-gray-600">데이터를 불러오는 중...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!loading && results.length === 0 && (
          <p className="text-gray-600">아직 결과 데이터가 없습니다.</p>
        )}
        
        {!loading && results.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-purple-100">
                <tr>
                  <th className="py-2 px-4 border-b text-left">번호</th>
                  <th className="py-2 px-4 border-b text-left">닉네임</th>
                  <th className="py-2 px-4 border-b text-left">성격 유형</th>
                  <th className="py-2 px-4 border-b text-left">제출 시간</th>
                  <th className="py-2 px-4 border-b text-left">답변</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={result.id} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{result.nickname || '익명'}</td>
                    <td className="py-2 px-4 border-b font-medium text-fuchsia-700">{result.personalityType || '알 수 없음'}</td>
                    <td className="py-2 px-4 border-b">{formatDate(result.timestamp)}</td>
                    <td className="py-2 px-4 border-b">
                      <details>
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                          답변 보기
                        </summary>
                        <div className="mt-2 p-2 bg-purple-50 rounded">
                          {formatResponses(result.selectedArtworks)}
                        </div>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
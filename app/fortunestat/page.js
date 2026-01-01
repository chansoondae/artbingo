'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import artistsData from '@/data/artists.json';
import Link from 'next/link';

export default function FortuneStatPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // JSON 데이터를 Artist 형식으로 변환
  const allArtists = artistsData.map((item) => ({
    koreanName: item.한글이름,
    englishName: item.영어이름,
    id: item.id,
    fortuneText: item.운세,
    keywords: item.keywords,
  }));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsRef = doc(db, 'statistics', 'fortuneStats');
        const statsDoc = await getDoc(statsRef);

        if (statsDoc.exists()) {
          setStats(statsDoc.data());
        }
      } catch (error) {
        console.error('통계 데이터 가져오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#E63946] via-[#9D0208] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-white text-2xl">로딩 중...</div>
      </main>
    );
  }

  if (!stats || !stats.totalSpins) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#E63946] via-[#9D0208] to-[#1A1A1A] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">아직 통계 데이터가 없습니다</h1>
          <p className="mb-6">운세 룰렛을 돌려보세요!</p>
          <Link href="/fortune" className="px-6 py-3 bg-[#FFD700] text-[#1A1A1A] rounded-lg font-bold hover:bg-[#FFBE0B] transition-colors">
            운세 보러 가기
          </Link>
        </div>
      </main>
    );
  }

  // 예술가별 통계 계산
  const artistStats = Object.entries(stats.artists || {}).map(([artistId, count]) => {
    const artist = allArtists.find(a => a.id === artistId);
    return {
      id: artistId,
      name: artist ? artist.koreanName : artistId,
      count: count,
      percentage: ((count / stats.totalSpins) * 100).toFixed(2)
    };
  }).sort((a, b) => b.count - a.count);

  // 닉네임별 통계 계산
  const nicknameStats = Object.entries(stats.nicknames || {}).map(([nickname, count]) => {
    return {
      nickname: nickname,
      count: count,
      percentage: ((count / stats.totalSpins) * 100).toFixed(2)
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E63946] via-[#9D0208] to-[#1A1A1A] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFBE0B] to-[#FFD700] mb-4">
            🐴 운세 룰렛 통계
          </h1>
          <Link href="/fortune" className="text-white/80 hover:text-white transition-colors">
            ← 운세로 돌아가기
          </Link>
        </div>

        {/* 전체 통계 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border-2 border-[#FFD700]">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">📊 전체 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">총 시도 횟수</p>
              <p className="text-white text-3xl font-bold">{stats.totalSpins.toLocaleString()}회</p>
            </div>
            <div className="bg-white/20 rounded-xl p-4">
              <p className="text-white/70 text-sm mb-1">등장한 예술가</p>
              <p className="text-white text-3xl font-bold">{artistStats.length}명</p>
            </div>
          </div>
        </div>

        {/* 닉네임별 순위 */}
        {nicknameStats.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-[#E63946] mb-6">👤 닉네임별 시도 순위</h2>
            <div className="space-y-3">
              {nicknameStats.slice(0, 20).map((user, index) => (
                <div
                  key={user.nickname}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                      index === 0 ? 'bg-[#FFD700]' :
                      index === 1 ? 'bg-[#C0C0C0]' :
                      index === 2 ? 'bg-[#CD7F32]' :
                      'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">{user.nickname}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-[#E63946]">{user.count}회</p>
                    <p className="text-sm text-gray-500">{user.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 예술가별 순위 */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#E63946] mb-6">🎨 예술가별 당첨 순위</h2>
          <div className="space-y-3">
            {artistStats.map((artist, index) => (
              <div
                key={artist.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${
                    index === 0 ? 'bg-[#FFD700]' :
                    index === 1 ? 'bg-[#C0C0C0]' :
                    index === 2 ? 'bg-[#CD7F32]' :
                    'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800">{artist.name}</p>
                    <p className="text-sm text-gray-500">{artist.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-[#E63946]">{artist.count}회</p>
                  <p className="text-sm text-gray-500">{artist.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 text-center">
          <Link
            href="/fortune"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFBE0B] text-[#1A1A1A] rounded-lg font-bold text-lg hover:shadow-lg transition-all"
          >
            운세 룰렛 돌리기
          </Link>
        </div>
      </div>
    </main>
  );
}

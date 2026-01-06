'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import artistsData from '@/data/artists.json';

interface Artist {
  koreanName: string;
  englishName: string;
  id: string;
  fortuneText: string;
  keywords: string[];
}

interface ArtistStats {
  id: string;
  name: string;
  count: number;
  percentage: string;
}

interface NicknameStats {
  nickname: string;
  count: number;
  percentage: string;
}

interface FortuneStats {
  totalSpins: number;
  artists: Record<string, number>;
  nicknames: Record<string, number>;
}

export default function FortuneStatsPage() {
  const [stats, setStats] = useState<FortuneStats | null>(null);
  const [loading, setLoading] = useState(true);

  // JSON 데이터를 Artist 형식으로 변환
  const allArtists: Artist[] = artistsData.map((item: any) => ({
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
          setStats(statsDoc.data() as FortuneStats);
        }
      } catch (error) {
        console.error('통계 데이터 가져오기 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const statsRef = doc(db, 'statistics', 'fortuneStats');
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        setStats(statsDoc.data() as FortuneStats);
      }
    } catch (error) {
      console.error('통계 데이터 가져오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!stats || !stats.totalSpins) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Fortune Stats</h1>
              <p className="text-white/60 mt-1">2026 병오년 새해 운세 룰렛 통계</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">아직 통계 데이터가 없습니다</h2>
            <p className="text-white/70">운세 룰렛을 돌려보세요!</p>
          </div>
        </div>
      </div>
    );
  }

  // 예술가별 통계 계산
  const artistStats: ArtistStats[] = Object.entries(stats.artists || {}).map(([artistId, count]) => {
    const artist = allArtists.find(a => a.id === artistId);
    return {
      id: artistId,
      name: artist ? artist.koreanName : artistId,
      count: count as number,
      percentage: ((count as number / stats.totalSpins) * 100).toFixed(2)
    };
  }).sort((a, b) => b.count - a.count);

  // 닉네임별 통계 계산
  const nicknameStats: NicknameStats[] = Object.entries(stats.nicknames || {}).map(([nickname, count]) => {
    return {
      nickname: nickname,
      count: count as number,
      percentage: ((count as number / stats.totalSpins) * 100).toFixed(2)
    };
  }).sort((a, b) => b.count - a.count);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Fortune Stats</h1>
            <p className="text-white/60 mt-1">2026 병오년 새해 운세 룰렛 통계</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            disabled={loading}
          >
            {loading ? '로딩 중...' : '새로고침'}
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            📊 전체 통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm">총 시도 횟수</p>
              <p className="text-3xl font-bold text-white">{stats.totalSpins.toLocaleString()}회</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm">등장한 예술가</p>
              <p className="text-3xl font-bold text-white">{artistStats.length}명</p>
            </div>
          </div>
        </div>

        {/* Nickname Rankings */}
        {nicknameStats.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              👤 닉네임별 시도 순위
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {nicknameStats.slice(0, 20).map((user, index) => {
                const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                return (
                  <div
                    key={user.nickname}
                    className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-white/20 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-lg text-white flex items-center gap-2">
                          {medalEmoji && <span>{medalEmoji}</span>}
                          {user.nickname}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-white">{user.count}회</p>
                      <p className="text-sm text-white/70">{user.percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Artist Rankings */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            🎨 예술가별 당첨 순위
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {artistStats.map((artist, index) => {
              const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
              return (
                <div
                  key={artist.id}
                  className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-600 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-lg text-white flex items-center gap-2">
                        {medalEmoji && <span>{medalEmoji}</span>}
                        {artist.name}
                      </p>
                      <p className="text-sm text-white/60">{artist.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-white">{artist.count}회</p>
                    <p className="text-sm text-white/70">{artist.percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

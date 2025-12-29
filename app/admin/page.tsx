'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RankingData } from '@/lib/types';
import { getBadge } from '@/lib/badge';
import RankingModal from '@/components/RankingModal';
import ExhibitionListModal from '@/components/ExhibitionListModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rankings, setRankings] = useState<RankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [sortedRankings, setSortedRankings] = useState<RankingData[]>([]);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchRankings();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'art1234!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin-auth', 'true');
      fetchRankings();
      setError('');
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin-auth');
    setPassword('');
  };

  const fetchRankings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('rankings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRankings(data || []);

      // Create sorted rankings for modal
      const uniqueRankings = data?.reduce((acc: RankingData[], curr) => {
        if (!acc.find(item => item.nickname === curr.nickname)) {
          acc.push(curr);
        }
        return acc;
      }, []) || [];

      uniqueRankings.sort((a, b) => {
        if (b.visited_count !== a.visited_count) {
          return b.visited_count - a.visited_count;
        }
        return new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime();
      });

      setSortedRankings(uniqueRankings);
    } catch (err) {
      console.error('Failed to fetch rankings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenRankingModal = () => {
    setIsRankingModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-white mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            {error && <p className="text-red-300 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-colors"
            >
              로그인
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={handleOpenRankingModal}
              className="px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              순위 확인하기
            </button>
            <button
              onClick={fetchRankings}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '로딩 중...' : '새로고침'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
          <h2 className="text-xl font-semibold text-white mb-2">
            통계
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm">총 등록 수</p>
              <p className="text-3xl font-bold text-white">{rankings.length}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm">평균 방문 전시</p>
              <p className="text-3xl font-bold text-white">
                {rankings.length > 0
                  ? (rankings.reduce((sum, r) => sum + r.visited_count, 0) / rankings.length).toFixed(1)
                  : 0}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-white/70 text-sm">최다 방문 전시</p>
              <p className="text-3xl font-bold text-white">
                {rankings.length > 0
                  ? Math.max(...rankings.map(r => r.visited_count))
                  : 0}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            전체 랭킹 데이터 ({rankings.length})
          </h2>
          {rankings.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <p className="text-white/70">등록된 데이터가 없습니다.</p>
            </div>
          ) : (
            rankings.map((ranking, index) => {
              const badge = getBadge(ranking.visited_count);
              return (
                <div
                  key={ranking.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-white">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold text-lg">
                            {ranking.nickname}
                          </p>
                          {badge && (
                            <div className={`${badge.color} ${badge.textColor} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                              <span>{badge.icon}</span>
                              <span>{badge.name}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-white/70 text-sm">
                          {new Date(ranking.created_at || ranking.timestamp).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-2xl">
                        {ranking.visited_count}
                      </p>
                      <p className="text-white/70 text-sm">전시 관람</p>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white/90 text-sm font-semibold mb-2">
                      관람한 전시:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {ranking.visited_exhibitions.map((exhibition, idx) => (
                        <div
                          key={idx}
                          className="bg-green-500/20 border border-green-400/30 rounded-lg p-2 text-sm text-white"
                        >
                          {exhibition}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <RankingModal
        isOpen={isRankingModalOpen}
        onClose={() => setIsRankingModalOpen(false)}
        rankings={sortedRankings}
        currentUserRanking={null}
        isLoading={false}
        visitedCount={0}
        needsNickname={false}
        onSaveWithNickname={() => {}}
      />
    </main>
  );
}

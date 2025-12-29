'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  visitedCount: number;
  totalCount: number;
}

function getBadge(count: number) {
  if (count >= 16) {
    return { name: '플래티넘', color: 'bg-gradient-to-r from-gray-300 to-gray-100', textColor: 'text-gray-800', icon: '💎' };
  } else if (count >= 12) {
    return { name: '골드', color: 'bg-gradient-to-r from-yellow-400 to-yellow-300', textColor: 'text-yellow-900', icon: '🥇' };
  } else if (count >= 8) {
    return { name: '실버', color: 'bg-gradient-to-r from-gray-400 to-gray-300', textColor: 'text-gray-800', icon: '🥈' };
  } else if (count >= 4) {
    return { name: '브론즈', color: 'bg-gradient-to-r from-amber-700 to-amber-600', textColor: 'text-amber-100', icon: '🥉' };
  }
  return null;
}

export default function Header({ visitedCount, totalCount }: HeaderProps) {
  const [nickname, setNickname] = useState('Guest');
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState('');

  const badge = getBadge(visitedCount);

  useEffect(() => {
    const saved = localStorage.getItem('artbingo-nickname');
    if (saved) {
      setNickname(saved);
    }
  }, []);

  const handleNicknameClick = () => {
    setTempNickname(nickname);
    setIsEditing(true);
  };

  const handleSave = () => {
    const newNickname = tempNickname.trim() || 'Guest';
    setNickname(newNickname);
    localStorage.setItem('artbingo-nickname', newNickname);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <header className="text-center py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        {isEditing ? (
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              autoFocus
              maxLength={10}
              className="bg-white/20 text-white placeholder-white/50 px-3 py-1 rounded-lg border-2 border-white/30 focus:outline-none focus:border-white/60 text-center w-32"
              placeholder="닉네임"
            />
            <span>님의</span>
            <span>아트 BINGO 2025</span>
          </div>
        ) : (
          <div>
            <button
              onClick={handleNicknameClick}
              className="hover:text-accent transition-colors underline decoration-dotted underline-offset-4 decoration-white/50"
            >
              {nickname}님
            </button>
            의 아트 BINGO
          </div>
        )}
      </h1>
      <div className="flex items-center justify-center gap-3">
        <div className="text-lg md:text-xl text-white/90 font-semibold">
          2025년 <span className="text-accent">{visitedCount}</span>개 방문 완료!
          {visitedCount === totalCount && (
            <span className="ml-2">🎉</span>
          )}
        </div>
        {badge && (
          <div className={`${badge.color} ${badge.textColor} px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1`}>
            <span>{badge.icon}</span>
            <span>{badge.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}

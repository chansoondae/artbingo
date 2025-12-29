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
  const badge = getBadge(visitedCount);

  return (
    <header className="text-center py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
        아트프렌즈 BINGO 2025
      </h1>
      <div className="flex items-center justify-center gap-3">
        <div className="text-lg md:text-xl text-white/90 font-semibold">
          <span className="text-accent">{visitedCount}</span>개 방문 완료!
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

export function getBadge(count: number) {
  if (count >= 50) {
    return { name: '그랜드 마스터', color: 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600', textColor: 'text-white', icon: '👑' };
  } else if (count >= 30) {
    return { name: '마스터', color: 'bg-gradient-to-r from-yellow-500 via-yellow-300 to-amber-400', textColor: 'text-yellow-900', icon: '🏆' };
  } else if (count >= 20) {
    return { name: '다이아몬드', color: 'bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400', textColor: 'text-white', icon: '💠' };
  } else if (count >= 16) {
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

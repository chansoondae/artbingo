export function getBadge(count: number) {
  if (count >= 50) {
    return {
      name: '그랜드 마스터',
      gradient: '#e9d5ff',
      color: 'bg-purple-200',
      textColor: 'text-purple-900',
      icon: '👑'
    };
  } else if (count >= 30) {
    return {
      name: '마스터',
      gradient: '#fef3c7',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-900',
      icon: '🏆'
    };
  } else if (count >= 20) {
    return {
      name: '다이아몬드',
      gradient: '#dbeafe',
      color: 'bg-blue-100',
      textColor: 'text-blue-900',
      icon: '💠'
    };
  } else if (count >= 16) {
    return {
      name: '플래티넘',
      gradient: '#f3f4f6',
      color: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: '💎'
    };
  } else if (count >= 12) {
    return {
      name: '골드',
      gradient: '#fef3c7',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-900',
      icon: '🥇'
    };
  } else if (count >= 8) {
    return {
      name: '실버',
      gradient: '#f3f4f6',
      color: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: '🥈'
    };
  } else if (count >= 4) {
    return {
      name: '브론즈',
      gradient: '#fed7aa',
      color: 'bg-orange-200',
      textColor: 'text-orange-900',
      icon: '🥉'
    };
  }
  return null;
}

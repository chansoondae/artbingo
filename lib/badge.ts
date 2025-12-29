export function getBadge(count: number) {
  if (count >= 50) {
    return {
      name: '그랜드 마스터',
      gradient: '#e9d5ff',
      textColor: '#6b21a8',
      icon: '👑'
    };
  } else if (count >= 30) {
    return {
      name: '마스터',
      gradient: '#fef3c7',
      textColor: '#92400e',
      icon: '🏆'
    };
  } else if (count >= 20) {
    return {
      name: '다이아몬드',
      gradient: '#dbeafe',
      textColor: '#1e40af',
      icon: '💠'
    };
  } else if (count >= 16) {
    return {
      name: '플래티넘',
      gradient: '#f3f4f6',
      textColor: '#374151',
      icon: '💎'
    };
  } else if (count >= 12) {
    return {
      name: '골드',
      gradient: '#fef3c7',
      textColor: '#92400e',
      icon: '🥇'
    };
  } else if (count >= 8) {
    return {
      name: '실버',
      gradient: '#f3f4f6',
      textColor: '#374151',
      icon: '🥈'
    };
  } else if (count >= 4) {
    return {
      name: '브론즈',
      gradient: '#fed7aa',
      textColor: '#7c2d12',
      icon: '🥉'
    };
  }
  return null;
}

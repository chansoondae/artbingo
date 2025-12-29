export function getBadge(count: number) {
  if (count >= 50) {
    return {
      name: '그랜드 마스터',
      gradient: 'linear-gradient(to right, #9333ea, #6b21a8)',
      textColor: '#ffffff',
      icon: '👑'
    };
  } else if (count >= 30) {
    return {
      name: '마스터',
      gradient: 'linear-gradient(to right, #fbbf24, #ca8a04)',
      textColor: '#78350f',
      icon: '🏆'
    };
  } else if (count >= 20) {
    return {
      name: '다이아몬드',
      gradient: 'linear-gradient(to right, #60a5fa, #2563eb)',
      textColor: '#ffffff',
      icon: '💠'
    };
  } else if (count >= 16) {
    return {
      name: '플래티넘',
      gradient: 'linear-gradient(to right, #e5e7eb, #9ca3af)',
      textColor: '#1f2937',
      icon: '💎'
    };
  } else if (count >= 12) {
    return {
      name: '골드',
      gradient: 'linear-gradient(to right, #fbbf24, #ca8a04)',
      textColor: '#78350f',
      icon: '🥇'
    };
  } else if (count >= 8) {
    return {
      name: '실버',
      gradient: 'linear-gradient(to right, #9ca3af, #6b7280)',
      textColor: '#1f2937',
      icon: '🥈'
    };
  } else if (count >= 4) {
    return {
      name: '브론즈',
      gradient: 'linear-gradient(to right, #b45309, #78350f)',
      textColor: '#fef3c7',
      icon: '🥉'
    };
  }
  return null;
}

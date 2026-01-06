// Supabase에서 운세 순위 데이터를 가져와 JSON 파일로 생성하는 스크립트
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// getBadge 함수 복사
function getBadge(count) {
  if (count >= 250) {
    return {
      name: '아트신',
      gradient: '#fce7f3',
      color: 'bg-pink-200',
      textColor: 'text-pink-900',
      icon: '🎨'
    };
  } else if (count >= 200) {
    return {
      name: '앰버서더',
      gradient: '#fbcfe8',
      color: 'bg-pink-300',
      textColor: 'text-pink-900',
      icon: '🌟'
    };
  } else if (count >= 100) {
    return {
      name: '레전드',
      gradient: '#fbbf24',
      color: 'bg-amber-300',
      textColor: 'text-amber-900',
      icon: '⭐'
    };
  } else if (count >= 50) {
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

async function exportFortuneRanking() {
  try {
    // Supabase 클라이언트 초기화
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Supabase 환경 변수가 설정되지 않았습니다.');
      console.log('NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 .env.local 파일에 설정해주세요.');
      process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Rankings 테이블에서 모든 데이터 가져오기 (최신순)
    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase 조회 오류:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      console.log('⚠️  랭킹 데이터가 없습니다.');
      return;
    }

    // 닉네임별로 최신 데이터만 유지 (중복 제거)
    const uniqueRankings = data.reduce((acc, curr) => {
      if (!acc.find(item => item.nickname === curr.nickname)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    // visited_count로 정렬 (내림차순), 동점이면 created_at으로 정렬 (오름차순)
    uniqueRankings.sort((a, b) => {
      if (b.visited_count !== a.visited_count) {
        return b.visited_count - a.visited_count;
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    // 순위 데이터 생성 (전체 정보)
    const rankedDataFull = uniqueRankings.map((item, index) => {
      const badge = getBadge(item.visited_count);
      return {
        rank: index + 1,
        nickname: item.nickname,
        badgeName: badge ? badge.name : '뱃지 없음',
        exhibitionCount: item.visited_count,
        visitedExhibitions: item.visited_exhibitions || []
      };
    });

    // 순위 데이터 생성 (간단한 버전 - rank와 exhibitionCount만)
    const rankedDataSimple = uniqueRankings.map((item, index) => {
      return {
        rank: index + 1,
        nickname: item.nickname,
        exhibitionCount: item.visited_count
      };
    });

    // 1위~7위만 추출
    const top7Full = rankedDataFull.slice(0, 7);
    const top7Simple = rankedDataSimple.slice(0, 7);

    // 전체 데이터 (기존 파일)
    const resultFull = {
      top7: top7Full,
      all: rankedDataFull
    };

    // 간단한 데이터 (새 파일)
    const resultSimple = {
      top7: top7Simple,
      all: rankedDataSimple
    };

    // JSON 파일로 저장 (기존 파일)
    const outputPathFull = path.join(process.cwd(), 'data', 'fortune-ranking.json');
    fs.writeFileSync(outputPathFull, JSON.stringify(resultFull, null, 2), 'utf-8');

    // JSON 파일로 저장 (새 파일 - 간단한 버전)
    const outputPathSimple = path.join(process.cwd(), 'data', 'fortune-ranking-simple.json');
    fs.writeFileSync(outputPathSimple, JSON.stringify(resultSimple, null, 2), 'utf-8');

    console.log('✅ 운세 순위가 성공적으로 저장되었습니다!');
    console.log(`📁 전체 정보 파일: ${outputPathFull}`);
    console.log(`📁 간단한 버전 파일: ${outputPathSimple}`);
    console.log(`\n📊 통계:`);
    console.log(`- 총 사용자: ${rankedDataFull.length}명`);
    if (top7Full.length > 0) {
      console.log(`- 1위: ${top7Full[0]?.nickname} (${top7Full[0]?.exhibitionCount}개, ${top7Full[0]?.badgeName})`);
    }
    console.log(`\n🏆 Top 7:`);
    top7Full.forEach(item => {
      console.log(`${item.rank}위. ${item.nickname} - ${item.badgeName} (${item.exhibitionCount}개)`);
    });

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

exportFortuneRanking();

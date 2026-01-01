import { artworks } from './../data/artworks';

/**
 * 사용자의 응답을 기반으로 성격 유형을 결정하는 함수
 * @param {Array} responses - 사용자의 응답 배열 (각 질문마다 'A' 또는 'B')
 * @returns {string} - MBTI 형식의 성격 유형 (예: 'ESTJ', 'INFP' 등)
 */
export function determinePersonalityType(responses) {
  // 각 유형별 카운트 초기화
  let typeCounts = {
    E: 0, I: 0,  // 외향/내향
    S: 0, N: 0,  // 감각/직관
    T: 0, F: 0,  // 사고/감정
    J: 0, P: 0   // 판단/인식
  };
  
  // 각 질문의 응답에 따라 카운트 증가
  responses.forEach((response, index) => {
    const question = artworks[index];
    const selectedOption = question.options.find(opt => opt.id === response);
    
    if (selectedOption) {
      typeCounts[selectedOption.type]++;
    }
  });
  
  // 우세한 특성 결정
  const personality = [
    typeCounts.E > typeCounts.I ? 'E' : 'I',
    typeCounts.S > typeCounts.N ? 'S' : 'N',
    typeCounts.T > typeCounts.F ? 'T' : 'F',
    typeCounts.J > typeCounts.P ? 'J' : 'P'
  ].join('');
  
  return personality;
}

/**
 * 두 유형 사이의 선호도가 동일할 때 처리하는 보조 함수
 * @param {number} count1 - 첫 번째 유형의 카운트
 * @param {number} count2 - 두 번째 유형의 카운트
 * @param {string} type1 - 첫 번째 유형 문자
 * @param {string} type2 - 두 번째 유형 문자
 * @returns {string} - 결정된 유형 문자
 */
export function resolveEqualPreference(count1, count2, type1, type2) {
  if (count1 > count2) {
    return type1;
  } else if (count2 > count1) {
    return type2;
  } else {
    // 동점일 경우 무작위로 결정하거나 기본값 설정
    // 여기서는 첫 번째 유형으로 설정
    return type1;
  }
}

/**
 * 각 유형별로 획득한 점수의 비율을 계산하는 함수 (백분율)
 * @param {Object} typeCounts - 각 유형별 카운트
 * @returns {Object} - 각 유형별 비율 (백분율)
 */
export function calculateTypePercentages(typeCounts) {
  const total = {
    EI: typeCounts.E + typeCounts.I,
    SN: typeCounts.S + typeCounts.N,
    TF: typeCounts.T + typeCounts.F,
    JP: typeCounts.J + typeCounts.P
  };
  
  return {
    E: Math.round((typeCounts.E / total.EI) * 100),
    I: Math.round((typeCounts.I / total.EI) * 100),
    S: Math.round((typeCounts.S / total.SN) * 100),
    N: Math.round((typeCounts.N / total.SN) * 100),
    T: Math.round((typeCounts.T / total.TF) * 100),
    F: Math.round((typeCounts.F / total.TF) * 100),
    J: Math.round((typeCounts.J / total.JP) * 100),
    P: Math.round((typeCounts.P / total.JP) * 100)
  };
}

/**
 * 각 문항별로 어떤 성격 특성을 측정하는지 반환하는 함수
 * @returns {Object} - 각 문항이 측정하는 성격 특성 객체
 */
export function getQuestionTypes() {
  return {
    1: 'E/I', // 외향성/내향성
    2: 'E/I',
    3: 'E/I',
    4: 'S/N', // 감각/직관
    5: 'S/N',
    6: 'T/F', // 사고/감정
    7: 'T/F',
    8: 'T/F',
    9: 'T/F',
    10: 'J/P', // 판단/인식
    11: 'J/P',
    12: 'J/P'
  };
}

/**
 * 사용자의 응답을 기반으로 각 차원별 상세 분석 결과 반환
 * @param {Array} responses - 사용자의 응답 배열
 * @returns {Object} - 각 차원별 상세 분석 결과
 */
export function analyzeResponseDetails(responses) {
  // 각 유형별 카운트 초기화
  let typeCounts = {
    E: 0, I: 0,  // 외향/내향
    S: 0, N: 0,  // 감각/직관
    T: 0, F: 0,  // 사고/감정
    J: 0, P: 0   // 판단/인식
  };
  
  // 각 질문의 응답에 따라 카운트 증가
  responses.forEach((response, index) => {
    const question = artworks[index];
    const selectedOption = question.options.find(opt => opt.id === response);
    
    if (selectedOption) {
      typeCounts[selectedOption.type]++;
    }
  });
  
  // 유형별 비율 계산
  const percentages = calculateTypePercentages(typeCounts);
  
  // 각 차원별 결과 및 설명
  return {
    EI: {
      dominant: typeCounts.E > typeCounts.I ? 'E' : 'I',
      percentages: { E: percentages.E, I: percentages.I },
      description: typeCounts.E > typeCounts.I 
        ? '당신은 외부 세계와 작품의 사회적 맥락에 관심이 많습니다. 다른 사람들과 함께 작품을 감상하고 의견을 나누는 것을 선호합니다.'
        : '당신은 작품의 내면적 의미와 개인적 해석에 집중합니다. 혼자 작품을 깊이 감상하는 시간을 가치 있게 여깁니다.'
    },
    SN: {
      dominant: typeCounts.S > typeCounts.N ? 'S' : 'N',
      percentages: { S: percentages.S, N: percentages.N },
      description: typeCounts.S > typeCounts.N
        ? '당신은 작품의 구체적인 디테일과 기술적 완성도에 주목합니다. 사실적이고 현실적인 표현을 선호합니다.'
        : '당신은 작품이 전달하는 상징과 은유, 추상적 개념에 매료됩니다. 상상력을 자극하는 작품을 선호합니다.'
    },
    TF: {
      dominant: typeCounts.T > typeCounts.F ? 'T' : 'F',
      percentages: { T: percentages.T, F: percentages.F },
      description: typeCounts.T > typeCounts.F
        ? '당신은 작품의 구조적 요소와 논리적 구성을 분석적으로 평가합니다. 객관적인 기준으로 작품을 감상합니다.'
        : '당신은 작품이 전달하는 감정과 정서적 울림에 공감합니다. 작품과 개인적인 정서적 연결을 중요시합니다.'
    },
    JP: {
      dominant: typeCounts.J > typeCounts.P ? 'J' : 'P',
      percentages: { J: percentages.J, P: percentages.P },
      description: typeCounts.J > typeCounts.P
        ? '당신은 작품의 질서와 완성도를 중요시합니다. 잘 정돈된 구도와 완결된 표현을 선호합니다.'
        : '당신은 작품의 자유로운 표현과 열린 해석 가능성을 중요시합니다. 실험적이고 혁신적인 작품에 끌립니다.'
    }
  };
}
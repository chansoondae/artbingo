// 미술 작품 정보
export const artworks = [
    {
      id: 1,
      question: "사회성/외향성 관련",
      options: [
        {
          id: "A",
          title: "물랭 드 라 갈레트의 무도회",
          artist: "르누아르",
          description: "사람들이 모여 춤추고 교류하는 활기찬 장면",
          image: "/images/renoir_moulin.jpg",
          type: "E" // 외향형
        },
        {
          id: "B",
          title: "아침의 태양",
          artist: "에드워드 호퍼",
          description: "혼자 조용히 햇빛을 즐기는 인물",
          image: "/images/hopper_morning_sun.jpg",
          type: "I" // 내향형
        }
      ]
    },
    {
      id: 2,
      question: "사교성 관련",
      options: [
        {
          id: "A",
          title: "물랭 루즈에서의 춤",
          artist: "앙리 툴루즈-로트렉",
          description: "다양한 인물들의 사교 장면",
          image: "/images/toulouse_lautrec_moulin_rouge.jpg",
          type: "E" // 외향형
        },
        {
          id: "B",
          title: "바다 위의 월출",
          artist: "카스파 다비드 프리드리히",
          description: "고독한 풍경",
          image: "/images/friedrich_moonrise.jpg",
          type: "I" // 내향형
        }
      ]
    },
    {
      id: 3,
      question: "에너지 충전 방식",
      options: [
        {
          id: "A",
          title: "넘버 5",
          artist: "잭슨 폴록",
          description: "활동적이고 역동적인 추상화",
          image: "/images/pollock_number5.jpg",
          type: "E" // 외향형
        },
        {
          id: "B",
          title: "진주 귀걸이를 한 소녀",
          artist: "요하네스 페르메이르",
          description: "고요하고 내면적인 분위기",
          image: "/images/vermeer_pearl_earring.jpg",
          type: "I" // 내향형
        }
      ]
    },
    {
      id: 4,
      question: "사고 방식 (상상력)",
      options: [
        {
          id: "A",
          title: "기억의 지속",
          artist: "살바도르 달리",
          description: "초현실적인 녹아내리는 시계",
          image: "/images/dali_persistence.jpg",
          type: "N" // 직관형
        },
        {
          id: "B",
          title: "인상, 해돋이",
          artist: "클로드 모네",
          description: "현실적인 풍경",
          image: "/images/monet_impression.jpg",
          type: "S" // 감각형
        }
      ]
    },
    {
      id: 5,
      question: "창의성/상상력",
      options: [
        {
          id: "A",
          title: "구성 VIII",
          artist: "바실리 칸딘스키",
          description: "추상적, 구조가 없는 표현",
          image: "/images/kandinsky_composition.jpg",
          type: "N" // 직관형
        },
        {
          id: "B",
          title: "우유를 따르는 여인",
          artist: "요하네스 베르메르",
          description: "사실적이고 구체적인 일상",
          image: "/images/vermeer_milkmaid.jpg",
          type: "S" // 감각형
        }
      ]
    },
    {
      id: 6,
      question: "감정 표현 방식",
      options: [
        {
          id: "A",
          title: "절규",
          artist: "에드바르드 뭉크",
          description: "감정이 강렬하게 표현됨",
          image: "/images/munch_scream.jpg",
          type: "F" // 감정형
        },
        {
          id: "B",
          title: "그랑드 자트 섬의 일요일 오후",
          artist: "조르주 쇠라",
          description: "감정 절제된 구조적 작품",
          image: "/images/seurat_sunday.jpg",
          type: "T" // 사고형
        }
      ]
    },
    {
      id: 7,
      question: "솔직함/표현",
      options: [
        {
          id: "A",
          title: "부서진 척추가 있는 자화상",
          artist: "프리다 칼로",
          description: "솔직하고 직접적인 표현",
          image: "/images/kahlo_broken_column.jpg",
          type: "F" // 감정형
        },
        {
          id: "B",
          title: "이것은 파이프가 아니다",
          artist: "르네 마그리트",
          description: "간접적이고 은유적인 표현",
          image: "/images/magritte_pipe.jpg",
          type: "T" // 사고형
        }
      ]
    },
    {
      id: 8,
      question: "논리/감정 관련",
      options: [
        {
          id: "A",
          title: "빨강, 파랑, 노랑의 구성",
          artist: "피에트 몬드리안",
          description: "기하학적, 논리적 구성",
          image: "/images/mondrian_composition.jpg",
          type: "T" // 사고형
        },
        {
          id: "B",
          title: "비, 증기, 속도",
          artist: "윌리엄 터너",
          description: "감정적이고 분위기를 중시하는 표현",
          image: "/images/turner_rain.jpg",
          type: "F" // 감정형
        }
      ]
    },
    {
      id: 9,
      question: "공감 능력",
      options: [
        {
          id: "A",
          title: "별이 빛나는 밤",
          artist: "빈센트 반 고흐",
          description: "감정이입을 불러일으키는 역동적 풍경",
          image: "/images/vangogh_starry_night.jpg",
          type: "F" // 감정형
        },
        {
          id: "B",
          title: "화가의 어머니",
          artist: "제임스 휘슬러",
          description: "차분하고 객관적인 인물화",
          image: "/images/whistler_mother.jpg",
          type: "T" // 사고형
        }
      ]
    },
    {
      id: 10,
      question: "계획성/즉흥성",
      options: [
        {
          id: "A",
          title: "가을의 리듬",
          artist: "잭슨 폴록",
          description: "즉흥적이고 자유로운 액션 페인팅",
          image: "/images/pollock_autumn.jpg",
          type: "P" // 인식형
        },
        {
          id: "B",
          title: "아스니에르에서의 수영",
          artist: "조르주 쇠라",
          description: "치밀하게 계획된 점묘법",
          image: "/images/seurat_asnieres.jpg",
          type: "J" // 판단형
        }
      ]
    },
    {
      id: 11,
      question: "계획과 스트레스",
      options: [
        {
          id: "A",
          title: "수련",
          artist: "클로드 모네",
          description: "자유롭고 흐르는듯한 붓질",
          image: "/images/monet_waterlilies.jpg",
          type: "P" // 인식형
        },
        {
          id: "B",
          title: "아르놀피니 부부의 초상화",
          artist: "얀 반 에이크",
          description: "세밀하고 계획적인 묘사",
          image: "/images/eyck_arnolfini.jpg",
          type: "J" // 판단형
        }
      ]
    },
    {
      id: 12,
      question: "변화에 대한 적응력",
      options: [
        {
          id: "A",
          title: "아비뇽의 처녀들",
          artist: "파블로 피카소",
          description: "전통을 깨는 혁신적 스타일",
          image: "/images/picasso_avignon.jpg",
          type: "P" // 인식형
        },
        {
          id: "B",
          title: "이삭 줍는 사람들",
          artist: "장-프랑수아 밀레",
          description: "전통적이고 안정적인 표현",
          image: "/images/millet_gleaners.jpg",
          type: "J" // 판단형
        }
      ]
    }
  ];
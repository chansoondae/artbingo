# Fortune Ranking Export Script

Supabase rankings 테이블에서 순위 데이터를 가져와 JSON 파일로 저장하는 스크립트입니다.

## 필요한 준비물

`.env.local` 파일에 Supabase 설정이 되어 있어야 합니다:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 사용 방법

### 1. 스크립트 실행

```bash
npm run export-fortune-ranking
```

### 2. 결과 확인

스크립트가 성공적으로 실행되면 `data/fortune-ranking.json` 파일이 생성됩니다.

## 생성되는 JSON 구조

```json
{
  "generatedAt": "2026-01-05T12:00:00.000Z",
  "totalUsers": 50,
  "top7": [
    {
      "rank": 1,
      "nickname": "아트러버",
      "badgeName": "레전드",
      "exhibitionCount": 125,
      "visitedExhibitions": [
        "국립현대미술관 - 전시A",
        "서울시립미술관 - 전시B"
      ],
      "badge": {
        "name": "레전드",
        "gradient": "#fbbf24",
        "color": "bg-amber-300",
        "textColor": "text-amber-900",
        "icon": "⭐"
      }
    }
  ],
  "all": [
    // 전체 사용자 데이터 (순위순)
  ]
}
```

## 배지 등급

- **아트신**: 250개 이상 🎨
- **앰버서더**: 200개 이상 🌟
- **레전드**: 100개 이상 ⭐
- **그랜드 마스터**: 50개 이상 👑
- **마스터**: 30개 이상 🏆
- **다이아몬드**: 20개 이상 💠
- **플래티넘**: 16개 이상 💎
- **골드**: 12개 이상 🥇
- **실버**: 8개 이상 🥈
- **브론즈**: 4개 이상 🥉

## 순위 결정 방식

1. 방문한 전시 개수(`visited_count`)로 내림차순 정렬
2. 동점일 경우 먼저 기록한 사람이 상위
3. 각 닉네임당 가장 최신 기록만 유지

## 문제 해결

### "Supabase 환경 변수가 설정되지 않았습니다" 오류

`.env.local` 파일에 Supabase URL과 ANON KEY가 설정되어 있는지 확인하세요.

### "랭킹 데이터가 없습니다" 메시지

Supabase `rankings` 테이블에 데이터가 없습니다.
최소 한 번 이상 "순위 확인하기" 버튼을 클릭한 후 다시 시도하세요.

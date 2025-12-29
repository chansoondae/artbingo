# 아트프렌즈 2025 전시 빙고 게임

2025년에 다녀온 미술 전시를 기록하고 공유할 수 있는 인터랙티브 빙고 게임 웹앱입니다.

## 기능

- **4×4 빙고판**: 12개 고정 전시 + 4개 사용자 정의 칸
- **방문 체크**: 칸을 클릭하여 "다녀옴" 도장 스탬프 표시
- **드래그 앤 드롭**: 칸의 위치를 자유롭게 재배치
- **사용자 정의**: 빈칸에 나만의 전시 추가
- **이미지 저장**: 완성된 빙고판을 PNG 이미지로 다운로드
- **로컬 저장**: 브라우저 localStorage에 자동 저장 (새로고침해도 유지)

## 시작하기

### 설치

```bash
npm install
```

### 환경 변수 설정

`.env.local` 파일에 OpenAI API 키를 설정하세요:

```
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI API 키는 [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)에서 발급받을 수 있습니다.

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 사용 방법

1. **전시 방문 표시**: 각 칸을 클릭하면 "다녀옴" 도장이 찍힙니다
2. **나만의 전시 추가**: 빈칸(+)을 클릭하여 미술관명과 전시제목 입력
3. **행 추가하기**: 빙고판 하단의 "행 추가하기" 버튼으로 4칸씩 추가
4. **이미지 저장**: "이미지로 저장하기" 버튼으로 PNG 파일 다운로드
5. **AI 프로필 생성**: "이미지로 표현하기" 버튼으로 AI가 생성한 나만의 프로필 이미지와 설명 받기

## 기술 스택

- **Next.js 15** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **@dnd-kit** - 드래그 앤 드롭
- **html-to-image** - 이미지 내보내기

## 프로젝트 구조

```
/app
  /page.tsx              # 메인 페이지
  /layout.tsx            # 레이아웃
  /globals.css           # 글로벌 스타일

/components
  /BingoBoard.tsx        # 빙고판 컨테이너 (드래그 앤 드롭 포함)
  /BingoCell.tsx         # 개별 빙고 칸
  /StampOverlay.tsx      # 방문 도장 오버레이
  /CustomCellModal.tsx   # 빈칸 입력 모달
  /SaveImageButton.tsx   # 이미지 저장 버튼
  /Header.tsx            # 로고 + 타이틀

/lib
  /types.ts              # TypeScript 타입 정의
  /exhibitions.ts        # 전시 목록 데이터
  /storage.ts            # localStorage 유틸리티
```

## 커스터마이징

### 전시 목록 변경

`lib/exhibitions.ts` 파일에서 12개의 고정 전시 데이터를 수정할 수 있습니다:

```typescript
{
  id: '1',
  type: 'preset',
  museum: '미술관명',
  exhibition: '전시제목',
  isVisited: false,
  order: 0,
}
```

### 색상 변경

`tailwind.config.ts`와 `app/globals.css`에서 색상을 커스터마이징할 수 있습니다:

- `bg-primary`: 배경색 (코랄 핑크)
- `stamp-color`: 도장 색상 (빨강)
- `accent`: 강조 색상 (노랑)

### 로고 추가

`components/Header.tsx`의 placeholder를 실제 로고 이미지로 교체하세요.

## 라이선스

MIT

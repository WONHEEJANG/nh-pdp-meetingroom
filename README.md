# 회의실 예약 시스템

피그마 디자인을 기반으로 개발된 모바일 웹 회의실 예약 시스템입니다.

## 🚀 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📱 주요 기능

- **반응형 디자인**: 모바일 기기에 최적화된 UI/UX
- **날짜 선택**: 캘린더를 통한 직관적인 날짜 선택
- **회의실 선택**: 탭을 통한 회의실 선택
- **시간 선택**: 30분 단위 시간 슬롯 선택
- **실시간 상태 표시**: 예약 가능/불가능/선택 상태 시각화

## 🎨 디자인 시스템

- **폰트**: Pretendard
- **컬러 팔레트**: 
  - Primary: #19973c (초록)
  - Text: #121212 (검정)
  - Gray: #505050, #767676, #929292
  - Red: #ec0c0c (일요일)
  - Blue: #2c6dd4 (토요일)

## 🛠 기술 스택

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Pretendard

## 📱 모바일 최적화

- 터치 친화적인 버튼 크기 (최소 44px)
- iOS Safari viewport 높이 문제 해결
- 부드러운 스크롤링
- 터치 하이라이트 제거
- 반응형 텍스트 크기

## 🏗 컴포넌트 구조

```
components/
├── Header.tsx          # 상단 헤더
├── Calendar.tsx        # 캘린더 컴포넌트
├── RoomTabs.tsx        # 회의실 탭
├── RoomInfo.tsx        # 회의실 정보
├── TimeSlotGrid.tsx    # 시간 선택 그리드
└── ActionButtons.tsx   # 하단 액션 버튼
```

## 📄 라이선스

MIT License

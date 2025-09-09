# NH 회의실 예약 시스템

피그마 디자인을 기반으로 구현한 모바일 웹 회의실 예약 애플리케이션입니다.

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📱 주요 기능

- 회의실 선택 및 예약
- 날짜 및 시간 선택
- 예약 확인 및 확정
- 모바일 최적화 UI/UX
- PWA 지원

## 🛠️ 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 3. 빌드

```bash
npm run build
```

### 4. 프로덕션 서버 실행

```bash
npm start
```

## 📦 배포

### Vercel 배포

1. GitHub에 코드를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인합니다.
3. 새 프로젝트를 생성하고 GitHub 저장소를 연결합니다.
4. 자동으로 빌드 및 배포가 진행됩니다.

### 수동 배포

```bash
npm run build
```

빌드된 파일은 `out` 폴더에 생성됩니다.

## 📱 모바일 최적화

- 반응형 디자인 (최대 너비 448px)
- 터치 친화적 UI
- PWA 지원 (홈 화면에 추가 가능)
- 모바일 브라우저 최적화

## 🎨 디자인 시스템

- **Primary Color**: Green (#16a34a)
- **Typography**: 시스템 폰트
- **Spacing**: Tailwind CSS 기본 스페이싱
- **Components**: 재사용 가능한 컴포넌트 클래스

## 📂 프로젝트 구조

```
├── app/
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 루트 레이아웃
│   └── page.tsx             # 메인 페이지
├── public/
│   └── manifest.json        # PWA 매니페스트
├── next.config.js           # Next.js 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
└── vercel.json              # Vercel 배포 설정
```

## 🔧 커스터마이징

### 색상 변경

`tailwind.config.js`에서 색상 팔레트를 수정할 수 있습니다.

### 컴포넌트 스타일

`app/globals.css`의 `@layer components` 섹션에서 컴포넌트 스타일을 수정할 수 있습니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

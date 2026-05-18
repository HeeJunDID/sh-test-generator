# 테스트케이스 자동생성 도구 — 클라이언트

요구사항을 입력하면 AI가 테스트케이스를 자동으로 생성해주는 Vue 3 웹 애플리케이션입니다.

## 기술 스택

- **Vue 3** (Composition API)
- **Vite 5**
- **XLSX** — 엑셀 다운로드
- 외부 UI 라이브러리 없이 순수 CSS 구현

## 주요 기능

| 기능 | 설명 |
|------|------|
| 로그인 / 인증 | JWT 기반 로그인, 사용자별 설정 저장 |
| 테스트케이스 생성 | 요구사항 입력 → AI 자동 생성 (Dify + Gemini 보강) |
| 목록 조회 | 생성된 케이스 목록, 체크박스 다중 선택 |
| 상세 보기 | 전제조건 / 테스트 단계 / 기대 결과 / 우선순위 |
| 엑셀 다운로드 | 전체 다운로드 / 선택 항목만 다운로드 |
| 이력 조회 | 과거 생성 이력 목록 및 미리보기, 엑셀 다운로드 |
| 설정 | 사용자별 AI 제공자 선택 (Dify / Gemini / Claude) |
| 상단 진행 바 | 생성 요청 중 실시간 진행 상태 표시 |

## 화면 구성

```
┌──────────────────────────────────────────────────────────────┐
│  AppHeader (탭 전환 / 프로필 드롭다운 / 설정 / 로그아웃)        │
├─────────────────────────┬────────────────────────────────────┤
│                         │  TestCaseListPanel                 │
│  RequirementsPanel      │  (목록 + 체크박스 + 전체/선택 다운로드) │
│  (요구사항 입력)          ├────────────────────────────────────┤
│                         │  TestCaseDetailPanel (상세)         │
└─────────────────────────┴────────────────────────────────────┘

이력 탭:
┌──────────────────────────────────────────────────────────────┐
│  HistoryListPanel (이력 목록 → 클릭 시 미리보기 모달 오픈)     │
└──────────────────────────────────────────────────────────────┘
```

## 프로젝트 구조

```
src/
├── App.vue                      # 루트 컴포넌트 / 전역 상태
├── main.js
├── style.css
├── api/
│   └── testcase.js              # API 호출 (generate, history)
├── composables/
│   └── useAuth.js               # 로그인 상태 / JWT 관리
└── components/
    ├── AppHeader.vue             # 헤더 (탭, 프로필 드롭다운)
    ├── LandingPage.vue           # 랜딩 페이지
    ├── LoginModal.vue            # 로그인 모달
    ├── SettingsModal.vue         # 설정 (AI 제공자 선택)
    ├── TopProgressBar.vue        # 상단 진행 바
    ├── RequirementsPanel.vue     # 요구사항 입력
    ├── TestCaseListPanel.vue     # 목록 (체크박스, 다운로드)
    ├── TestCaseDetailPanel.vue   # 상세 보기
    ├── HistoryListPanel.vue      # 이력 목록
    └── HistoryPreviewModal.vue   # 이력 미리보기 + 다운로드
```

## 로컬 개발

```bash
npm install
npm run dev   # http://localhost:5173
```

백엔드 서버(`TestCaseGenerator_Server`)가 `http://localhost:8080`에서 실행 중이어야 합니다.

## 배포

`main` 브랜치 push 시 GitHub Actions가 자동으로 ECR 빌드 → EC2 배포합니다.

- **프로덕션**: `http://43.202.110.99`
- **빌드**: `node:20-alpine` (amd64 네이티브) → `nginx:alpine` (arm64)
- **프록시**: nginx `/api/*` → 서버 컨테이너 `8080`

## 엑셀 다운로드 컬럼 순서

`No / ID / 프로그램명 / 테스트케이스 / 테스트 데이터 / 전제조건 / 테스트 단계 / 기대 결과 / 우선순위 / 구분`

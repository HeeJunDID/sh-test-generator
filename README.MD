# 테스트케이스 자동생성 — Client (사용자 앱)

요구사항을 입력하면 AI가 테스트케이스를 자동으로 생성해주는 Vue 3 웹 애플리케이션입니다.

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Vue 3 (Composition API) |
| Build | Vite 5 |
| 주요 라이브러리 | xlsx (엑셀 다운로드) |
| UI | 외부 라이브러리 없이 순수 CSS 구현 |
| 배포 | Docker + Nginx, AWS ECR + EC2 |

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 회원가입 | 아이디·비밀번호·이름·소속팀 입력, 관리자 승인 후 이용 가능 |
| 로그인 / 세션 | JWT 기반 인증, 세션 유지 2시간, 만료 시 자동 로그아웃 |
| 테스트케이스 생성 | 요구사항 입력 → AI 자동 생성 (실시간 진행 바) |
| 목록 조회 | 생성된 케이스 목록, 우선순위·구분 태그 |
| 상세 보기 | 전제조건 / 테스트 단계 / 기대 결과 |
| 엑셀 다운로드 | 전체 또는 선택 항목만 다운로드 |
| 생성 이력 | 과거 생성 이력 목록, 미리보기 모달, 엑셀 재다운로드 |
| Excel 업로드 | 요구사항 정의서 업로드 시 제목·업무내용 자동 입력 |
| 반응형 | 모바일 지원 (768px 이하 단일 컬럼 전환) |

---

## 화면 구성

```
랜딩 페이지 (비로그인: 로그인·회원가입 / 로그인 상태: 시작하기)
       ↓ 로그인
┌────────────────────────────────────────────────────┐
│  AppHeader  [요구사항 정의] [이력]        [프로필▼]  │
├───────────────────────┬────────────────────────────┤
│  RequirementsPanel    │  TestCaseListPanel          │
│  - 제목               │  (목록 + 다운로드 버튼)       │
│  - 업무내용            ├────────────────────────────┤
│  - 개발구분 등         │  TestCaseDetailPanel        │
│  [테스트케이스 생성]    │  (상세 보기)                 │
└───────────────────────┴────────────────────────────┘

이력 탭:
┌────────────────────────────────────────────────────┐
│  HistoryListPanel — 이력 행 클릭 → 미리보기 모달     │
└────────────────────────────────────────────────────┘
```

---

## 프로젝트 구조

```
src/
├── App.vue                       # 루트 컴포넌트 (페이지 전환, 전역 토스트)
├── main.js
├── style.css                     # 전역 CSS 변수, 스크롤바 스타일
├── api/
│   ├── testcase.js               # generate, history API + 401/403 자동 로그아웃
│   ├── auth.js                   # login, register API
│   └── useMockMode.js            # 목 모드 스위치 (기본: false)
├── composables/
│   └── useAuth.js                # JWT 저장/삭제, isLoggedIn 상태
└── components/
    ├── LandingPage.vue            # 랜딩 (로그인 상태에 따라 버튼 분기)
    ├── AppHeader.vue              # 헤더 (탭, 프로필 드롭다운)
    ├── LoginModal.vue             # 로그인 모달
    ├── RegisterModal.vue          # 회원가입 모달 (신청 완료 화면 포함)
    ├── TopProgressBar.vue         # 상단 진행 바
    ├── RequirementsPanel.vue      # 요구사항 입력 폼 + Excel 업로드
    ├── TestCaseListPanel.vue      # 테스트케이스 목록
    ├── TestCaseDetailPanel.vue    # 테스트케이스 상세
    ├── HistoryListPanel.vue       # 이력 목록 테이블
    └── HistoryPreviewModal.vue    # 이력 미리보기 + 엑셀 다운로드
```

---

## 인증 흐름

```
회원가입 신청 → 관리자 승인 대기 (PENDING)
관리자 승인 → 로그인 가능
로그인 → JWT 저장 (localStorage)
2시간 후 만료 → API 응답 401 → 자동 로그아웃 → 토스트 메시지 → 로그인 모달
```

---

## 로컬 개발

```bash
npm install
npm run dev       # http://localhost:5173
```

백엔드 서버(`TestCaseGenerator_Server`)가 `http://localhost:8080`에서 실행 중이어야 합니다.

**환경변수** (`.env.production`)

```
VITE_API_BASE_URL=      # 비워두면 Nginx 프록시 사용 (운영 기본)
```

---

## 배포 (GitHub Actions)

`main` 브랜치에 push하면 자동 배포됩니다.

1. `npm run build` → `dist/` 생성
2. Nginx 이미지로 패키징 → AWS ECR push
3. EC2에서 이미지 pull → 컨테이너 재시작 (포트 **80**)

**Nginx 프록시 설정** (`nginx.conf`)

```nginx
location /api/ {
    proxy_pass http://server:8080;   # 서버 컨테이너로 프록시
}
```

---

## 엑셀 다운로드 컬럼 순서

`No / ID / 프로그램명 / 테스트케이스 / 테스트 데이터 / 전제조건 / 테스트 단계 / 기대 결과 / 우선순위 / 구분`

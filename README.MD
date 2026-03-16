# 테스트케이스 자동생성 도구

요구사항을 입력하면 테스트케이스를 자동으로 생성해주는 Vue 3 기반 웹 애플리케이션입니다.

## 기술 스택

- **Vue 3** (Composition API)
- **Vite 8**
- 외부 UI 라이브러리 없이 순수 CSS로 구현

## 프로젝트 구조

```
TestCaseGenerator/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js
    ├── style.css
    ├── App.vue                       # 루트 컴포넌트 / 상태 관리
    └── components/
        ├── AppHeader.vue             # 상단 네비게이션 헤더
        ├── BaseDropdown.vue          # 재사용 드롭다운 컴포넌트
        ├── RequirementsPanel.vue     # 요구사항 입력 패널 (좌측)
        ├── TestCaseListPanel.vue     # 생성된 테스트케이스 목록 (우측 상단)
        └── TestCaseDetailPanel.vue   # 테스트케이스 상세 보기 (우측 하단)
```

## 시작하기

### 요구사항

- Node.js 18 이상

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 주요 기능

| 기능 | 설명 |
|------|------|
| 요구사항 입력 | 제목, 업무내용, 개발구분, 신규여부 등 파라미터 입력 |
| 테스트케이스 생성 | 입력한 요구사항 기반으로 정상 / 예외 / 경계 케이스 자동 생성 |
| 목록 조회 | 생성된 테스트케이스를 번호와 제목으로 목록 표시 |
| 상세 보기 | 테스트케이스 선택 시 전제조건 / 테스트단계 / 기대결과 / 우선순위 표시 |

## 화면 구성

```
┌─────────────────────────────────────────────────────────┐
│                    AppHeader                            │
├────────────────────────┬────────────────────────────────┤
│                        │   TestCaseListPanel            │
│  RequirementsPanel     ├────────────────────────────────┤
│                        │   TestCaseDetailPanel          │
└────────────────────────┴────────────────────────────────┘
```

## AI API 연동

현재는 샘플 테스트케이스를 생성합니다. 실제 AI 연동이 필요한 경우 [src/App.vue](src/App.vue)의 `generateSampleTestCases` 함수를 API 호출로 교체하세요.

```js
// src/App.vue
async function handleGenerate(form) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  })
  testCases.value = await response.json()
  selectedTestCase.value = testCases.value[0] ?? null
}
```

<template>
  <div class="landing">
    <header class="landing-header">
      <div class="logo">
        <div class="logo-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="white" stroke-width="1" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="logo-text-wrap">
          <span class="logo-brand">Shinhan</span>
          <span class="logo-product">테스트케이스 자동생성</span>
        </div>
      </div>
      <button class="header-start-btn" @click="$emit('start')">시작하기</button>
    </header>

    <main class="hero">
      <div class="hero-content">
        <div class="badge">AI 기반 QA 자동화</div>
        <h1 class="hero-title">
          요구사항을 입력하면<br>
          <span class="highlight">테스트케이스를 자동으로</span><br>
          생성해드립니다
        </h1>
        <p class="hero-desc">
          AI가 요구사항 문서를 분석하여 정상·예외·경계값 케이스를<br>
          체계적으로 작성합니다. Excel 다운로드로 바로 활용하세요.
        </p>
        <div class="hero-actions">
          <button class="cta-btn" @click="$emit('start')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            테스트케이스 생성 시작
          </button>
          <button class="secondary-btn" @click="$emit('history')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            생성 이력 보기
          </button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="card-preview">
          <div class="card-header">
            <div class="card-dot red" /><div class="card-dot yellow" /><div class="card-dot green" />
            <span class="card-title">생성된 테스트케이스</span>
            <span class="card-badge">8개</span>
          </div>
          <div class="card-row active">
            <span class="row-num-dot">1</span>
            <div class="row-info">
              <span class="row-id">TC-001</span>
              <span class="row-name">[정상] 로그인 성공 시나리오</span>
            </div>
            <span class="row-tag blue">신규기능</span>
            <span class="priority high" />
          </div>
          <div class="card-row">
            <span class="row-num-dot">2</span>
            <div class="row-info">
              <span class="row-id">TC-002</span>
              <span class="row-name">[정상] 비밀번호 변경 기능</span>
            </div>
            <span class="row-tag blue">신규기능</span>
            <span class="priority high" />
          </div>
          <div class="card-row">
            <span class="row-num-dot">3</span>
            <div class="row-info">
              <span class="row-id">TC-003</span>
              <span class="row-name">[예외] 잘못된 이메일 형식 입력</span>
            </div>
            <span class="row-tag orange">예외처리</span>
            <span class="priority medium" />
          </div>
          <div class="card-row">
            <span class="row-num-dot">4</span>
            <div class="row-info">
              <span class="row-id">TC-004</span>
              <span class="row-name">[경계] 비밀번호 최대 길이 초과</span>
            </div>
            <span class="row-tag orange">예외처리</span>
            <span class="priority medium" />
          </div>
          <div class="card-row muted">
            <span class="row-num-dot">5</span>
            <div class="row-info">
              <span class="row-id">TC-005</span>
              <span class="row-name">[성능] 동시 접속 처리 성능</span>
            </div>
            <span class="row-tag purple">성능</span>
            <span class="priority low" />
          </div>
          <div class="card-footer">
            <div class="excel-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
              </svg>
              Excel 다운로드
            </div>
          </div>
        </div>
      </div>
    </main>

    <section class="features">
      <div class="features-inner">
        <div class="feature-card">
          <div class="feature-icon blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3>AI 자동 생성</h3>
          <p>Claude / Gemini AI가 요구사항을 분석해 정상·예외·경계값 케이스를 자동으로 작성합니다</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/>
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
            </svg>
          </div>
          <h3>Excel 다운로드</h3>
          <p>생성된 테스트케이스를 Excel로 즉시 내보낼 수 있어 업무에 바로 활용 가능합니다</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h3>생성 이력 관리</h3>
          <p>이전에 생성한 테스트케이스를 언제든지 다시 조회하고 Excel로 재다운로드할 수 있습니다</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
            </svg>
          </div>
          <h3>Excel 업로드 지원</h3>
          <p>요구사항 정의서 Excel 파일을 업로드하면 제목과 업무 내용을 자동으로 불러옵니다</p>
        </div>
      </div>
    </section>

    <footer class="landing-footer">
      <span>© 2026 Shinhan Financial Group. 테스트케이스 자동생성 시스템</span>
    </footer>
  </div>
</template>

<script setup>
defineEmits(['start', 'history'])
</script>

<style scoped>
.landing {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  overflow-y: auto;
}

/* Header */
.landing-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  background: var(--blue-navy);
  flex-shrink: 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  width: 32px;
  height: 32px;
  background: var(--blue-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text-wrap {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-brand {
  font-size: 11px;
  color: var(--blue-light);
  letter-spacing: 0.5px;
}

.logo-product {
  font-size: 14px;
  font-weight: 700;
  color: white;
}

.header-start-btn {
  background: var(--blue-primary);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.header-start-btn:hover { background: #0038CC; }

/* Hero */
.hero {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 80px;
  padding: 80px 60px;
  background: linear-gradient(160deg, var(--blue-navy) 0%, #0038B0 55%, var(--blue-primary) 100%);
  flex: 1;
  min-height: 520px;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 60% 80% at 70% 50%, rgba(75, 175, 245, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.hero-content {
  flex: 1;
  max-width: 520px;
  position: relative;
  z-index: 1;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--blue-light);
  font-size: 12px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 20px;
  margin-bottom: 24px;
  letter-spacing: 0.3px;
}

.hero-title {
  font-size: 38px;
  font-weight: 800;
  color: white;
  line-height: 1.3;
  margin: 0 0 20px;
  letter-spacing: -0.8px;
}

.hero-title .highlight {
  color: var(--blue-sky);
}

.hero-desc {
  font-size: 15px;
  color: rgba(255,255,255,0.65);
  line-height: 1.8;
  margin: 0 0 36px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: var(--blue-navy);
  border: none;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,0,0,0.25); }

.secondary-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1.5px solid rgba(255,255,255,0.25);
  font-size: 14px;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.secondary-btn:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); }

/* Card Preview */
.hero-visual {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.card-preview {
  background: white;
  border-radius: var(--radius-lg);
  width: 400px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.35);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-100);
}

.card-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.card-dot.red { background: #FF5F57; }
.card-dot.yellow { background: #FFBD2E; }
.card-dot.green { background: #28C840; }

.card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-600);
  margin-left: 6px;
  flex: 1;
}

.card-badge {
  background: var(--blue-primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 20px;
}

.card-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  border-bottom: 1px solid var(--gray-100);
  transition: background 0.1s;
}
.card-row.active { background: var(--blue-100); }
.card-row.muted { opacity: 0.55; }

.row-num-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--gray-100);
  color: var(--gray-500);
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.card-row.active .row-num-dot { background: var(--blue-primary); color: white; }

.row-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.row-id {
  font-size: 9px;
  font-weight: 800;
  color: var(--blue-primary);
  letter-spacing: 0.3px;
}

.row-name {
  font-size: 11px;
  color: var(--gray-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-tag {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  flex-shrink: 0;
}
.row-tag.blue { background: var(--blue-100); color: var(--blue-primary); }
.row-tag.orange { background: #FFF4ED; color: #C2410C; }
.row-tag.purple { background: #F5F3FF; color: #7C3AED; }

.priority {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.priority.high { background: var(--red-text); box-shadow: 0 0 0 2px var(--red-bg); }
.priority.medium { background: var(--amber-text); box-shadow: 0 0 0 2px var(--amber-bg); }
.priority.low { background: var(--green-text); box-shadow: 0 0 0 2px var(--green-bg); }

.card-footer {
  padding: 10px 16px;
  display: flex;
  justify-content: flex-end;
  background: var(--gray-50);
}

.excel-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #DCFCE7;
  color: #16A34A;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Features */
.features {
  padding: 60px 40px;
  background: var(--gray-50);
}

.features-inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 28px 24px;
  border: 1.5px solid var(--gray-100);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;
}
.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--blue-200);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.feature-icon.blue { background: var(--blue-50); color: var(--blue-primary); }
.feature-icon.green { background: #F0FDF4; color: #16A34A; }
.feature-icon.purple { background: #F5F3FF; color: #7C3AED; }
.feature-icon.orange { background: #FFF7ED; color: #EA580C; }

.feature-card h3 {
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 8px;
}

.feature-card p {
  font-size: 12px;
  color: var(--gray-500);
  line-height: 1.7;
  margin: 0;
}

/* Footer */
.landing-footer {
  text-align: center;
  padding: 20px;
  font-size: 12px;
  color: var(--gray-400);
  background: white;
  border-top: 1px solid var(--gray-100);
}

@media (max-width: 900px) {
  .hero {
    flex-direction: column;
    padding: 60px 24px;
    gap: 40px;
    text-align: center;
  }
  .hero-title { font-size: 28px; }
  .hero-actions { justify-content: center; }
  .card-preview { width: 100%; max-width: 400px; }
  .features-inner { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .features-inner { grid-template-columns: 1fr; }
  .landing-header { padding: 0 20px; }
}
</style>

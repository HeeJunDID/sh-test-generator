<template>
  <header class="app-header">
    <div class="header-left">
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
      <div class="divider" />
      <nav class="tab-nav">
        <button class="tab-btn active">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          요구사항 정의
        </button>
      </nav>
    </div>
    <div class="header-right">
      <button class="icon-btn" title="검색">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      <button class="icon-btn" title="알림">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      </button>
      <div class="avatar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--blue-navy);
  padding: 0 24px;
  height: 58px;
  color: white;
  position: relative;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
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
  flex-shrink: 0;
}

.logo-text-wrap {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-brand {
  font-size: 11px;
  font-weight: 400;
  color: var(--blue-light);
  letter-spacing: 0.5px;
}

.logo-product {
  font-size: 14px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.2px;
}

.divider {
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.15);
}

.tab-nav {
  display: flex;
  gap: 4px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.tab-btn.active {
  background: rgba(255,255,255,0.12);
  color: white;
}

.tab-btn:hover:not(.active) {
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.85);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.icon-btn:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--blue-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-left: 4px;
  cursor: pointer;
  border: 2px solid rgba(255,255,255,0.2);
  transition: border-color 0.15s;
}

.avatar:hover {
  border-color: rgba(255,255,255,0.5);
}
</style>

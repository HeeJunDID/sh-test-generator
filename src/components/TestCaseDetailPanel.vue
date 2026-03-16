<template>
  <div class="panel">
    <h2 class="panel-title">상세 테스트케이스</h2>

    <div v-if="!selected" class="empty-state">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <p class="empty-title">테스트케이스를 선택하세요</p>
      <p class="empty-desc">좌측 목록에서 항목을 클릭하면 상세 내용이 표시됩니다</p>
    </div>

    <div v-else class="detail-content">
      <div class="detail-header">
        <div class="header-top">
          <div class="id-row">
            <span class="detail-id">{{ selected.id }}</span>
            <span v-if="selected.programName" class="detail-program">{{ selected.programName }}</span>
          </div>
          <div class="header-badges">
            <span class="tag" :class="categoryClass(selected.category)">{{ selected.category }}</span>
            <span class="priority-badge" :class="selected.priority">{{ priorityLabel }}</span>
          </div>
        </div>
        <h3 class="detail-title">{{ selected.title }}</h3>
      </div>

      <div class="section-grid">
        <div class="detail-section">
          <div class="section-label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            전제조건
          </div>
          <p class="section-value">{{ selected.precondition || '-' }}</p>
        </div>

        <div class="detail-section">
          <div class="section-label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            테스트 단계
          </div>
          <ol class="steps-list">
            <li v-for="(step, i) in selected.steps" :key="i">
              <span class="step-num">{{ i + 1 }}</span>
              <span>{{ step }}</span>
            </li>
          </ol>
        </div>

        <div class="detail-section">
          <div class="section-label">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            기대 결과
          </div>
          <p class="section-value highlight">{{ selected.expected }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  selected: { type: Object, default: null }
})

const priorityLabel = computed(() => {
  return { high: '높음', medium: '보통', low: '낮음' }[props.selected?.priority] ?? '-'
})

function categoryClass(cat) {
  if (!cat) return ''
  if (cat.includes('예외')) return 'tag-orange'
  if (cat.includes('성능')) return 'tag-purple'
  return 'tag-blue'
}
</script>

<style scoped>
.panel {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  flex: 1;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 20px;
  letter-spacing: -0.3px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 8px;
  color: var(--gray-300);
}

.empty-icon { opacity: 0.5; }

.empty-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-400);
  margin: 0;
}

.empty-desc {
  font-size: 12px;
  color: var(--gray-300);
  margin: 0;
  text-align: center;
}

.detail-content { display: flex; flex-direction: column; gap: 20px; }

.detail-header {
  padding: 16px;
  background: var(--blue-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--blue-100);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.id-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-id {
  font-size: 11px;
  font-weight: 800;
  color: var(--blue-primary);
  letter-spacing: 0.5px;
}

.detail-program {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-500);
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: white;
  border: 1px solid var(--blue-200);
  padding: 1px 7px;
  border-radius: 4px;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--blue-navy);
  margin: 0;
  line-height: 1.5;
}

.tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.tag-blue { background: var(--blue-100); color: var(--blue-primary); }
.tag-orange { background: #FFF4ED; color: #C2410C; }
.tag-purple { background: #F5F3FF; color: #7C3AED; }

.priority-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.priority-badge.high { background: var(--red-bg); color: var(--red-text); }
.priority-badge.medium { background: var(--amber-bg); color: var(--amber-text); }
.priority-badge.low { background: var(--green-bg); color: var(--green-text); }

.section-grid { display: flex; flex-direction: column; gap: 16px; }

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.section-value {
  font-size: 13px;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.7;
  padding: 10px 12px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--gray-200);
}

.section-value.highlight {
  border-left-color: var(--blue-primary);
  background: var(--blue-50);
  color: var(--blue-navy);
  font-weight: 500;
}

.steps-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.steps-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--gray-600);
  line-height: 1.6;
  padding: 8px 12px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
}

.step-num {
  min-width: 20px;
  height: 20px;
  background: var(--blue-primary);
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
</style>

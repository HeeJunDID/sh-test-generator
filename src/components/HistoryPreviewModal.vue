<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-meta">
              <span class="modal-date">{{ formatDate(history?.createdAt) }}</span>
              <span class="tag" :class="categoryClass(history?.devCategory)" v-if="history?.devCategory">
                {{ history.devCategory }}
              </span>
            </div>
            <h2 class="modal-title">{{ history?.title }}</h2>
          </div>
          <div class="modal-header-right">
            <button class="excel-btn" @click="downloadExcel" :disabled="!history?.testCases?.length">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
              </svg>
              Excel 다운로드
            </button>
            <button class="close-btn" @click="$emit('close')" title="닫기">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="modal-body" v-if="isLoading">
          <div class="loading-state">
            <div class="spinner" />
            <span>불러오는 중...</span>
          </div>
        </div>

        <div class="modal-body" v-else-if="history">
          <div class="split-view">
            <div class="list-pane">
              <div class="pane-header">
                <span class="pane-title">테스트케이스 목록</span>
                <span class="count-badge">{{ history.testCases.length }}개</span>
              </div>
              <div class="table-wrapper">
                <div class="table-head">
                  <div class="col-no">No</div>
                  <div class="col-title">테스트케이스</div>
                  <div class="col-program">프로그램명</div>
                  <div class="col-badge">구분</div>
                  <div class="col-priority">우선순위</div>
                </div>
                <div class="table-body">
                  <div
                    v-for="(tc, index) in history.testCases"
                    :key="tc.id"
                    class="table-row"
                    :class="{ selected: selectedTc?.id === tc.id }"
                    @click="selectedTc = tc"
                  >
                    <div class="col-no">
                      <span class="row-num" :class="{ active: selectedTc?.id === tc.id }">{{ index + 1 }}</span>
                    </div>
                    <div class="col-title">
                      <span class="tc-id">{{ tc.id }}</span>
                      <span class="tc-title">{{ tc.title }}</span>
                    </div>
                    <div class="col-program">
                      <span class="program-name">{{ tc.programName || '-' }}</span>
                    </div>
                    <div class="col-badge">
                      <span class="tag" :class="tcCategoryClass(tc.category)">{{ tc.category }}</span>
                    </div>
                    <div class="col-priority">
                      <span class="priority-dot" :class="tc.priority" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-pane">
              <div class="pane-header">
                <span class="pane-title">상세 테스트케이스</span>
              </div>
              <div v-if="!selectedTc" class="empty-detail">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p>목록에서 항목을 선택하세요</p>
              </div>
              <div v-else class="detail-content">
                <div class="detail-header">
                  <div class="id-row">
                    <span class="detail-id">{{ selectedTc.id }}</span>
                    <span v-if="selectedTc.programName" class="detail-program">{{ selectedTc.programName }}</span>
                  </div>
                  <div class="header-badges">
                    <span class="tag" :class="tcCategoryClass(selectedTc.category)">{{ selectedTc.category }}</span>
                    <span class="priority-badge" :class="selectedTc.priority">{{ priorityLabel }}</span>
                  </div>
                  <h3 class="detail-title">{{ selectedTc.title }}</h3>
                </div>

                <div class="detail-section">
                  <div class="section-label">전제조건</div>
                  <p class="section-value">{{ selectedTc.precondition || '-' }}</p>
                </div>

                <div class="detail-section">
                  <div class="section-label">테스트 단계</div>
                  <ol class="steps-list">
                    <li v-for="(step, i) in selectedTc.steps" :key="i">
                      <span class="step-num">{{ i + 1 }}</span>
                      <span>{{ step }}</span>
                    </li>
                  </ol>
                </div>

                <div class="detail-section">
                  <div class="section-label">기대 결과</div>
                  <p class="section-value highlight">{{ selectedTc.expected }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { getHistoryDetail } from '../api/testcase.js'

const props = defineProps({
  historyId: { type: Number, required: true }
})

const emit = defineEmits(['close', 'error'])

const history = ref(null)
const isLoading = ref(false)
const selectedTc = ref(null)

const priorityLabel = computed(() => {
  return { high: '높음', medium: '보통', low: '낮음' }[selectedTc.value?.priority] ?? '-'
})

async function load() {
  isLoading.value = true
  try {
    history.value = await getHistoryDetail(props.historyId)
    selectedTc.value = history.value.testCases[0] ?? null
  } catch (e) {
    emit('error', e.message)
    emit('close')
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function categoryClass(cat) {
  if (!cat) return ''
  if (cat === 'batch') return 'tag-purple'
  if (cat === 'online') return 'tag-orange'
  return 'tag-blue'
}

function tcCategoryClass(cat) {
  if (!cat) return ''
  if (cat.includes('예외')) return 'tag-orange'
  if (cat.includes('성능')) return 'tag-purple'
  return 'tag-blue'
}

function downloadExcel() {
  if (!history.value?.testCases?.length) return
  const rows = history.value.testCases.map((tc, i) => ({
    'No': i + 1,
    'ID': tc.id,
    '프로그램명': tc.programName ?? '',
    '테스트케이스': tc.title,
    '테스트 데이터': tc.testData ?? '',
    '전제조건': tc.precondition ?? '',
    '테스트 단계': (tc.steps ?? []).join('\n'),
    '기대 결과': tc.expected ?? '',
    '우선순위': { high: '높음', medium: '보통', low: '낮음' }[tc.priority] ?? '',
    '구분': tc.category ?? ''
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '테스트케이스')
  const safeTitle = (history.value.title ?? '테스트케이스').replace(/[\\/:*?"<>|]/g, '_').slice(0, 30)
  XLSX.writeFile(wb, `${safeTitle}_테스트케이스.xlsx`)
}

onMounted(load)
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
  width: 100%;
  max-width: 1100px;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1.5px solid var(--gray-100);
  gap: 16px;
  flex-shrink: 0;
}

.modal-header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-date {
  font-size: 12px;
  color: var(--gray-400);
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.modal-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
  letter-spacing: -0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modal-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.excel-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #16A34A;
  color: white;
  border: none;
  font-size: 12px;
  font-weight: 600;
  padding: 7px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}
.excel-btn:hover { background: #15803D; }
.excel-btn:disabled { background: var(--gray-200); color: var(--gray-400); cursor: not-allowed; }

.close-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.close-btn:hover { background: var(--gray-100); color: var(--gray-700); }

.modal-body {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  color: var(--gray-400);
  font-size: 13px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--gray-100);
  border-top-color: var(--blue-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.split-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  overflow: hidden;
}

.list-pane {
  display: flex;
  flex-direction: column;
  border-right: 1.5px solid var(--gray-100);
  overflow: hidden;
}

.detail-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.pane-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-100);
  background: var(--gray-50);
  flex-shrink: 0;
}

.pane-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.count-badge {
  background: var(--blue-primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 7px;
  border-radius: 20px;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.table-head {
  display: grid;
  grid-template-columns: 40px 1fr 90px 65px 52px;
  background: var(--blue-navy);
  color: rgba(255,255,255,0.85);
  padding: 8px 12px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.col-no, .col-badge, .col-priority { text-align: center; }

.table-body {
  overflow-y: auto;
  flex: 1;
}

.table-row {
  display: grid;
  grid-template-columns: 40px 1fr 90px 65px 52px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--gray-100);
  cursor: pointer;
  transition: background 0.1s;
  align-items: center;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: var(--blue-50); }
.table-row.selected { background: var(--blue-100); }

.row-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  background: var(--gray-100);
  color: var(--gray-500);
  margin: 0 auto;
}
.row-num.active { background: var(--blue-primary); color: white; }

.col-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.tc-id {
  font-size: 10px;
  font-weight: 700;
  color: var(--blue-primary);
  letter-spacing: 0.3px;
}

.tc-title {
  font-size: 11px;
  font-weight: 500;
  color: var(--gray-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.program-name {
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-500);
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: var(--gray-100);
  padding: 1px 5px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
}

.tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  letter-spacing: 0.2px;
}
.tag-blue { background: var(--blue-100); color: var(--blue-primary); }
.tag-orange { background: #FFF4ED; color: #C2410C; }
.tag-purple { background: #F5F3FF; color: #7C3AED; }

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
.priority-dot.high { background: var(--red-text); box-shadow: 0 0 0 3px var(--red-bg); }
.priority-dot.medium { background: var(--amber-text); box-shadow: 0 0 0 3px var(--amber-bg); }
.priority-dot.low { background: var(--green-text); box-shadow: 0 0 0 3px var(--green-bg); }

.empty-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  color: var(--gray-300);
  font-size: 12px;
}

.detail-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-header {
  padding: 14px;
  background: var(--blue-50);
  border-radius: var(--radius-md);
  border: 1px solid var(--blue-100);
  display: flex;
  flex-direction: column;
  gap: 7px;
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
  font-size: 10px;
  font-weight: 600;
  color: var(--gray-500);
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: white;
  border: 1px solid var(--blue-200);
  padding: 1px 6px;
  border-radius: 3px;
}

.header-badges {
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--blue-navy);
  margin: 0;
  line-height: 1.5;
}

.priority-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
}
.priority-badge.high { background: var(--red-bg); color: var(--red-text); }
.priority-badge.medium { background: var(--amber-bg); color: var(--amber-text); }
.priority-badge.low { background: var(--green-bg); color: var(--green-text); }

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-400);
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.section-value {
  font-size: 12px;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.7;
  padding: 9px 11px;
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
  gap: 5px;
}

.steps-list li {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 12px;
  color: var(--gray-600);
  line-height: 1.6;
  padding: 7px 10px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
}

.step-num {
  min-width: 18px;
  height: 18px;
  background: var(--blue-primary);
  color: white;
  border-radius: 50%;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
</style>

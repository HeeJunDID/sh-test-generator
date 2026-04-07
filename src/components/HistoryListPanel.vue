<template>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-header-left">
        <h2 class="panel-title">생성 이력</h2>
        <div class="count-badge" v-if="historyList.length > 0">{{ historyList.length }}건</div>
      </div>
      <button class="refresh-btn" @click="loadHistory" :disabled="isLoading" title="새로고침">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ spinning: isLoading }">
          <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      </button>
    </div>

    <div class="table-wrapper">
      <div class="table-head">
        <div class="col-no">No</div>
        <div class="col-title">요구사항 제목</div>
        <div class="col-category">개발구분</div>
        <div class="col-count">케이스 수</div>
        <div class="col-date">생성일시</div>
        <div class="col-action"></div>
      </div>

      <div v-if="isLoading" class="table-body">
        <div v-for="n in 5" :key="n" class="table-row skeleton-row">
          <div class="col-no"><span class="skel skel-circle" /></div>
          <div class="col-title"><span class="skel skel-line" style="width: 70%; height: 13px;" /></div>
          <div class="col-category"><span class="skel skel-line" style="width: 50px; height: 18px; border-radius: 20px;" /></div>
          <div class="col-count"><span class="skel skel-line" style="width: 30px; height: 13px; margin: 0 auto;" /></div>
          <div class="col-date"><span class="skel skel-line" style="width: 90%; height: 12px;" /></div>
          <div class="col-action"><span class="skel skel-line" style="width: 56px; height: 26px; border-radius: 6px;" /></div>
        </div>
      </div>

      <div v-else-if="historyList.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <p class="empty-title">생성 이력이 없습니다</p>
        <p class="empty-desc">요구사항 정의 탭에서 테스트케이스를 생성하면 이력이 기록됩니다</p>
      </div>

      <div v-else class="table-body">
        <div
          v-for="(item, index) in historyList"
          :key="item.id"
          class="table-row"
          @click="openPreview(item.id)"
        >
          <div class="col-no">
            <span class="row-num">{{ index + 1 }}</span>
          </div>
          <div class="col-title">
            <span class="item-title">{{ item.title }}</span>
            <span class="item-desc" v-if="item.description">{{ item.description }}</span>
          </div>
          <div class="col-category">
            <span class="tag" :class="categoryClass(item.devCategory)">{{ item.devCategory || '-' }}</span>
          </div>
          <div class="col-count">
            <span class="count-num">{{ item.testCaseCount }}</span>
          </div>
          <div class="col-date">
            <span class="date-text">{{ formatDate(item.createdAt) }}</span>
          </div>
          <div class="col-action">
            <button class="view-btn" @click.stop="openPreview(item.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              미리보기
            </button>
          </div>
        </div>
      </div>
    </div>

    <HistoryPreviewModal
      v-if="selectedHistoryId !== null"
      :history-id="selectedHistoryId"
      @close="selectedHistoryId = null"
      @error="$emit('error', $event)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHistoryList } from '../api/testcase.js'
import HistoryPreviewModal from './HistoryPreviewModal.vue'

const emit = defineEmits(['error'])

const historyList = ref([])
const isLoading = ref(false)
const selectedHistoryId = ref(null)

async function loadHistory() {
  isLoading.value = true
  try {
    historyList.value = await getHistoryList()
  } catch (e) {
    emit('error', e.message)
  } finally {
    isLoading.value = false
  }
}

function openPreview(id) {
  selectedHistoryId.value = id
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

onMounted(loadHistory)
</script>

<style scoped>
.panel {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
  width: 100%;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.panel-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
  letter-spacing: -0.3px;
}

.count-badge {
  background: var(--blue-primary);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}

.refresh-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.refresh-btn:hover { background: var(--gray-100); color: var(--gray-700); }
.refresh-btn:disabled { cursor: not-allowed; opacity: 0.5; }

.spinning {
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.table-wrapper {
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table-head {
  display: grid;
  grid-template-columns: 48px 1fr 90px 80px 160px 90px;
  background: var(--blue-navy);
  color: rgba(255,255,255,0.85);
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.col-no { text-align: center; }
.col-count { text-align: center; }
.col-action { text-align: center; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  gap: 8px;
  color: var(--gray-300);
}

.empty-icon { opacity: 0.6; }

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

.table-body {
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.table-row {
  display: grid;
  grid-template-columns: 48px 1fr 90px 80px 160px 90px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--gray-100);
  cursor: pointer;
  transition: background 0.1s;
  align-items: center;
}
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: var(--blue-50); }

.row-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  background: var(--gray-100);
  color: var(--gray-500);
  margin: 0 auto;
}

.col-title {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.item-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-800);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-desc {
  font-size: 11px;
  color: var(--gray-400);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.2px;
}
.tag-blue { background: var(--blue-100); color: var(--blue-primary); }
.tag-orange { background: #FFF4ED; color: #C2410C; }
.tag-purple { background: #F5F3FF; color: #7C3AED; }

.count-num {
  display: block;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: var(--blue-primary);
}

.date-text {
  font-size: 12px;
  color: var(--gray-500);
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.view-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: var(--blue-50);
  border: 1px solid var(--blue-100);
  color: var(--blue-primary);
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}
.view-btn:hover { background: var(--blue-100); border-color: var(--blue-primary); }

.skeleton-row { cursor: default; pointer-events: none; }
.skeleton-row:hover { background: transparent; }

.skel {
  display: block;
  background: linear-gradient(90deg, var(--gray-100) 25%, #e8ecf0 50%, var(--gray-100) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 4px;
}

.skel-circle {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  margin: 0 auto;
}

.skel-line { height: 11px; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>

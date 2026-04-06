<template>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-header-left">
        <h2 class="panel-title">생성된 테스트케이스</h2>
        <div class="count-badge" v-if="testCases.length > 0">{{ testCases.length }}개</div>
      </div>
      <div class="panel-header-right">
        <div class="more-menu" ref="moreMenuRef">
          <button class="more-btn" @click="moreOpen = !moreOpen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>
          <Transition name="drop">
            <ul class="more-dropdown" v-show="moreOpen">
              <li :class="{ disabled: testCases.length === 0 }" @click="testCases.length > 0 && (downloadExcel(), moreOpen = false)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="8 17 12 21 16 17"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>
                </svg>
                Excel 다운로드
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-head">
        <div class="col-no">No</div>
        <div class="col-title">테스트케이스</div>
        <div class="col-program">프로그램명</div>
        <div class="col-testdata">테스트 데이터</div>
        <div class="col-badge">구분</div>
        <div class="col-priority">우선순위</div>
      </div>

      <div v-if="isLoading" class="table-body">
        <div v-for="n in 6" :key="n" class="table-row skeleton-row">
          <div class="col-no"><span class="skel skel-circle" /></div>
          <div class="col-title">
            <span class="skel skel-line" style="width: 52px; height: 10px;" />
            <span class="skel skel-line" style="width: 85%; height: 12px; margin-top: 4px;" />
          </div>
          <div class="col-program"><span class="skel skel-line" style="width: 80px; height: 20px; border-radius: 4px;" /></div>
          <div class="col-testdata"><span class="skel skel-line" style="width: 90%; height: 11px;" /></div>
          <div class="col-badge" style="display:flex;justify-content:center;"><span class="skel skel-line" style="width: 44px; height: 18px; border-radius: 20px;" /></div>
          <div class="col-priority" style="display:flex;justify-content:center;"><span class="skel skel-circle" style="width: 14px; height: 14px;" /></div>
        </div>
      </div>

      <div v-else-if="testCases.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/>
          </svg>
        </div>
        <p class="empty-title">테스트케이스가 없습니다</p>
        <p class="empty-desc">요구사항을 입력하고 생성 버튼을 눌러주세요</p>
      </div>

      <div v-else class="table-body">
        <div
          v-for="(tc, index) in testCases"
          :key="tc.id"
          class="table-row"
          :class="{ selected: selectedId === tc.id }"
          @click="emit('select', tc)"
        >
          <div class="col-no">
            <span class="row-num">{{ index + 1 }}</span>
          </div>
          <div class="col-title">
            <span class="tc-id">{{ tc.id }}</span>
            <span class="tc-title">{{ tc.title }}</span>
          </div>
          <div class="col-program">
            <span class="program-name">{{ tc.programName || '-' }}</span>
          </div>
          <div class="col-testdata">
            <span class="testdata-text">{{ tc.testData || '-' }}</span>
          </div>
          <div class="col-badge">
            <span class="tag" :class="categoryClass(tc.category)">{{ tc.category }}</span>
          </div>
          <div class="col-priority">
            <span class="priority-dot" :class="tc.priority" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  testCases: { type: Array, default: () => [] },
  selectedId: { type: [String, Number], default: null },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['select'])

const moreOpen = ref(false)
const moreMenuRef = ref(null)

function handleClickOutside(e) {
  if (moreMenuRef.value && !moreMenuRef.value.contains(e.target)) moreOpen.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

function categoryClass(cat) {
  if (!cat) return ''
  if (cat.includes('예외')) return 'tag-orange'
  if (cat.includes('성능')) return 'tag-purple'
  return 'tag-blue'
}

function downloadExcel() {
  const rows = props.testCases.map((tc, i) => ({
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
  XLSX.writeFile(wb, '테스트케이스_목록.xlsx')
}
</script>

<style scoped>
.panel {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-100);
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

.panel-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
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

.more-menu { position: relative; }

.more-btn {
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
.more-btn:hover { background: var(--gray-100); color: var(--gray-700); }

.more-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  list-style: none;
  margin: 0;
  padding: 6px;
  min-width: 148px;
  z-index: 200;
}

.more-dropdown li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.1s;
}
.more-dropdown li:hover:not(.disabled) { background: var(--blue-50); color: var(--blue-primary); }
.more-dropdown li.disabled { color: var(--gray-300); cursor: not-allowed; }

.table-wrapper {
  border: 1.5px solid var(--gray-100);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table-head {
  display: grid;
  grid-template-columns: 48px 1fr 110px 140px 72px 60px;
  background: var(--blue-navy);
  color: rgba(255,255,255,0.85);
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.col-no { text-align: center; }
.col-program { font-size: 11px; }
.col-testdata { font-size: 11px; min-width: 0; }
.col-badge, .col-priority { text-align: center; }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 44px 24px;
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
  max-height: 280px;
}

.table-row {
  display: grid;
  grid-template-columns: 48px 1fr 110px 140px 72px 60px;
  padding: 10px 14px;
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
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 11px;
  font-weight: 700;
  background: var(--gray-100);
  color: var(--gray-500);
  margin: 0 auto;
}
.table-row.selected .row-num {
  background: var(--blue-primary);
  color: white;
}

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
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-row.selected .tc-title { color: var(--blue-navy); font-weight: 600; }

.program-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--gray-500);
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: var(--gray-100);
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  max-width: 100%;
}
.table-row.selected .program-name { background: var(--blue-200); color: var(--blue-navy); }

.testdata-text {
  font-size: 11px;
  color: var(--gray-500);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.tag {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
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

.drop-enter-active, .drop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

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

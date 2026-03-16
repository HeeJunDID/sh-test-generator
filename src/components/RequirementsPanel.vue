<template>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-header-left">
        <h2 class="panel-title">요구사항 정의</h2>
        <p class="panel-desc">테스트케이스 생성을 위해 아래 요구사항을 입력해 주세요.</p>
      </div>
      <div class="panel-header-right">
        <input
          ref="fileInputRef"
          type="file"
          accept=".xlsx,.xls,.csv"
          class="hidden-input"
          @change="handleFileChange"
        />
        <div v-if="uploadedFile" class="file-chip">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>{{ uploadedFile.name }}</span>
          <button class="file-remove" @click="removeFile">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="more-menu" ref="moreMenuRef">
          <button class="more-btn" @click="moreOpen = !moreOpen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>
          <Transition name="drop">
            <ul class="more-dropdown" v-show="moreOpen">
              <li @click="fileInputRef.click(); moreOpen = false">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                </svg>
                Excel 업로드
              </li>
            </ul>
          </Transition>
        </div>
      </div>
    </div>

    <div class="form">
      <div class="form-group">
        <label class="form-label">제목</label>
        <input
          v-model="form.title"
          type="text"
          class="form-input"
          placeholder="요구사항 제목을 입력하세요"
        />
      </div>

      <div class="form-group">
        <label class="form-label">업무내용</label>
        <textarea
          v-model="form.description"
          class="form-textarea"
          placeholder="업무 내용을 상세히 입력하세요"
          rows="5"
        />
      </div>

      <div class="form-row">
        <BaseDropdown label="개발구분" v-model="form.devCategory" :options="devCategoryOptions" />
        <BaseDropdown label="신규여부" v-model="form.isNew" :options="isNewOptions" />
      </div>

      <div class="form-row">
        <BaseDropdown label="DB 작업여부" v-model="form.dbWork" :options="dbWorkOptions" />
        <BaseDropdown label="금전여부" v-model="form.monetary" :options="monetaryOptions" />
      </div>

      <button class="generate-btn" @click="handleGenerate" :disabled="isLoading">
        <span v-if="isLoading" class="spinner" />
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
        {{ isLoading ? '생성 중...' : '테스트케이스 생성' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import * as XLSX from 'xlsx'
import BaseDropdown from './BaseDropdown.vue'

const emit = defineEmits(['generate'])

const isLoading = ref(false)
const uploadedFile = ref(null)
const fileInputRef = ref(null)
const moreOpen = ref(false)
const moreMenuRef = ref(null)

function handleClickOutside(e) {
  if (moreMenuRef.value && !moreMenuRef.value.contains(e.target)) moreOpen.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

const form = reactive({
  title: '회원정보 다운로드 및 업로드 기능 개선',
  description: '화면 전달은 Excel 그리드 다운로드 및 업로드 될 수 있는 기능을 추가 요청합니다.',
  devCategory: 'screen',
  isNew: 'new',
  dbWork: 'target',
  monetary: 'yes'
})

const devCategoryOptions = [
  { value: 'screen', label: '화면' },
  { value: 'online', label: '온라인' },
  { value: 'batch',  label: '배치' }
]

const isNewOptions = [
  { value: 'new',      label: '신규' },
  { value: 'existing', label: '기존' }
]

const dbWorkOptions = [
  { value: 'target',     label: '대상' },
  { value: 'non-target', label: '미대상' }
]

const monetaryOptions = [
  { value: 'yes', label: '해당' },
  { value: 'no',  label: '해당안함' }
]

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file) parseExcel(file)
  e.target.value = ''
}

function parseExcel(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const workbook = XLSX.read(e.target.result, { type: 'array' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    const headers = rows[0]?.map(h => String(h).trim()) ?? []
    const data = rows[1] ?? []
    const get = (keywords) => {
      const idx = headers.findIndex(h => keywords.some(k => h.includes(k)))
      return idx !== -1 ? String(data[idx] ?? '').trim() : ''
    }
    const title = get(['제목', 'title'])
    const description = get(['업무내용', '내용', 'description'])
    if (title) form.title = title
    if (description) form.description = description
    uploadedFile.value = file
  }
  reader.readAsArrayBuffer(file)
}

function removeFile() { uploadedFile.value = null }

async function handleGenerate() {
  if (!form.title || !form.description) return
  isLoading.value = true
  await new Promise(r => setTimeout(r, 800))
  emit('generate', { ...form })
  isLoading.value = false
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
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 12px;
}

.panel-header-left { display: flex; flex-direction: column; gap: 3px; }
.panel-header-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.panel-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
  letter-spacing: -0.3px;
}

.panel-desc {
  font-size: 12px;
  color: var(--gray-400);
  margin: 0;
}

.hidden-input { display: none; }

.file-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  background: var(--blue-50);
  border: 1px solid var(--blue-200);
  color: var(--blue-primary);
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 20px;
  max-width: 160px;
}

.file-chip span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--blue-primary);
  display: flex;
  align-items: center;
  padding: 1px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.6;
}
.file-remove:hover { opacity: 1; }

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
.more-dropdown li:hover { background: var(--blue-50); color: var(--blue-primary); }

.form { display: flex; flex-direction: column; gap: 16px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-500);
  letter-spacing: 0.2px;
}

.form-input {
  padding: 9px 12px;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: white;
}
.form-input:hover { border-color: var(--blue-royal); }
.form-input:focus { border-color: var(--blue-primary); box-shadow: 0 0 0 3px var(--blue-100); }

.form-textarea {
  padding: 10px 12px;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
  font-family: inherit;
  outline: none;
  resize: vertical;
  background: #FFFEF0;
  transition: border-color 0.15s, box-shadow 0.15s;
  line-height: 1.7;
}
.form-textarea:hover { border-color: var(--blue-royal); }
.form-textarea:focus { border-color: var(--blue-primary); box-shadow: 0 0 0 3px var(--blue-100); background: white; }

.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.generate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 13px;
  background: var(--blue-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  margin-top: 4px;
  letter-spacing: -0.2px;
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(0,70,255,0.35);
}
.generate-btn:hover:not(:disabled) {
  background: var(--blue-royal);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,70,255,0.4);
}
.generate-btn:active:not(:disabled) { transform: translateY(0); }
.generate-btn:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.drop-enter-active, .drop-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }
</style>

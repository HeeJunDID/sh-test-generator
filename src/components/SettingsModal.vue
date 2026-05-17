<script setup>
import { ref } from 'vue'
import { user, updateUserSettings } from '../composables/useAuth.js'
import { updateSettingsApi } from '../api/auth.js'

const emit = defineEmits(['close'])

const selectedProvider = ref(user.value?.preferredAiProvider || 'dify')
const loading = ref(false)
const saved = ref(false)
const error = ref(null)

const providers = [
  { key: 'dify', label: 'Dify Workflow', desc: '사내 Dify 워크플로우 API' },
  { key: 'gemini', label: 'Gemini', desc: 'Google Gemini 2.5 Flash' },
  { key: 'claude', label: 'Claude', desc: 'Anthropic Claude' }
]

async function handleSave() {
  loading.value = true
  error.value = null
  saved.value = false
  try {
    await updateSettingsApi(selectedProvider.value)
    updateUserSettings({ preferredAiProvider: selectedProvider.value })
    saved.value = true
    setTimeout(() => emit('close'), 800)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">설정</h2>
          <button class="close-btn" @click="emit('close')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="section">
            <div class="section-label">AI 제공자 선택</div>
            <div class="section-desc">테스트케이스 생성에 사용할 AI API를 선택하세요.</div>
            <div class="provider-list">
              <label v-for="p in providers" :key="p.key" class="provider-item" :class="{ active: selectedProvider === p.key }">
                <input type="radio" v-model="selectedProvider" :value="p.key" />
                <div class="provider-info">
                  <span class="provider-name">{{ p.label }}</span>
                  <span class="provider-desc">{{ p.desc }}</span>
                </div>
                <div class="check-mark" v-if="selectedProvider === p.key">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </label>
            </div>
          </div>

          <div v-if="error" class="error-msg">{{ error }}</div>
          <div v-if="saved" class="success-msg">설정이 저장되었습니다.</div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="emit('close')">취소</button>
            <button class="btn-save" :disabled="loading" @click="handleSave">
              <span v-if="loading" class="spinner" />
              {{ loading ? '저장 중...' : '저장' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 60, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  border-radius: 16px;
  width: 400px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-100, #f3f4f6);
}

.modal-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-900, #111827);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: var(--gray-400, #9ca3af);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  transition: color 0.15s;
}

.close-btn:hover { color: var(--gray-700, #374151); }

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700, #374151);
  margin-bottom: 4px;
}

.section-desc {
  font-size: 12px;
  color: var(--gray-500, #6b7280);
  margin-bottom: 12px;
}

.provider-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.provider-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid var(--gray-200, #e5e7eb);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
}

.provider-item input[type="radio"] { display: none; }

.provider-item.active {
  border-color: var(--blue-primary, #1a56db);
  background: #f0f5ff;
}

.provider-item:hover:not(.active) {
  border-color: var(--gray-300, #d1d5db);
  background: var(--gray-50, #f9fafb);
}

.provider-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2px;
}

.provider-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-800, #1f2937);
}

.provider-desc {
  font-size: 11px;
  color: var(--gray-500, #6b7280);
}

.check-mark {
  color: var(--blue-primary, #1a56db);
}

.error-msg {
  font-size: 12px;
  color: #ef4444;
  background: #fef2f2;
  border-radius: 6px;
  padding: 8px 10px;
}

.success-msg {
  font-size: 12px;
  color: #16a34a;
  background: #f0fdf4;
  border-radius: 6px;
  padding: 8px 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}

.btn-cancel {
  background: none;
  border: 1.5px solid var(--gray-200, #e5e7eb);
  color: var(--gray-600, #4b5563);
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  border-color: var(--gray-300, #d1d5db);
  background: var(--gray-50, #f9fafb);
}

.btn-save {
  background: var(--blue-primary, #1a56db);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s;
}

.btn-save:hover:not(:disabled) { background: #1447c0; }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

.spinner {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>

<script setup>
import { ref } from 'vue'
import { loginApi } from '../api/auth.js'
import { setAuth } from '../composables/useAuth.js'

const emit = defineEmits(['success', 'close'])

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  if (!username.value || !password.value) {
    error.value = '아이디와 비밀번호를 입력하세요.'
    return
  }
  error.value = null
  loading.value = true
  try {
    const data = await loginApi(username.value, password.value)
    setAuth(data)
    emit('success')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function handleKeydown(e) {
  if (e.key === 'Enter') handleLogin()
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-logo">
            <div class="logo-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="white" stroke-width="1" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>Shinhan</span>
          </div>
          <h2 class="modal-title">로그인</h2>
          <p class="modal-subtitle">테스트케이스 자동생성 시스템</p>
        </div>

        <div class="modal-body">
          <div class="field">
            <label class="field-label">아이디</label>
            <input
              v-model="username"
              class="field-input"
              type="text"
              placeholder="아이디를 입력하세요"
              @keydown="handleKeydown"
              autofocus
            />
          </div>
          <div class="field">
            <label class="field-label">비밀번호</label>
            <input
              v-model="password"
              class="field-input"
              type="password"
              placeholder="비밀번호를 입력하세요"
              @keydown="handleKeydown"
            />
          </div>

          <div v-if="error" class="error-msg">{{ error }}</div>

          <button class="login-btn" :disabled="loading" @click="handleLogin">
            <span v-if="loading" class="spinner" />
            {{ loading ? '로그인 중...' : '로그인' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 60, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  border-radius: 16px;
  width: 360px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.modal-header {
  background: var(--blue-navy);
  padding: 28px 28px 24px;
  text-align: center;
}

.modal-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
  color: var(--blue-light, #a8c4e0);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logo-mark {
  width: 28px;
  height: 28px;
  background: var(--blue-primary, #1a56db);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
}

.modal-subtitle {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

.modal-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-600, #4b5563);
}

.field-input {
  border: 1.5px solid var(--gray-200, #e5e7eb);
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
}

.field-input:focus {
  border-color: var(--blue-primary, #1a56db);
}

.error-msg {
  font-size: 12px;
  color: #ef4444;
  background: #fef2f2;
  border-radius: 6px;
  padding: 8px 10px;
}

.login-btn {
  background: var(--blue-primary, #1a56db);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) {
  background: #1447c0;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

<script setup>
import { ref } from 'vue'
import { registerApi } from '../api/auth.js'

const emit = defineEmits(['success', 'close', 'go-login'])

const form = ref({ username: '', password: '', passwordConfirm: '', displayName: '', team: '' })
const loading = ref(false)
const error = ref(null)
const done = ref(false)

async function handleRegister() {
  const { username, password, passwordConfirm, displayName, team } = form.value
  if (!username || !password || !displayName) {
    error.value = '아이디, 비밀번호, 이름은 필수 입력 항목입니다.'
    return
  }
  if (password !== passwordConfirm) {
    error.value = '비밀번호가 일치하지 않습니다.'
    return
  }
  if (password.length < 6) {
    error.value = '비밀번호는 6자 이상이어야 합니다.'
    return
  }
  error.value = null
  loading.value = true
  try {
    await registerApi({ username, password, displayName, team })
    done.value = true
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
          <div class="modal-logo">
            <div class="logo-mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" stroke="white" stroke-width="1" stroke-linejoin="round"/>
              </svg>
            </div>
            <span>Shinhan</span>
          </div>
          <h2 class="modal-title">회원가입</h2>
          <p class="modal-subtitle">테스트케이스 자동생성 시스템</p>
        </div>

        <!-- 성공 화면 -->
        <div v-if="done" class="modal-body success-body">
          <div class="success-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h3 class="success-title">가입 신청이 완료되었습니다</h3>
          <div class="success-notice">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            관리자 승인 후 서비스를 이용하실 수 있습니다.
          </div>
          <button class="submit-btn" @click="emit('go-login')">로그인 화면으로</button>
        </div>

        <!-- 입력 폼 -->
        <div v-else class="modal-body">
          <div class="field">
            <label class="field-label">아이디 <span class="required">*</span></label>
            <input v-model="form.username" class="field-input" type="text" placeholder="아이디를 입력하세요" />
          </div>
          <div class="field">
            <label class="field-label">비밀번호 <span class="required">*</span></label>
            <input v-model="form.password" class="field-input" type="password" placeholder="6자 이상 입력하세요" />
          </div>
          <div class="field">
            <label class="field-label">비밀번호 확인 <span class="required">*</span></label>
            <input v-model="form.passwordConfirm" class="field-input" type="password" placeholder="비밀번호를 다시 입력하세요" @keydown.enter="handleRegister" />
          </div>
          <div class="field">
            <label class="field-label">이름 <span class="required">*</span></label>
            <input v-model="form.displayName" class="field-input" type="text" placeholder="실명을 입력하세요" />
          </div>
          <div class="field">
            <label class="field-label">소속팀</label>
            <input v-model="form.team" class="field-input" type="text" placeholder="소속팀을 입력하세요 (선택)" />
          </div>

          <div v-if="error" class="error-msg">{{ error }}</div>

          <button class="submit-btn" :disabled="loading" @click="handleRegister">
            <span v-if="loading" class="spinner" />
            {{ loading ? '신청 중...' : '가입 신청' }}
          </button>

          <p class="login-link">
            이미 계정이 있으신가요?
            <button class="link-btn" @click="emit('go-login')">로그인</button>
          </p>
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
  width: 380px;
  max-width: calc(100vw - 32px);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.modal-header {
  background: var(--blue-navy);
  padding: 24px 28px 20px;
  text-align: center;
}

.modal-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
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
  padding: 24px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-600, #4b5563);
}

.required {
  color: #ef4444;
}

.field-input {
  border: 1.5px solid var(--gray-200, #e5e7eb);
  border-radius: 8px;
  padding: 9px 12px;
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

.submit-btn {
  background: var(--blue-primary, #1a56db);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 11px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s;
  margin-top: 2px;
}

.submit-btn:hover:not(:disabled) { background: #1447c0; }
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

.login-link {
  text-align: center;
  font-size: 12px;
  color: var(--gray-500, #6b7280);
  margin: 0;
}

.link-btn {
  background: none;
  border: none;
  color: var(--blue-primary, #1a56db);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  text-decoration: underline;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.success-body {
  align-items: center;
  text-align: center;
  padding: 36px 28px 32px;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #d1fae5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #059669;
  margin-bottom: 16px;
}

.success-title {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px;
}

.success-notice {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #fef3c7;
  color: #92400e;
  font-size: 13px;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
  line-height: 1.4;
}
</style>

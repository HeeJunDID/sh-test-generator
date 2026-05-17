import { token } from '../composables/useAuth.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function loginApi(username, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || '로그인에 실패했습니다.')
  }
  return json.data
}

export async function updateSettingsApi(preferredAiProvider) {
  const res = await fetch(`${BASE_URL}/api/user/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
    body: JSON.stringify({ preferredAiProvider })
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || '설정 저장에 실패했습니다.')
  }
  return json.data
}

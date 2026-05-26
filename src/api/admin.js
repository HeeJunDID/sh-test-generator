import { token } from '../composables/useAuth.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

function authHeaders() {
  return { 'Authorization': `Bearer ${token.value}` }
}

export async function getUsersApi() {
  const res = await fetch(`${BASE_URL}/api/admin/users`, { headers: authHeaders() })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || '사용자 목록을 불러오지 못했습니다.')
  return json.data
}

export async function approveUserApi(id) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}/approve`, {
    method: 'POST',
    headers: authHeaders()
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || '승인에 실패했습니다.')
}

export async function rejectUserApi(id) {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}/reject`, {
    method: 'POST',
    headers: authHeaders()
  })
  const json = await res.json()
  if (!res.ok || !json.success) throw new Error(json.message || '거절에 실패했습니다.')
}

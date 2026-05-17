import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('auth_token') || null)
const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))

const isLoggedIn = computed(() => !!token.value)

function setAuth(data) {
  token.value = data.token
  user.value = {
    username: data.username,
    displayName: data.displayName,
    preferredAiProvider: data.preferredAiProvider
  }
  localStorage.setItem('auth_token', data.token)
  localStorage.setItem('auth_user', JSON.stringify(user.value))
}

function logout() {
  token.value = null
  user.value = null
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}

function updateUserSettings(settings) {
  if (user.value) {
    user.value = { ...user.value, ...settings }
    localStorage.setItem('auth_user', JSON.stringify(user.value))
  }
}

export { token, user, isLoggedIn, setAuth, logout, updateUserSettings }

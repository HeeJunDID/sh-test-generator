<template>
  <div class="app">
    <TopProgressBar :loading="isLoading" />
    <Transition name="fade" mode="out-in">
      <LandingPage v-if="page === 'landing'" @start="handleStart" @history="handleHistoryFromLanding" @register="openRegister" />
      <div v-else class="app-inner">
        <AppHeader
          :active-tab="activeTab"
          @tab-change="activeTab = $event"
          @go-landing="page = 'landing'"
          @logout="handleLogout"
        />
        <div v-if="errorMessage" class="toast" :class="errorMessage.startsWith('가입') ? 'toast-success' : 'toast-error'" @click="errorMessage = null">
          {{ errorMessage }}
        </div>
        <main class="main-content" v-if="activeTab === 'generate'">
          <div class="left-column">
            <RequirementsPanel @generate="handleGenerate" @error="handleError" @loading="handleLoading" @auth-error="handleAuthError" />
          </div>
          <div class="right-column">
            <TestCaseListPanel
              :test-cases="testCases"
              :selected-id="selectedTestCase?.id"
              :is-loading="isLoading"
              @select="selectedTestCase = $event"
            />
            <TestCaseDetailPanel :selected="selectedTestCase" />
          </div>
        </main>
        <main class="main-content history-content" v-else-if="activeTab === 'history'">
          <HistoryListPanel @error="handleError" @auth-error="handleAuthError" />
        </main>
      </div>
    </Transition>

    <LoginModal v-if="showLogin" @success="handleLoginSuccess" @close="showLogin = false" @go-register="openRegister" />
    <RegisterModal v-if="showRegister" @success="onRegisterSuccess" @close="showRegister = false" @go-login="showRegister = false; showLogin = true" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { isLoggedIn, logout } from './composables/useAuth.js'
import LandingPage from './components/LandingPage.vue'
import AppHeader from './components/AppHeader.vue'
import RequirementsPanel from './components/RequirementsPanel.vue'
import TestCaseListPanel from './components/TestCaseListPanel.vue'
import TestCaseDetailPanel from './components/TestCaseDetailPanel.vue'
import HistoryListPanel from './components/HistoryListPanel.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import TopProgressBar from './components/TopProgressBar.vue'

const page = ref('landing')
const activeTab = ref('generate')
const testCases = ref([])
const selectedTestCase = ref(null)
const errorMessage = ref(null)
const isLoading = ref(false)
const showLogin = ref(false)
const showRegister = ref(false)
const pendingTab = ref(null)

function handleStart() {
  if (isLoggedIn.value) {
    goTo('generate')
  } else {
    pendingTab.value = 'generate'
    showLogin.value = true
  }
}

function handleHistoryFromLanding() {
  if (isLoggedIn.value) {
    goTo('history')
  } else {
    pendingTab.value = 'history'
    showLogin.value = true
  }
}

function handleLoginSuccess() {
  showLogin.value = false
  goTo(pendingTab.value || 'generate')
  pendingTab.value = null
}

function handleLogout() {
  logout()
  page.value = 'landing'
  testCases.value = []
  selectedTestCase.value = null
}

function goTo(tab) {
  activeTab.value = tab
  page.value = 'app'
}

function handleLoading(val) {
  isLoading.value = val
  if (val) {
    testCases.value = []
    selectedTestCase.value = null
  }
}

function handleGenerate(data) {
  testCases.value = data
  selectedTestCase.value = data[0] ?? null
}

function handleError(message) {
  errorMessage.value = message
  setTimeout(() => { errorMessage.value = null }, 5000)
}

function handleAuthError() {
  errorMessage.value = '세션이 만료되었습니다. 다시 로그인해주세요.'
  pendingTab.value = activeTab.value
  page.value = 'landing'
  showLogin.value = true
}

function openRegister() {
  showLogin.value = false
  showRegister.value = true
}

function onRegisterSuccess() {
  showRegister.value = false
}
</script>

<style>
.app {
  height: 100vh;
}

.app-inner {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--blue-50);
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  flex: 1;
  overflow: hidden;
}

.history-content {
  grid-template-columns: 1fr;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  z-index: 2000;
  cursor: pointer;
  white-space: nowrap;
}

.toast-error {
  background: #FF3B3B;
  box-shadow: 0 4px 16px rgba(255,59,59,0.35);
}

.toast-success {
  background: #059669;
  box-shadow: 0 4px 16px rgba(5,150,105,0.35);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

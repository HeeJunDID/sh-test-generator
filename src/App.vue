<template>
  <div class="app">
    <Transition name="fade" mode="out-in">
      <LandingPage v-if="page === 'landing'" @start="handleStart" @history="handleHistoryFromLanding" />
      <div v-else class="app-inner">
        <AppHeader
          :active-tab="activeTab"
          @tab-change="activeTab = $event"
          @go-landing="page = 'landing'"
          @logout="handleLogout"
          @open-settings="showSettings = true"
        />
        <div v-if="errorMessage" class="error-toast" @click="errorMessage = null">
          {{ errorMessage }}
        </div>
        <main class="main-content" v-if="activeTab === 'generate'">
          <div class="left-column">
            <RequirementsPanel @generate="handleGenerate" @error="handleError" @loading="isLoading = $event" />
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
          <HistoryListPanel @error="handleError" />
        </main>
      </div>
    </Transition>

    <LoginModal v-if="showLogin" @success="handleLoginSuccess" @close="showLogin = false" />
    <SettingsModal v-if="showSettings" @close="showSettings = false" />
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
import SettingsModal from './components/SettingsModal.vue'

const page = ref('landing')
const activeTab = ref('generate')
const testCases = ref([])
const selectedTestCase = ref(null)
const errorMessage = ref(null)
const isLoading = ref(false)
const showLogin = ref(false)
const showSettings = ref(false)
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

function handleGenerate(data) {
  testCases.value = data
  selectedTestCase.value = data[0] ?? null
}

function handleError(message) {
  errorMessage.value = message
  setTimeout(() => { errorMessage.value = null }, 5000)
}
</script>

<style>
.app {
  height: 100vh;
  overflow: hidden;
}

.app-inner {
  display: flex;
  flex-direction: column;
  height: 100vh;
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

.error-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #FF3B3B;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  z-index: 1000;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255,59,59,0.35);
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

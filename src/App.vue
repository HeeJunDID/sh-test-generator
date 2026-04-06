<template>
  <div class="app">
    <AppHeader />
    <div v-if="errorMessage" class="error-toast" @click="errorMessage = null">
      {{ errorMessage }}
    </div>
    <main class="main-content">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import RequirementsPanel from './components/RequirementsPanel.vue'
import TestCaseListPanel from './components/TestCaseListPanel.vue'
import TestCaseDetailPanel from './components/TestCaseDetailPanel.vue'

const testCases = ref([])
const selectedTestCase = ref(null)
const errorMessage = ref(null)
const isLoading = ref(false)

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
</style>

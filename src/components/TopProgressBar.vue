<template>
  <Transition name="bar-fade">
    <div v-if="visible" class="progress-bar-wrap">
      <div class="progress-bar" :style="{ width: pct + '%' }" />
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false }
})

const pct = ref(0)
const visible = ref(false)
let timer = null

watch(() => props.loading, (val) => {
  if (val) {
    startProgress()
  } else {
    completeProgress()
  }
})

function startProgress() {
  clearInterval(timer)
  pct.value = 0
  visible.value = true

  // 빠르게 15%까지
  pct.value = 15
  let elapsed = 0

  timer = setInterval(() => {
    elapsed += 300
    if (pct.value < 30) {
      pct.value += 5
    } else if (pct.value < 60) {
      pct.value += 2
    } else if (pct.value < 80) {
      pct.value += 0.8
    } else if (pct.value < 88) {
      pct.value += 0.2
    }
    // 88%에서 멈추고 응답 기다림
    if (pct.value >= 88) clearInterval(timer)
  }, 300)
}

function completeProgress() {
  clearInterval(timer)
  pct.value = 100
  setTimeout(() => {
    visible.value = false
    pct.value = 0
  }, 500)
}
</script>

<style scoped>
.progress-bar-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  height: 3px;
  background: rgba(59, 110, 248, 0.15);
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b6ef8, #60a5fa);
  border-radius: 0 2px 2px 0;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(59, 110, 248, 0.6);
}

.bar-fade-enter-active,
.bar-fade-leave-active {
  transition: opacity 0.3s ease;
}
.bar-fade-enter-from,
.bar-fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="dropdown-wrapper">
    <label v-if="label" class="dropdown-label">{{ label }}</label>
    <div class="dropdown-container" :class="{ open: isOpen }" ref="containerRef">
      <button class="dropdown-trigger" @click="toggleOpen">
        <span class="trigger-value">{{ selectedLabel }}</span>
        <svg class="arrow" :class="{ rotated: isOpen }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      <Transition name="drop">
        <ul class="dropdown-menu" v-show="isOpen">
          <li
            v-for="option in options"
            :key="option.value"
            class="dropdown-item"
            :class="{ selected: option.value === modelValue }"
            @click="select(option)"
          >
            <span class="item-check" v-if="option.value === modelValue">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span v-else class="item-check-placeholder" />
            {{ option.label }}
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  label: String,
  modelValue: String,
  options: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])
const isOpen = ref(false)
const containerRef = ref(null)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : props.options[0]?.label ?? ''
})

function toggleOpen() { isOpen.value = !isOpen.value }

function select(option) {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) isOpen.value = false
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.dropdown-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dropdown-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-500);
  letter-spacing: 0.2px;
}

.dropdown-container {
  position: relative;
}

.dropdown-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
  cursor: pointer;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.dropdown-trigger:hover {
  border-color: var(--blue-royal);
}

.dropdown-container.open .dropdown-trigger {
  border-color: var(--blue-primary);
  box-shadow: 0 0 0 3px var(--blue-100);
}

.arrow {
  color: var(--gray-400);
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 200;
  list-style: none;
  margin: 0;
  padding: 6px;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.1s;
}

.dropdown-item:hover {
  background: var(--blue-50);
  color: var(--blue-primary);
}

.dropdown-item.selected {
  color: var(--blue-primary);
  background: var(--blue-100);
  font-weight: 600;
}

.item-check {
  color: var(--blue-primary);
  display: flex;
  align-items: center;
  width: 14px;
  flex-shrink: 0;
}

.item-check-placeholder {
  width: 14px;
  flex-shrink: 0;
}

.drop-enter-active, .drop-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.drop-enter-from, .drop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

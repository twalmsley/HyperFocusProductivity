<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[60]">
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconClass">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" :class="iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      </div>
      
      <p class="text-gray-600 mb-6">{{ message }}</p>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded-md transition-colors"
          :class="confirmButtonClass"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  show: boolean
  type: 'close' | 'skip' | 'reset'
}

const props = defineProps<Props>()

defineEmits<{
  cancel: []
  confirm: []
}>()

// Computed properties for dynamic styling based on confirmation type
const title = computed(() => {
  switch (props.type) {
    case 'close':
      return 'Close Timer'
    case 'skip':
      return 'Skip Phase'
    case 'reset':
      return 'Reset Timer'
    default:
      return 'Confirm Action'
  }
})

const message = computed(() => {
  switch (props.type) {
    case 'close':
      return 'Are you sure you want to close the timer? Your progress will be lost.'
    case 'skip':
      return 'Are you sure you want to skip this phase?'
    case 'reset':
      return 'Are you sure you want to reset the timer? Your progress will be lost.'
    default:
      return 'Are you sure you want to proceed?'
  }
})

const confirmText = computed(() => {
  switch (props.type) {
    case 'close':
      return 'Close Timer'
    case 'skip':
      return 'Skip Phase'
    case 'reset':
      return 'Reset Timer'
    default:
      return 'Confirm'
  }
})

const iconClass = computed(() => {
  switch (props.type) {
    case 'close':
      return 'bg-red-100'
    case 'skip':
      return 'bg-yellow-100'
    case 'reset':
      return 'bg-orange-100'
    default:
      return 'bg-gray-100'
  }
})

const iconColor = computed(() => {
  switch (props.type) {
    case 'close':
      return 'text-red-600'
    case 'skip':
      return 'text-yellow-600'
    case 'reset':
      return 'text-orange-600'
    default:
      return 'text-gray-600'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'close':
      return 'bg-red-600 text-white hover:bg-red-700'
    case 'skip':
      return 'bg-yellow-600 text-white hover:bg-yellow-700'
    case 'reset':
      return 'bg-orange-600 text-white hover:bg-orange-700'
    default:
      return 'bg-gray-600 text-white hover:bg-gray-700'
  }
})
</script> 
<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl mx-4">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium">{{ title }}</h3>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            id="startDate"
            type="date"
            v-model="startDate"
            :max="todayStr"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          />
        </div>

        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            id="endDate"
            type="date"
            v-model="endDate"
            :max="todayStr"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          />
        </div>

        <p v-if="validationMessage" class="text-sm text-red-600">
          {{ validationMessage }}
        </p>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="runReport"
          :disabled="!isValid"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Run Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format, differenceInDays, startOfDay } from 'date-fns'

const props = withDefaults(defineProps<{
  show: boolean
  title?: string
  maxDays?: number
}>(), {
  title: 'Run Report',
  maxDays: 31
})

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'run', payload: { startDate: string; endDate: string }): void
}>()

const todayStr = computed(() => format(new Date(), 'yyyy-MM-dd'))

const startDate = ref(todayStr.value)
const endDate = ref(todayStr.value)

watch(() => props.show, (newVal) => {
  if (newVal) {
    startDate.value = todayStr.value
    endDate.value = todayStr.value
  }
})

const validationMessage = computed(() => {
  if (!startDate.value || !endDate.value) return ''
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)

  if (end < start) {
    return 'End date must be on or after the start date.'
  }

  const days = differenceInDays(end, start)
  if (days >= props.maxDays) {
    return `Report period cannot exceed ${props.maxDays} days.`
  }

  return ''
})

const isValid = computed(() => {
  if (!startDate.value || !endDate.value) return false
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  const today = startOfDay(new Date())

  if (end < start) return false
  if (end > today) return false
  if (differenceInDays(end, start) >= props.maxDays) return false

  return true
})

function runReport() {
  if (!isValid.value) return
  emit('run', { startDate: startDate.value, endDate: endDate.value })
}
</script>

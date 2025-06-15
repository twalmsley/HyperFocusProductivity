<template>
  <div class="space-y-4">
    <div>
      <label for="repeatType" class="block text-sm font-medium text-gray-700">Repeat Schedule</label>
      <select 
        id="repeatType" 
        v-model="localSchedule.repeatType" 
        @change="onRepeatTypeChange"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
        <option :value="null">No repeat</option>
        <option value="DAILY">Daily</option>
        <option value="WEEKLY">Weekly</option>
        <option value="MONTHLY">Monthly</option>
        <option value="ANNUALLY">Annually</option>
        <option value="MONTHLY_BY_WEEKDAY">Monthly by weekday</option>
      </select>
    </div>

    <!-- Daily options (no additional options needed) -->

    <!-- Weekly options -->
    <div v-if="localSchedule.repeatType === 'WEEKLY'" class="space-y-4">
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Days of the week</label>
        <div class="flex flex-wrap gap-2">
          <label v-for="(day, index) in dayNames" :key="index" class="flex items-center">
            <input 
              type="checkbox" 
              :checked="localSchedule.repeatDays?.includes(index)"
              @change="toggleWeekDay(index)"
              class="rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]" />
            <span class="ml-2 text-sm text-gray-700">{{ day }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Preview -->
    <div v-if="localSchedule.repeatType" class="p-3 bg-blue-50 rounded-md">
      <p class="text-sm text-blue-800">
        <strong>Preview:</strong> {{ formatSchedulePreview() }}
      </p>
    </div>


    <!-- Monthly repeat options -->
    <div v-if="localSchedule.repeatType === 'MONTHLY'" class="mt-4">
      <label for="monthlyDay" class="block text-sm font-medium text-gray-700">Repeat on day</label>
      <input
        type="number"
        id="monthlyDay"
        v-model.number="localSchedule.repeatDay"
        @change="onMonthlyDayChange"
        min="1" 
        max="31"
        class="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
      <p class="mt-1 text-xs text-gray-500">For months without this day, the last day of the month will be used.</p>
    </div>

    <!-- Annual repeat options -->
    <div v-if="localSchedule.repeatType === 'ANNUALLY'" class="mt-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="annualMonth" class="block text-sm font-medium text-gray-700">Month</label>
          <select
            id="annualMonth"
            v-model.number="localSchedule.repeatMonth"
            @change="onAnnualMonthChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
            <option v-for="(month, index) in monthNames" :key="index" :value="index + 1">{{ month }}</option>
          </select>
        </div>
        <div>
          <label for="annualDay" class="block text-sm font-medium text-gray-700">Day</label>
          <input
            type="number"
            id="annualDay"
            v-model.number="localSchedule.repeatDay"
            @change="onAnnualDayChange"
            min="1" 
            max="31"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
        </div>
      </div>
    </div>

    <!-- Monthly by weekday repeat options -->
    <div v-if="localSchedule.repeatType === 'MONTHLY_BY_WEEKDAY'" class="mt-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="weekOfMonth" class="block text-sm font-medium text-gray-700">Week of month</label>
          <select
            id="weekOfMonth"
            v-model.number="localSchedule.repeatWeekOfMonth"
            @change="onWeekOfMonthChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
            <option value="1">First</option>
            <option value="2">Second</option>
            <option value="3">Third</option>
            <option value="4">Fourth</option>
            <option value="5">Last</option>
          </select>
        </div>
        <div>
          <label for="dayOfWeek" class="block text-sm font-medium text-gray-700">Day of week</label>
          <select
            id="dayOfWeek"
            v-model.number="localSchedule.repeatDayOfWeek"
            @change="onDayOfWeekChange"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
            <option v-for="(day, index) in dayNames" :key="index" :value="index">{{ day }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Interval input for all repeat types -->
    <div v-if="localSchedule.repeatType" class="mt-4">
      <label for="repeatInterval" class="block text-sm font-medium text-gray-700">Repeat every</label>
      <div class="mt-1 flex items-center">
        <input
          type="number"
          id="repeatInterval"
          v-model.number="localSchedule.repeatInterval"
          @change="onIntervalChange"
          min="1"
          max="99"
          class="block w-20 rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
        <span class="ml-2 text-sm text-gray-500">
          {{ getIntervalLabel() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { RepeatSchedule } from '~/types/task'

const props = defineProps<{
  modelValue: RepeatSchedule
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: RepeatSchedule): void
}>()

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const localSchedule = ref<RepeatSchedule>({ ...props.modelValue })

// Watch for changes and emit updates
watch(localSchedule, (newValue, oldValue) => {
  // Only emit if the values are actually different
  if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
    emit('update:modelValue', { ...newValue })
  }
}, { deep: true })

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  // Only update if the values are actually different
  if (JSON.stringify(newValue) !== JSON.stringify(localSchedule.value)) {
    localSchedule.value = { ...newValue }
  }
}, { deep: true })

function onRepeatTypeChange() {
  // Reset all fields when repeat type changes
  const newSchedule = {
    repeatType: localSchedule.value.repeatType,
    // Initialize interval to 1 for all repeat types
    repeatInterval: 1,
    // Initialize required fields based on repeat type
    repeatDays: localSchedule.value.repeatType === 'WEEKLY' ? [] : undefined,
    repeatMonth: localSchedule.value.repeatType === 'ANNUALLY' ? 1 : undefined,
    repeatDay: ['MONTHLY', 'ANNUALLY'].includes(localSchedule.value.repeatType) ? 1 : undefined,
    repeatWeekOfMonth: localSchedule.value.repeatType === 'MONTHLY_BY_WEEKDAY' ? 1 : undefined,
    repeatDayOfWeek: localSchedule.value.repeatType === 'MONTHLY_BY_WEEKDAY' ? 0 : undefined
  }
  localSchedule.value = newSchedule
  // Explicitly emit the update
  emit('update:modelValue', { ...newSchedule })
}

function onIntervalChange() {
  // Ensure repeatInterval is a number between 1 and 99
  const interval = typeof localSchedule.value.repeatInterval === 'string' 
    ? parseInt(localSchedule.value.repeatInterval)
    : localSchedule.value.repeatInterval || 1
  if (isNaN(interval) || interval < 1 || interval > 99) {
    localSchedule.value.repeatInterval = 1
  }
  // Explicitly emit the update
  emit('update:modelValue', { ...localSchedule.value })
}

function onMonthlyDayChange() {
  // Ensure repeatDay is a number between 1 and 31
  const day = typeof localSchedule.value.repeatDay === 'string' 
    ? parseInt(localSchedule.value.repeatDay)
    : localSchedule.value.repeatDay || 1
  if (isNaN(day) || day < 1 || day > 31) {
    localSchedule.value.repeatDay = 1
  }
  // Explicitly emit the update
  emit('update:modelValue', { ...localSchedule.value })
}

function toggleWeekDay(dayIndex: number) {
  if (!localSchedule.value.repeatDays) {
    localSchedule.value.repeatDays = []
  }
  
  // If the day is already selected, deselect it
  if (localSchedule.value.repeatDays.includes(dayIndex)) {
    localSchedule.value.repeatDays = []
  } else {
    // Otherwise, select only this day
    localSchedule.value.repeatDays = [dayIndex]
  }
  
  // Explicitly emit the update after toggling a day
  emit('update:modelValue', { ...localSchedule.value })
}

function onAnnualMonthChange() {
  // Ensure repeatMonth is a number between 1 and 12
  const month = typeof localSchedule.value.repeatMonth === 'string' 
    ? parseInt(localSchedule.value.repeatMonth)
    : localSchedule.value.repeatMonth || 1
  if (isNaN(month) || month < 1 || month > 12) {
    localSchedule.value.repeatMonth = 1
  }
  // Explicitly emit the update
  emit('update:modelValue', { ...localSchedule.value })
}

function onAnnualDayChange() {
  // Ensure repeatDay is a number between 1 and 31
  const day = typeof localSchedule.value.repeatDay === 'string' 
    ? parseInt(localSchedule.value.repeatDay)
    : localSchedule.value.repeatDay || 1
  if (isNaN(day) || day < 1 || day > 31) {
    localSchedule.value.repeatDay = 1
  }
  // Explicitly emit the update
  emit('update:modelValue', { ...localSchedule.value })
}

function onWeekOfMonthChange() {
  // Ensure repeatWeekOfMonth is a number between 1 and 5
  const week = typeof localSchedule.value.repeatWeekOfMonth === 'string' 
    ? parseInt(localSchedule.value.repeatWeekOfMonth)
    : localSchedule.value.repeatWeekOfMonth || 1
  if (isNaN(week) || week < 1 || week > 5) {
    localSchedule.value.repeatWeekOfMonth = 1
  }
  // Explicitly emit the update
  emit('update:modelValue', { ...localSchedule.value })
}

function onDayOfWeekChange() {
  // Ensure repeatDayOfWeek is a number between 0 and 6
  const day = typeof localSchedule.value.repeatDayOfWeek === 'string' 
    ? parseInt(localSchedule.value.repeatDayOfWeek)
    : localSchedule.value.repeatDayOfWeek || 0
  if (isNaN(day) || day < 0 || day > 6) {
    localSchedule.value.repeatDayOfWeek = 0
  }
  // Explicitly emit the update
  emit('update:modelValue', { ...localSchedule.value })
}

function formatSchedulePreview(): string {
  const schedule = localSchedule.value
  if (!schedule.repeatType) return ''

  const ordinals = ['', 'First', 'Second', 'Third', 'Fourth', 'Last']

  switch (schedule.repeatType) {
    case 'DAILY':
      return 'Repeat daily'

    case 'WEEKLY':
      const interval = schedule.repeatInterval || 1
      if (schedule.repeatDays && schedule.repeatDays.length > 0) {
        const days = schedule.repeatDays.map(day => dayNames[day]).join(', ')
        return interval === 1 ? `Every ${days}` : `Every ${interval} weeks on ${days}`
      }
      return interval === 1 ? 'Repeat weekly' : `Every ${interval} weeks`

    case 'MONTHLY':
      const day = schedule.repeatDay
      return day ? `Monthly on day ${day}` : 'Repeat monthly'

    case 'ANNUALLY':
      const month = schedule.repeatMonth
      const dayOfMonth = schedule.repeatDay
      if (month && dayOfMonth) {
        return `Annually on ${monthNames[month - 1]} ${dayOfMonth}`
      }
      return 'Repeat annually'

    case 'MONTHLY_BY_WEEKDAY':
      if (schedule.repeatWeekOfMonth && schedule.repeatDayOfWeek !== undefined) {
        const week = ordinals[schedule.repeatWeekOfMonth]
        const day = dayNames[schedule.repeatDayOfWeek]
        return `${week} ${day} of every month`
      }
      return 'Repeat monthly by weekday'

    default:
      return ''
  }
}

function getIntervalLabel(): string {
  const schedule = localSchedule.value
  if (!schedule.repeatType) return ''

  switch (schedule.repeatType as string) {
    case 'DAILY':
      return 'day(s)'
    case 'WEEKLY':
      return 'week(s)'
    case 'MONTHLY':
      return 'month(s)'
    case 'ANNUALLY':
      return 'year(s)'
    case 'MONTHLY_BY_WEEKDAY':
      return 'month(s)'
    default:
      return ''
  }
}
</script> 
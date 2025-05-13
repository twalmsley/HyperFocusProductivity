<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-medium text-gray-900">Pomodoro Timer</h3>
        <button 
          @click="handleClose" 
          class="text-gray-400 hover:text-gray-500"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex flex-col items-center">
        <!-- Circular Timer -->
        <div class="relative w-64 h-64 mb-6">
          <svg class="w-full h-full" viewBox="0 0 100 100">
            <!-- Background circle -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              stroke-width="8"
            />
            <!-- Progress circle -->
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--primary)"
              stroke-width="8"
              :stroke-dasharray="283"
              :stroke-dashoffset="283 - (283 * progress)"
              transform="rotate(-90 50 50)"
              class="transition-all duration-1000 ease-linear"
            />
          </svg>
          <!-- Timer text -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-4xl font-bold">{{ formatTime(timeRemaining) }}</div>
              <div class="text-sm text-gray-500 mt-1">{{ currentPhase }}</div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex space-x-4">
          <button
            v-if="!isRunning"
            @click="startTimer"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
          >
            Start
          </button>
          <button
            v-else
            @click="pauseTimer"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
          >
            Pause
          </button>
          <button
            @click="handleSkip"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            @click="handleReset"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
        </div>

        <!-- Progress -->
        <div class="mt-6 text-center">
          <div class="text-sm text-gray-500">
            Round {{ currentRound }} of {{ totalRounds }}
          </div>
          <div class="text-sm text-gray-500">
            Completed: {{ completedPomodoros }} pomodoros
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  totalRounds: number
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  longBreakInterval: number
  completedPomodoros: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:completedPomodoros', value: number): void
}>()

const isRunning = ref(false)
const timeRemaining = ref(props.focusDuration * 60)
const currentRound = ref(1)
const currentPhase = ref('Focus')
const timerInterval = ref<number | null>(null)

const progress = computed(() => {
  const totalTime = currentPhase.value === 'Focus' 
    ? props.focusDuration * 60 
    : currentRound.value % props.longBreakInterval === 0 
      ? props.longBreakDuration * 60 
      : props.shortBreakDuration * 60
  return 1 - (timeRemaining.value / totalTime)
})

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

function startTimer() {
  if (!isRunning.value) {
    isRunning.value = true
    timerInterval.value = window.setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        handlePhaseComplete()
      }
    }, 1000)
  }
}

function pauseTimer() {
  if (isRunning.value) {
    isRunning.value = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }
}

function handlePhaseComplete() {
  if (currentPhase.value === 'Focus') {
    emit('update:completedPomodoros', props.completedPomodoros + 1)
    
    if (currentRound.value % props.longBreakInterval === 0) {
      currentPhase.value = 'Long Break'
      timeRemaining.value = props.longBreakDuration * 60
    } else {
      currentPhase.value = 'Short Break'
      timeRemaining.value = props.shortBreakDuration * 60
    }
  } else {
    currentPhase.value = 'Focus'
    timeRemaining.value = props.focusDuration * 60
    currentRound.value++
  }
}

async function handleClose() {
  if (isRunning.value) {
    const confirmed = await window.confirm('Are you sure you want to close the timer? Your progress will be lost.')
    if (!confirmed) return
  }
  pauseTimer()
  emit('close')
}

async function handleSkip() {
  if (isRunning.value) {
    const confirmed = await window.confirm('Are you sure you want to skip this phase?')
    if (!confirmed) return
  }
  handlePhaseComplete()
}

async function handleReset() {
  if (isRunning.value) {
    const confirmed = await window.confirm('Are you sure you want to reset the timer? Your progress will be lost.')
    if (!confirmed) return
  }
  pauseTimer()
  currentRound.value = 1
  currentPhase.value = 'Focus'
  timeRemaining.value = props.focusDuration * 60
}

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script> 
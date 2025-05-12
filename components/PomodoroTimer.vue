<template>
  <div class="flex flex-col items-center">
    <div class="relative w-64 h-64">
      <!-- Circular progress background -->
      <svg class="w-full h-full" viewBox="0 0 100 100">
        <circle
          class="text-gray-200"
          stroke-width="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          class="text-blue-500 transition-all duration-1000 ease-linear"
          stroke-width="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <!-- Timer display -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="text-4xl font-bold">{{ formatTime(timeLeft) }}</div>
          <div class="text-sm text-gray-500">{{ isBreak ? 'Break' : 'Focus' }}</div>
          <div class="text-sm text-gray-500 mt-1">Round {{ currentRound }} of {{ rounds }}</div>
        </div>
      </div>
    </div>
    <!-- Controls -->
    <div class="mt-6 space-x-4">
      <button
        v-if="!isRunning"
        @click="startTimer"
        class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Start
      </button>
      <button
        v-else
        @click="pauseTimer"
        class="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Pause
      </button>
      <button
        @click="resetTimer"
        class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
      >
        Reset
      </button>
      <button
        @click="skipToNextRound"
        class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
      >
        Skip
      </button>
    </div>

    <!-- Warning Message -->
    <div
      v-if="isRunning"
      class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800"
    >
      <div class="flex items-center">
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>Your timer state will be saved if you navigate away from the page.</span>
      </div>
    </div>

    <!-- History Section -->
    <div class="mt-8 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-3">Session Progress</h3>
      <div class="space-y-2">
        <div
          v-for="(step, index) in sessionSteps"
          :key="index"
          class="flex items-center p-2 rounded-lg"
          :class="{
            'bg-gray-100': step.status === 'completed',
            'bg-blue-50 border border-blue-200': step.status === 'current',
            'text-gray-400': step.status === 'upcoming'
          }"
        >
          <div class="w-6 h-6 flex items-center justify-center mr-3">
            <div
              v-if="step.status === 'completed'"
              class="w-4 h-4 bg-green-500 rounded-full"
            ></div>
            <div
              v-else-if="step.status === 'current'"
              class="w-4 h-4 bg-blue-500 rounded-full animate-pulse"
            ></div>
            <div
              v-else
              class="w-4 h-4 border-2 border-gray-300 rounded-full"
            ></div>
          </div>
          <div class="flex-grow">
            <div class="font-medium">{{ step.type }}</div>
            <div class="text-sm">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePomodoroEvents } from '../composables/usePomodoroEvents'

const props = defineProps({
  focusDuration: {
    type: Number,
    default: 25 * 60 // 25 minutes in seconds
  },
  breakDuration: {
    type: Number,
    default: 5 * 60 // 5 minutes in seconds
  },
  rounds: {
    type: Number,
    default: 4
  }
})

const emit = defineEmits(['timer-state-change'])

const timeLeft = ref(props.focusDuration)
const isRunning = ref(false)
const isBreak = ref(false)
const currentRound = ref(1)
const timerInterval = ref<number | null>(null)
const titleInterval = ref<number | null>(null)
const startTime = ref(0)
const elapsedTime = ref(0)
const stepEndTime = ref<number | null>(null)

// Watch for prop changes and update only when timer is not running
watch(() => [props.focusDuration, props.breakDuration, props.rounds], ([newFocusDuration, newBreakDuration, newRounds], [oldFocusDuration, oldBreakDuration, oldRounds]) => {
  if (!isRunning.value) {
    // Only update the timer if the timer is not running
    if (!isBreak.value) {
      timeLeft.value = newFocusDuration
    } else {
      timeLeft.value = newBreakDuration
    }
    generateSessionSteps()
  }
}, { deep: true })

// Add state persistence
const STORAGE_KEY = 'pomodoro-state'

const circumference = 2 * Math.PI * 45
const dashOffset = computed(() => {
  const totalDuration = isBreak.value ? props.breakDuration : props.focusDuration
  const progress = timeLeft.value / totalDuration
  return circumference * (1 - progress)
})

const { notifySessionUpdate } = usePomodoroEvents()

function saveState() {
  const state = {
    isRunning: isRunning.value,
    isBreak: isBreak.value,
    currentRound: currentRound.value,
    stepEndTime: stepEndTime.value,
    sessionSteps: sessionSteps.value
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function loadState() {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState) {
    const state = JSON.parse(savedState)
    isRunning.value = state.isRunning
    isBreak.value = state.isBreak
    currentRound.value = state.currentRound
    stepEndTime.value = state.stepEndTime
    
    // Use saved session steps if available, otherwise generate new ones
    if (state.sessionSteps && state.sessionSteps.length > 0) {
      sessionSteps.value = state.sessionSteps
    } else {
      generateSessionSteps()
    }

    // If timer was running, calculate remaining time and restart
    if (isRunning.value && stepEndTime.value) {
      // First update the remaining time
      updateRemainingTime()
      
      // Clear any existing intervals
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
      }
      if (titleInterval.value) {
        clearInterval(titleInterval.value)
      }

      // Force a re-render of the progress circle
      nextTick(() => {
        // Restart the timer with the current state
        const totalDuration = isBreak.value ? props.breakDuration : props.focusDuration
        stepEndTime.value = Date.now() + (timeLeft.value * 1000)
        
        timerInterval.value = window.setInterval(() => {
          if (!updateRemainingTime()) {
            // Timer finished
            if (isBreak.value) {
              isBreak.value = false
              timeLeft.value = props.focusDuration
              currentRound.value++
            } else {
              if (currentRound.value < props.rounds) {
                isBreak.value = true
                timeLeft.value = props.breakDuration
              } else {
                resetTimer()
                return
              }
            }
            stepEndTime.value = Date.now() + (timeLeft.value * 1000)
            updateSessionSteps()
          }
          saveState()
        }, 100) // Update more frequently for smoother animation

        // Update title immediately and then every second
        updateTitle()
        titleInterval.value = window.setInterval(updateTitle, 1000)
        window.addEventListener('beforeunload', handleBeforeUnload)
      })
    }
  }
}

function updateRemainingTime() {
  if (stepEndTime.value) {
    const now = Date.now()
    const remainingSeconds = Math.max(0, Math.floor((stepEndTime.value - now) / 1000))
    timeLeft.value = remainingSeconds
    
    // If timer has completed
    if (remainingSeconds === 0) {
      console.log('Timer completed, saving session')
      const totalDuration = isBreak.value ? props.breakDuration : props.focusDuration
      const sessionType = isBreak.value ? 'SHORT_BREAK' : 'FOCUS'
      saveSession(sessionType, totalDuration)
    }
    
    return remainingSeconds > 0
  }
  return false
}

interface SessionStep {
  type: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
}

const sessionSteps = ref<SessionStep[]>([])

function generateSessionSteps() {
  const steps: SessionStep[] = []
  for (let i = 1; i <= props.rounds; i++) {
    steps.push({
      type: `Focus Session ${i}`,
      description: `${props.focusDuration / 60} minutes`,
      status: i === 1 ? 'current' : 'upcoming'
    })
    if (i < props.rounds) {
      steps.push({
        type: `Break ${i}`,
        description: `${props.breakDuration / 60} minutes`,
        status: 'upcoming'
      })
    }
  }
  sessionSteps.value = steps
}

function updateSessionSteps() {
  const currentIndex = sessionSteps.value.findIndex(step => step.status === 'current')
  if (currentIndex > -1) {
    // Mark current step as completed
    sessionSteps.value[currentIndex].status = 'completed'
    
    // Mark next step as current if it exists
    if (currentIndex + 1 < sessionSteps.value.length) {
      sessionSteps.value[currentIndex + 1].status = 'current'
    }
  }
}

function resetSessionSteps() {
  sessionSteps.value = sessionSteps.value.map((step, index) => ({
    ...step,
    status: index === 0 ? 'current' : 'upcoming'
  }))
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

function updateTitle() {
  const mode = isBreak.value ? 'Break' : 'Focus'
  document.title = `${formatTime(timeLeft.value)} - ${mode} | Pomodoro`
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isRunning.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

function saveSession(type: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK', duration: number) {
  console.log('Saving session:', { type, duration })
  const startTime = new Date(Date.now() - (duration * 1000))
  const endTime = new Date()
  
  fetch('/api/pomodoro/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      startTime,
      endTime,
      durationMinutes: Math.floor(duration / 60)
    })
  }).then(() => {
    console.log('Session saved successfully')
    // Notify that a session has been updated
    notifySessionUpdate()
  }).catch(error => {
    console.error('Failed to save session:', error)
  })
}

function startTimer() {
  if (!isRunning.value) {
    isRunning.value = true
    const totalDuration = isBreak.value ? props.breakDuration : props.focusDuration
    stepEndTime.value = Date.now() + (totalDuration * 1000)
    
    timerInterval.value = window.setInterval(() => {
      if (!updateRemainingTime()) {
        // Timer finished
        if (isBreak.value) {
          isBreak.value = false
          timeLeft.value = props.focusDuration
          currentRound.value++
        } else {
          if (currentRound.value < props.rounds) {
            isBreak.value = true
            timeLeft.value = props.breakDuration
          } else {
            resetTimer()
            return
          }
        }
        stepEndTime.value = Date.now() + (timeLeft.value * 1000)
        updateSessionSteps()
      }
      saveState()
    }, 100) // Update more frequently for smoother animation

    // Update title immediately and then every second
    updateTitle()
    titleInterval.value = window.setInterval(updateTitle, 1000)
    // Add beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload)
    // Save state when starting
    saveState()
    // Emit timer state change
    emit('timer-state-change', true)
  }
}

function pauseTimer() {
  if (isRunning.value) {
    isRunning.value = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
    if (titleInterval.value) {
      clearInterval(titleInterval.value)
    }
    // Reset title when paused
    document.title = 'Pomodoro Timer'
    // Remove beforeunload event listener
    window.removeEventListener('beforeunload', handleBeforeUnload)
    // Save state when pausing
    saveState()
    // Emit timer state change
    emit('timer-state-change', false)
  }
}

function resetTimer() {
  pauseTimer()
  timeLeft.value = props.focusDuration
  isBreak.value = false
  currentRound.value = 1
  stepEndTime.value = null
  resetSessionSteps()
  // Reset title
  document.title = 'Pomodoro Timer'
  // Clear saved state
  localStorage.removeItem(STORAGE_KEY)
  // Emit timer state change (should be false already from pauseTimer)
  emit('timer-state-change', false)
}

function skipToNextRound() {
  if (isBreak.value) {
    const sessionType = 'SHORT_BREAK'
    const duration = props.breakDuration - timeLeft.value
    saveSession(sessionType, duration)
    
    isBreak.value = false
    timeLeft.value = props.focusDuration
    currentRound.value++
  } else {
    const sessionType = 'FOCUS'
    const duration = props.focusDuration - timeLeft.value
    saveSession(sessionType, duration)
    
    if (currentRound.value < props.rounds) {
      isBreak.value = true
      timeLeft.value = props.breakDuration
    } else {
      resetTimer()
      return
    }
  }
  stepEndTime.value = Date.now() + (timeLeft.value * 1000)
  updateSessionSteps()
  saveState()
}

// Initialize steps and load state on component mount
onMounted(() => {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState) {
    loadState()
  } else {
    generateSessionSteps()
  }
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  if (titleInterval.value) {
    clearInterval(titleInterval.value)
  }
  // Reset title when component is unmounted
  document.title = 'Pomodoro Timer'
  // Remove beforeunload event listener
  window.removeEventListener('beforeunload', handleBeforeUnload)
  // Save state when unmounting
  saveState()
})
</script> 
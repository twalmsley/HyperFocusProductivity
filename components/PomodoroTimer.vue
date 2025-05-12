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

const timeLeft = ref(props.focusDuration)
const isRunning = ref(false)
const isBreak = ref(false)
const currentRound = ref(1)
const timerInterval = ref<number | null>(null)
const startTime = ref(0)
const elapsedTime = ref(0)

const circumference = 2 * Math.PI * 45
const dashOffset = computed(() => {
  const progress = timeLeft.value / (isBreak.value ? props.breakDuration : props.focusDuration)
  return circumference * (1 - progress)
})

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

function startTimer() {
  if (!isRunning.value) {
    isRunning.value = true
    startTime.value = Date.now() - elapsedTime.value
    timerInterval.value = window.setInterval(updateTimer, 1000)
  }
}

function pauseTimer() {
  if (isRunning.value) {
    isRunning.value = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
    elapsedTime.value = Date.now() - startTime.value
  }
}

function resetTimer() {
  pauseTimer()
  timeLeft.value = props.focusDuration
  isBreak.value = false
  currentRound.value = 1
  elapsedTime.value = 0
  resetSessionSteps()
}

function skipToNextRound() {
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
  startTime.value = Date.now()
  elapsedTime.value = 0
  updateSessionSteps()
}

function updateTimer() {
  const now = Date.now()
  elapsedTime.value = now - startTime.value
  const totalDuration = isBreak.value ? props.breakDuration : props.focusDuration
  timeLeft.value = Math.max(0, totalDuration - Math.floor(elapsedTime.value / 1000))

  if (timeLeft.value === 0) {
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
    startTime.value = Date.now()
    elapsedTime.value = 0
    updateSessionSteps()
  }
}

// Initialize steps on component mount
onMounted(() => {
  generateSessionSteps()
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})
</script> 
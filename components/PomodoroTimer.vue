<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <audio ref="bellSound" src="/sounds/bell.mp3" preload="auto"></audio>
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
              :stroke="currentPhase === 'Focus' ? '#f97316' : '#22c55e'" 
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
              <div v-if="isCompleted" class="text-2xl font-bold text-green-600">All Done!</div>
              <div v-else class="text-4xl font-bold">{{ formatTime(timeRemaining) }}</div>
              <div v-if="!isCompleted" class="text-sm mt-1" :class="currentPhase === 'Focus' ? 'text-orange-500' : 'text-green-600'">
                {{ currentPhase }}
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex space-x-4">
          <button
            v-if="!isRunning && !isCompleted"
            @click="startTimer"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
          >
            Start
          </button>
          <button
            v-if="isRunning && !isCompleted"
            @click="pauseTimer"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
          >
            Pause
          </button>
          <button
            v-if="!isCompleted"
            @click="handleSkip"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            v-if="!isCompleted"
            @click="handleReset"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            v-if="isCompleted"
            @click="emit('close')"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Close
          </button>
        </div>

        <!-- Progress -->
        <div class="mt-6 text-center">
          <div v-if="isCompleted" class="text-green-600 font-medium mb-2">
            Congratulations! You've completed all planned pomodoros.
          </div>
          <div v-if="!isCompleted" class="text-sm text-gray-500">
            Round {{ props.completedPomodoros }} of {{ props.totalRounds }}
          </div>
          <div v-if="isCompleted" class="text-sm text-gray-500">
            Round {{ props.completedPomodoros }} of {{ props.totalRounds }}
          </div>
          <div class="text-sm text-gray-500">
            Completed: {{ props.completedPomodoros }} pomodoros
          </div>
          
          <!-- Warning message when timer is running -->
          <div v-if="isRunning" class="mt-4 text-red-600 font-bold text-sm">
            Keep this browser tab open. Use other tabs to continue browsing.
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <PomodoroTimerConfirmModal
      :show="showConfirmModal"
      :type="confirmModalType"
      @cancel="cancelConfirmation"
      @confirm="confirmAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import PomodoroTimerConfirmModal from './PomodoroTimerConfirmModal.vue'

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
const bellSound = ref<HTMLAudioElement | null>(null)

// Confirmation modal state
const showConfirmModal = ref(false)
const confirmModalType = ref<'close' | 'skip' | 'reset'>('close')
const pendingAction = ref<(() => void) | null>(null)

// Calculate remaining rounds based on total and already completed
const totalRemainingRounds = computed(() => {
  return Math.max(1, props.totalRounds - props.completedPomodoros)
})

// Check if all pomodoros are completed
const isCompleted = computed(() => {
  return props.completedPomodoros >= props.totalRounds && currentPhase.value === 'Focus'
})

// Watch for completion state
watch(isCompleted, (newVal) => {
  if (newVal) {
    pauseTimer()
    document.title = 'Pomodoros Completed! - HyperFocus'
  }
})

const progress = computed(() => {
  if (isCompleted.value) {
    return 1 // Full circle for completed state
  }
  
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

function updateDocumentTitle() {
  if (isRunning.value) {
    const time = formatTime(timeRemaining.value)
    const phase = currentPhase.value
    document.title = `(${time}) ${phase} - HyperFocus`
  } else {
    document.title = 'HyperFocus Productivity'
  }
}

function startTimer() {
  if (!isRunning.value) {
    isRunning.value = true
    timerInterval.value = window.setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
        updateDocumentTitle()
      } else {
        handlePhaseComplete()
      }
    }, 1000)
    updateDocumentTitle()
  }
}

function pauseTimer() {
  if (isRunning.value) {
    isRunning.value = false
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
    document.title = 'HyperFocus Productivity'
  }
}

async function playBellSound() {
  if (bellSound.value) {
    for (let i = 0; i < 3; i++) {
      bellSound.value.currentTime = 0
      await bellSound.value.play()
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
}

function handlePhaseComplete() {
  playBellSound()
  
  if (currentPhase.value === 'Focus') {
    emit('update:completedPomodoros', props.completedPomodoros + 1)
    
    // Check if this was the last round
    if (props.completedPomodoros >= props.totalRounds) {
      currentRound.value = props.totalRounds
      currentPhase.value = 'Focus'
      timeRemaining.value = 0
      return // Done with all rounds
    }
    
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

function handleClose() {
  if (isRunning.value) {
    confirmModalType.value = 'close'
    pendingAction.value = () => {
      pauseTimer()
      document.title = 'HyperFocus Productivity'
      emit('close')
    }
    showConfirmModal.value = true
  } else {
    pauseTimer()
    document.title = 'HyperFocus Productivity'
    emit('close')
  }
}

function handleSkip() {
  if (isRunning.value) {
    confirmModalType.value = 'skip'
    pendingAction.value = () => {
      handlePhaseComplete()
    }
    showConfirmModal.value = true
  } else {
    handlePhaseComplete()
  }
}

function handleReset() {
  if (isRunning.value) {
    confirmModalType.value = 'reset'
    pendingAction.value = () => {
      pauseTimer()
      currentRound.value = 1
      currentPhase.value = 'Focus'
      timeRemaining.value = props.focusDuration * 60
    }
    showConfirmModal.value = true
  } else {
    pauseTimer()
    currentRound.value = 1
    currentPhase.value = 'Focus'
    timeRemaining.value = props.focusDuration * 60
  }
}

function cancelConfirmation() {
  showConfirmModal.value = false
  pendingAction.value = null
}

function confirmAction() {
  if (pendingAction.value) {
    pendingAction.value()
  }
  showConfirmModal.value = false
  pendingAction.value = null
}

onMounted(() => {
  const originalTitle = document.title
  
  onUnmounted(() => {
    if (timerInterval.value) {
      clearInterval(timerInterval.value)
    }
    document.title = originalTitle
  })
})
</script> 
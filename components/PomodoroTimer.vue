<template>
  <div class="bg-white border-b">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between py-3">
        <!-- Timer Display -->
        <div class="flex items-center space-x-4">
          <div class="text-2xl font-bold">{{ formatTime(timeLeft) }}</div>
          <div class="text-sm text-gray-500">{{ isBreak ? 'Break' : 'Focus' }}</div>
          <div class="text-sm text-gray-500">Round {{ currentRound }} of {{ rounds }}</div>
        </div>

        <!-- Progress Bar -->
        <div class="flex-1 mx-8">
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-blue-500 transition-all duration-1000 ease-linear"
              :style="{ width: `${(1 - timeLeft / (isBreak ? breakDuration : focusDuration)) * 100}%` }"
            ></div>
          </div>
        </div>

        <!-- Template Selector -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <select
              v-model="selectedTemplateId"
              @change="selectTemplate"
              class="block w-40 px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              :disabled="isRunning"
              :class="{'opacity-75 cursor-not-allowed': isRunning}"
            >
              <option 
                v-for="template in templates" 
                :key="template.id" 
                :value="template.id"
              >
                {{ template.name }}
              </option>
            </select>
            <!-- Overlay to prevent dropdown from showing when disabled -->
            <div 
              v-if="isRunning" 
              class="absolute inset-0"
              @click.prevent
              @mousedown.prevent
            ></div>
          </div>

          <!-- Controls -->
          <div class="flex items-center space-x-2">
            <button
              v-if="!isRunning"
              @click="startTimer"
              class="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            >
              Start
            </button>
            <button
              v-else
              @click="pauseTimer"
              class="px-4 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
            >
              Pause
            </button>
            <button
              @click="resetTimer"
              class="px-4 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              @click="skipToNextRound"
              class="px-4 py-1.5 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
            >
              Skip
            </button>
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
  },
  templates: {
    type: Array as PropType<Array<{
      id: string;
      name: string;
      focusDuration: number;
      shortBreakDuration: number;
      rounds: number;
    }>>,
    default: () => []
  }
})

const emit = defineEmits(['timer-state-change', 'template-change'])

const selectedTemplateId = ref('')
const timeLeft = ref(props.focusDuration)
const isRunning = ref(false)
const isBreak = ref(false)
const currentRound = ref(1)
const timerInterval = ref<number | null>(null)
const titleInterval = ref<number | null>(null)
const startTime = ref(0)
const elapsedTime = ref(0)
const stepEndTime = ref<number | null>(null)
const sessionSteps = ref<SessionStep[]>([])

// Define the type for session steps
interface SessionStep {
  type: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

// Expose the session steps for parent components
defineExpose({
  sessionSteps
})

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
        
        updateDocumentTitle()
        titleInterval.value = window.setInterval(updateDocumentTitle, 1000)
      })
    }
  }
}

function updateRemainingTime(): boolean {
  if (!stepEndTime.value) return false
  
  const now = Date.now()
  const remaining = stepEndTime.value - now
  
  if (remaining <= 0) {
    timeLeft.value = 0
    return false
  }
  
  timeLeft.value = Math.ceil(remaining / 1000)
  return true
}

function updateDocumentTitle() {
  if (isRunning.value) {
    const titlePrefix = isBreak.value ? '☕' : '🍅'
    document.title = `${titlePrefix} ${formatTime(timeLeft.value)} - Pomodoro Timer`
  } else {
    document.title = 'Pomodoro Timer'
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function startTimer() {
  if (isRunning.value) return
  
  isRunning.value = true
  emit('timer-state-change', true)
  
  // Set the end time for the current step
  stepEndTime.value = Date.now() + (timeLeft.value * 1000)
  
  timerInterval.value = window.setInterval(() => {
    if (!updateRemainingTime()) {
      // Timer finished
      if (isBreak.value) {
        // End of break - start focus
        isBreak.value = false
        timeLeft.value = props.focusDuration
        currentRound.value++
      } else {
        // End of focus - start break if not the last round
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
      
      // Play sound notification
      const audio = new Audio('/sounds/timer-complete.mp3')
      audio.play().catch(err => console.log('Audio play failed:', err))
      
      // Send browser notification
      if (Notification.permission === 'granted') {
        const notificationTitle = isBreak.value ? 'Break Time!' : 'Focus Time!'
        const notificationBody = isBreak.value 
          ? `Time to take a ${Math.floor(props.breakDuration / 60)} minute break`
          : `Time to focus for ${Math.floor(props.focusDuration / 60)} minutes`
        
        new Notification(notificationTitle, {
          body: notificationBody,
          icon: '/favicon.ico'
        })
      }
    }
    saveState()
  }, 100) // Update more frequently for smoother animation
  
  // Update document title with timer
  updateDocumentTitle()
  titleInterval.value = window.setInterval(updateDocumentTitle, 1000)
  
  // Request notification permission if not already granted
  if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission()
  }
}

function pauseTimer() {
  if (!isRunning.value) return
  
  isRunning.value = false
  emit('timer-state-change', false)
  
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  
  if (titleInterval.value) {
    clearInterval(titleInterval.value)
    titleInterval.value = null
    document.title = 'Pomodoro Timer (Paused)'
  }
  
  // If a step was in progress, save the elapsed time
  if (stepEndTime.value) {
    elapsedTime.value = stepEndTime.value - Date.now()
    stepEndTime.value = null
  }
  
  saveState()
}

function resetTimer() {
  // Clear intervals
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
  if (titleInterval.value) {
    clearInterval(titleInterval.value)
    titleInterval.value = null
    document.title = 'Pomodoro Timer'
  }
  
  // Reset state
  isRunning.value = false
  emit('timer-state-change', false)
  isBreak.value = false
  currentRound.value = 1
  timeLeft.value = props.focusDuration
  stepEndTime.value = null
  elapsedTime.value = 0
  
  // Regenerate session steps
  generateSessionSteps()
  
  saveState()
}

function skipToNextRound() {
  // Skip to next phase
  if (isBreak.value) {
    // Skip break, go to focus
    isBreak.value = false
    timeLeft.value = props.focusDuration
    currentRound.value++
  } else {
    // Skip focus, go to break or end
    if (currentRound.value < props.rounds) {
      isBreak.value = true
      timeLeft.value = props.breakDuration
    } else {
      resetTimer()
      return
    }
  }
  
  // If the timer is running, update the end time
  if (isRunning.value) {
    stepEndTime.value = Date.now() + (timeLeft.value * 1000)
  }
  
  updateSessionSteps()
  saveState()
}

function generateSessionSteps() {
  const steps: SessionStep[] = []
  
  for (let round = 1; round <= props.rounds; round++) {
    // Focus step
    steps.push({
      type: `Focus ${round}`,
      description: `${Math.floor(props.focusDuration / 60)} minute focus period`,
      status: 
        round < currentRound.value || (round === currentRound.value && isBreak.value) 
          ? 'completed' 
          : round === currentRound.value && !isBreak.value 
            ? 'current' 
            : 'upcoming'
    })
    
    // Break step
    if (round < props.rounds) {
      steps.push({
        type: `Break ${round}`,
        description: `${Math.floor(props.breakDuration / 60)} minute break`,
        status: 
          round < currentRound.value 
            ? 'completed' 
            : round === currentRound.value && isBreak.value 
              ? 'current' 
              : 'upcoming'
      })
    }
  }
  
  sessionSteps.value = steps
}

function updateSessionSteps() {
  generateSessionSteps()
}

function selectTemplate() {
  if (isRunning.value) return
  
  const selected = props.templates.find(t => t.id === selectedTemplateId.value)
  if (selected) {
    emit('template-change', selected)
  }
}

// Initialize session steps on component creation
onMounted(() => {
  generateSessionSteps()
  loadState()
})

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  if (titleInterval.value) {
    clearInterval(titleInterval.value)
  }
})
</script> 
<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Pomodoro</h1>
        <NuxtLink
          to="/app/pomodoros/templates"
          class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
          </svg>
          Manage Templates
        </NuxtLink>
      </div>
      
      <!-- Template selector -->
      <div class="mb-6 flex justify-center" v-if="templates.length > 0">
        <div class="w-full max-w-xs">
          <label for="template-selector" class="block text-sm font-medium text-gray-700 mb-1">Timer Template</label>
          <select
            id="template-selector"
            v-model="selectedTemplateId"
            @change="selectTemplate"
            class="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :disabled="timerIsRunning"
          >
            <option 
              v-for="template in templates" 
              :key="template.id" 
              :value="template.id"
            >
              {{ template.name }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- 3-column layout -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left column: Session Steps -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Session Progress</h2>
          <div v-if="timerRef">
            <div class="space-y-2">
              <div
                v-for="(step, index) in timerRef.sessionSteps"
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
          <div v-else class="text-gray-500 text-center py-4">
            Start a session to see progress steps
          </div>
        </div>
        
        <!-- Middle column: Timer -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <PomodoroTimer
            ref="timerRef"
            :focus-duration="currentTemplate.focusDuration || 25 * 60"
            :break-duration="currentTemplate.shortBreakDuration || 5 * 60"
            :rounds="currentTemplate.rounds || 4"
            @timer-state-change="handleTimerStateChange"
          />
          
          <!-- Warning Message -->
          <div
            v-if="timerIsRunning"
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
        </div>
        
        <!-- Right column: Stats -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <PomodoroStats />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { User, UserSubscription } from '~/server/types'

definePageMeta({
  middleware: ['auth']
})

interface UserWithSubscription extends Omit<User, 'subscription'> {
  subscription: {
    type: 'MONTHLY' | 'YEARLY' | null
    status: 'FREE_TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'
    freeTrialExpiresAt: string
    currentPeriodStart: string | null
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
  } | null
}

interface PomodoroTemplate {
  id: string
  userId: string
  name: string
  description?: string
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration?: number
  rounds: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const user = ref<UserWithSubscription | null>(null)
const templates = ref<PomodoroTemplate[]>([])
const selectedTemplateId = ref('')
const currentTemplate = ref<Partial<PomodoroTemplate>>({
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  rounds: 4
})
const timerIsRunning = ref(false)
const timerRef = ref(null)

// Default templates if we can't fetch from the API yet
const defaultTemplates = [
  {
    id: 'classic',
    userId: '',
    name: 'Classic Pomodoro',
    description: 'Traditional 25/5 pomodoro technique',
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    rounds: 4,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'long-focus',
    userId: '',
    name: 'Long Focus',
    description: 'Extended focus periods with longer breaks',
    focusDuration: 50 * 60,
    shortBreakDuration: 10 * 60,
    rounds: 3,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'short-sessions',
    userId: '',
    name: 'Short Sessions',
    description: 'Quick focus bursts with minimal breaks',
    focusDuration: 15 * 60,
    shortBreakDuration: 3 * 60,
    rounds: 7,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await $fetch<UserWithSubscription>('/api/auth/me')
    user.value = response
    
    // Set initial templates and fetch from API
    templates.value = defaultTemplates
    await fetchTemplates()
    
    // Select default template
    selectDefaultTemplate()
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

async function fetchTemplates() {
  try {
    const response = await $fetch<PomodoroTemplate[]>('/api/pomodoro/templates')
    
    if (response && response.length > 0) {
      // Replace templates with API response only if we got valid templates back
      templates.value = response
    }
  } catch (error) {
    console.error('Failed to fetch templates:', error)
    // Keep the default templates if the API call fails
  }
}

function selectDefaultTemplate() {
  // Find default template
  const defaultTemplate = templates.value.find(t => t.isDefault)
  if (defaultTemplate) {
    selectedTemplateId.value = defaultTemplate.id
    currentTemplate.value = { ...defaultTemplate }
  } else if (templates.value.length > 0) {
    // If no default, use first one
    selectedTemplateId.value = templates.value[0].id
    currentTemplate.value = { ...templates.value[0] }
  }
}

function selectTemplate() {
  if (timerIsRunning.value) {
    // Don't update template when timer is running
    return
  }
  
  const selected = templates.value.find(t => t.id === selectedTemplateId.value)
  if (selected) {
    currentTemplate.value = { ...selected }
  }
}

function handleTimerStateChange(isRunning: boolean) {
  timerIsRunning.value = isRunning
}
</script> 
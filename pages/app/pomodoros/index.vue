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
      
      <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
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
        
        <PomodoroTimer
          :focus-duration="currentTemplate.focusDuration || 25 * 60"
          :break-duration="currentTemplate.shortBreakDuration || 5 * 60"
          :rounds="currentTemplate.rounds || 4"
          @timer-state-change="handleTimerStateChange"
        />
      </div>
      <div class="bg-white rounded-lg shadow-sm">
        <PomodoroStats />
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
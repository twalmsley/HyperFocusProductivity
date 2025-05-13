<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Settings</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
            <p class="text-gray-600">Your profile settings will appear here.</p>
          </div>
          <div>
            <h2 class="text-xl font-semibold mb-4">Notification Settings</h2>
            <p class="text-gray-600">Your notification preferences will appear here.</p>
          </div>
          <div>
            <h2 class="text-xl font-semibold mb-4">Pomodoro Settings</h2>
            <p class="text-gray-600">Your pomodoro timer settings will appear here.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: ['auth']
})

interface PomodoroTemplate {
  id: string;
  userId: string;
  name: string;
  description: string;
  focusDuration: number;
  shortBreakDuration: number;
  rounds: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const { user, isLoading } = useAuth()
const templates = ref<PomodoroTemplate[]>([])
const currentTemplate = ref<Partial<PomodoroTemplate>>({
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  rounds: 4
})

// Storage key for template selection
const TEMPLATE_STORAGE_KEY = 'pomodoro-selected-template'

// Default templates if we can't fetch from the API yet
const defaultTemplates: PomodoroTemplate[] = [
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

// Initialize templates with defaults
templates.value = defaultTemplates

// Redirect to login if not authenticated
watch([isLoading, user], ([loading, currentUser]) => {
  if (!loading && !currentUser) {
    navigateTo('/login')
  }
})


// Fetch templates on component mount
onMounted(() => {
})
</script> 
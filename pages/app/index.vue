<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Welcome to HyperFocusProductivity</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Quick Stats -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Today's Focus</h2>
          <p class="text-gray-600">No tasks scheduled yet</p>
        </div>
        
        <!-- Recent Activity -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
          <p class="text-gray-600">No recent activity</p>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <NuxtLink 
              to="/app/tasks/new" 
              class="block w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors"
            >
              Create New Task
            </NuxtLink>
            <NuxtLink 
              to="/app/settings" 
              class="block w-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2 rounded-lg text-center transition-colors"
            >
              Update Settings
            </NuxtLink>
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
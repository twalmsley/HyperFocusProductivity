<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Settings</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold mb-4">Pomodoro Settings</h2>
            
            <div v-if="isLoading" class="flex justify-center py-6">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
            
            <div v-else class="space-y-6">
              <form @submit.prevent="confirmSave" class="space-y-6">
                <!-- Focus Duration -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label for="focusDuration" class="block text-sm font-medium text-gray-700">
                      Focus Duration (minutes)
                    </label>
                    <span class="text-sm text-gray-500">{{ pomodoroSettings.focusDuration }} minutes</span>
                  </div>
                  <input
                    id="focusDuration"
                    v-model.number="pomodoroSettings.focusDuration"
                    type="range"
                    min="10"
                    max="100"
                    step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p class="mt-1 text-sm text-gray-500">The length of each focused work session. Recommended: 25 minutes for standard Pomodoro technique.</p>
                </div>
                
                <!-- Short Break Duration -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label for="shortBreakDuration" class="block text-sm font-medium text-gray-700">
                      Short Break Duration (minutes)
                    </label>
                    <span class="text-sm text-gray-500">{{ pomodoroSettings.shortBreakDuration }} minutes</span>
                  </div>
                  <input
                    id="shortBreakDuration"
                    v-model.number="pomodoroSettings.shortBreakDuration"
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p class="mt-1 text-sm text-gray-500">A brief rest after each focus session. Recommended: 5 minutes.</p>
                </div>
                
                <!-- Long Break Duration -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label for="longBreakDuration" class="block text-sm font-medium text-gray-700">
                      Long Break Duration (minutes)
                    </label>
                    <span class="text-sm text-gray-500">{{ pomodoroSettings.longBreakDuration }} minutes</span>
                  </div>
                  <input
                    id="longBreakDuration"
                    v-model.number="pomodoroSettings.longBreakDuration"
                    type="range"
                    min="1"
                    max="60"
                    step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p class="mt-1 text-sm text-gray-500">A longer break after completing multiple focus sessions. Recommended: 15-30 minutes.</p>
                </div>
                
                <!-- Long Break Interval -->
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <label for="longBreakInterval" class="block text-sm font-medium text-gray-700">
                      Long Break Interval
                    </label>
                    <span class="text-sm text-gray-500">After {{ pomodoroSettings.longBreakInterval }} sessions</span>
                  </div>
                  <input
                    id="longBreakInterval"
                    v-model.number="pomodoroSettings.longBreakInterval"
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p class="mt-1 text-sm text-gray-500">Number of focus sessions before a long break. Recommended: 4 sessions.</p>
                </div>
                
                <div class="pt-4">
                  <button
                    type="submit"
                    :disabled="isSaving || !hasChanged"
                    class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {{ isSaving ? 'Saving...' : 'Save Settings' }}
                  </button>
                  <button
                    v-if="hasChanged"
                    type="button"
                    @click="resetSettings"
                    class="ml-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Reset
                  </button>
                </div>
              </form>
              
              <!-- Success message -->
              <div v-if="saveSuccess" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                Settings saved successfully!
              </div>
              
              <!-- Error message -->
              <div v-if="saveError" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                {{ saveError }}
              </div>
            </div>
          </div>

          <!-- Subscription Section -->
          <div>
            <h2 class="text-xl font-semibold mb-4">Subscription</h2>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <p class="text-gray-600 mb-4">Manage your subscription and view your current plan details.</p>
              <NuxtLink
                to="/app/subscription"
                class="inline-block px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
              >
                My Subscription
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="mb-4">
          <h3 class="text-xl font-medium text-gray-900">Confirm Settings Update</h3>
          <p class="mt-2 text-gray-600">Are you sure you want to update your Pomodoro timer settings?</p>
        </div>
        
        <div class="space-y-2 mt-4 mb-6">
          <p class="text-sm text-gray-700"><span class="font-medium">Focus Duration:</span> {{ pomodoroSettings.focusDuration }} minutes</p>
          <p class="text-sm text-gray-700"><span class="font-medium">Short Break:</span> {{ pomodoroSettings.shortBreakDuration }} minutes</p>
          <p class="text-sm text-gray-700"><span class="font-medium">Long Break:</span> {{ pomodoroSettings.longBreakDuration }} minutes</p>
          <p class="text-sm text-gray-700"><span class="font-medium">Long Break Interval:</span> {{ pomodoroSettings.longBreakInterval }} sessions</p>
        </div>
        
        <div class="flex justify-end space-x-4">
          <button
            @click="showConfirmModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveSettings"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()

const userSession = await getSession()
const user = userSession?.user;const router = useRouter()

interface UserSettings {
  userId: string;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  theme: string;
}


const isLoading = ref(true)
const isSaving = ref(false)
const saveSuccess = ref(false)
const saveError = ref<string | null>(null)
const showConfirmModal = ref(false)

const pomodoroSettings = ref<UserSettings>({
  userId: '',
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  theme: 'AUTO'
})

const originalSettings = ref<UserSettings | null>(null)

// Check if settings have changed
const hasChanged = computed(() => {
  if (!originalSettings.value) return false
  
  return (
    pomodoroSettings.value.focusDuration !== originalSettings.value.focusDuration ||
    pomodoroSettings.value.shortBreakDuration !== originalSettings.value.shortBreakDuration ||
    pomodoroSettings.value.longBreakDuration !== originalSettings.value.longBreakDuration ||
    pomodoroSettings.value.longBreakInterval !== originalSettings.value.longBreakInterval
  )
})

// Fetch user settings
async function fetchUserSettings() {
  if (!user) return
  
  isLoading.value = true
  saveSuccess.value = false
  saveError.value = null
  
  try {
    const response = await $fetch<UserSettings>('/api/settings')
    
    pomodoroSettings.value = response
    originalSettings.value = { ...response }
    
  } catch (error) {
    console.error('Failed to fetch user settings:', error)
    saveError.value = 'Failed to load settings. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Show confirmation modal before saving
function confirmSave() {
  showConfirmModal.value = true
}

// Reset settings to original values
function resetSettings() {
  if (originalSettings.value) {
    pomodoroSettings.value = { ...originalSettings.value }
  }
  saveSuccess.value = false
  saveError.value = null
}

// Save updated settings to database
async function saveSettings() {
  showConfirmModal.value = false
  isSaving.value = true
  saveSuccess.value = false
  saveError.value = null
  
  try {
    const response = await $fetch<UserSettings>('/api/settings', {
      method: 'PATCH',
      body: {
        focusDuration: pomodoroSettings.value.focusDuration,
        shortBreakDuration: pomodoroSettings.value.shortBreakDuration,
        longBreakDuration: pomodoroSettings.value.longBreakDuration,
        longBreakInterval: pomodoroSettings.value.longBreakInterval
      }
    })
    
    pomodoroSettings.value = response
    originalSettings.value = { ...response }
    saveSuccess.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
    
  } catch (error) {
    console.error('Failed to save user settings:', error)
    saveError.value = 'Failed to save settings. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// Fetch user settings on component mount
onMounted(async () => {
  if (user) {
    await fetchUserSettings()
  }
})

const showProfileConfirmModal = ref(false)

</script> 
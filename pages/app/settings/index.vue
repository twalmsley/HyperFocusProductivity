<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-center">Settings</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-8">
          <PomodoroSettings
            :is-loading="isLoading"
            :is-saving="isSaving"
            :save-success="saveSuccess"
            :save-error="saveError"
            :settings="pomodoroSettings"
            :has-changed="hasChanged"
            @save="confirmSave"
            @reset="resetSettings"
          />
          
          <DataExportSection />
          
          <DataDeletionSection />
          
          <SubscriptionSection />
        </div>
      </div>
    </main>
    
    <ConfirmModal
      :show="showConfirmModal"
      :settings="pomodoroSettings"
      @cancel="showConfirmModal = false"
      @confirm="saveSettings"
    />
  </div>
</template>

<script setup lang="ts">
import PomodoroSettings from '~/components/settings/PomodoroSettings.vue'
import DataExportSection from '~/components/settings/DataExportSection.vue'
import DataDeletionSection from '~/components/settings/DataDeletionSection.vue'
import SubscriptionSection from '~/components/settings/SubscriptionSection.vue'
import ConfirmModal from '~/components/settings/ConfirmModal.vue'

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
const user = userSession?.user;
const router = useRouter()

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
</script> 
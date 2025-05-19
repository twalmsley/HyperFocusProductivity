<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Settings</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-8">
          <div>
            <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
            <div v-if="isProfileLoading" class="flex justify-center py-6">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
            <div v-else class="space-y-6">
              <form @submit.prevent="confirmProfileUpdate" class="space-y-6">
                <!-- Username -->
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    v-model.trim="profileForm.username"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Enter username"
                  />
                  <p class="text-xs text-gray-500 mt-1">Username must be between 4 and 50 characters</p>
                </div>
                
                <!-- Email (disabled) -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p class="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>
                
                <!-- Current Password -->
                <div>
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    v-model="profileForm.currentPassword"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  <p class="text-xs text-gray-500 mt-1">Required to change password</p>
                </div>
                
                <!-- New Password -->
                <div>
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    v-model="profileForm.newPassword"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Create a new password"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Password must be 8-50 characters and include uppercase, lowercase, number, and special character
                  </p>
                </div>
                
                <!-- Confirm New Password -->
                <div>
                  <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmNewPassword"
                    v-model="profileForm.confirmNewPassword"
                    type="password"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <div v-if="profileError" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                  {{ profileError }}
                </div>
                
                <div v-if="profileSuccess" class="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                  Profile updated successfully!
                </div>
                
                <div class="pt-4">
                  <button
                    type="submit"
                    :disabled="isProfileSaving || !hasProfileChanged"
                    class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)] disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {{ isProfileSaving ? 'Saving...' : 'Update Profile' }}
                  </button>
                  <button
                    v-if="hasProfileChanged"
                    type="button"
                    @click="resetProfileForm"
                    class="ml-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
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
                View Subscription
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
    
    <!-- Profile Confirmation Modal -->
    <div v-if="showProfileConfirmModal" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="mb-4">
          <h3 class="text-xl font-medium text-gray-900">Confirm Profile Update</h3>
          <p class="mt-2 text-gray-600">Are you sure you want to update your profile information?</p>
        </div>
        
        <div class="space-y-2 mt-4 mb-6">
          <p v-if="profileForm.username !== originalProfile.username" class="text-sm text-gray-700">
            <span class="font-medium">Username:</span> {{ profileForm.username }}
          </p>
          <p v-if="profileForm.newPassword" class="text-sm text-gray-700">
            <span class="font-medium">Password:</span> Will be updated
          </p>
        </div>
        
        <div class="flex justify-end space-x-4">
          <button
            @click="showProfileConfirmModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="updateProfile"
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
import { useAuth } from '~/composables/useAuth'
import { useCsrf } from '~/composables/useCsrf'

definePageMeta({
  middleware: ['auth']
})

interface UserSettings {
  userId: string;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  theme: string;
}

const { user, isLoading: authLoading } = useAuth()
const { csrfToken, fetchCsrfToken } = useCsrf()

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
  if (!user.value) return
  
  isLoading.value = true
  saveSuccess.value = false
  saveError.value = null
  
  try {
    const response = await $fetch<UserSettings>('/api/settings', {
      headers: {
        'X-CSRF-Token': csrfToken.value || ''
      }
    })
    
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
      },
      headers: {
        'X-CSRF-Token': csrfToken.value || ''
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

// Watch for auth loading completion
watch([authLoading], ([loading]) => {
  if (!loading && user.value) {
    fetchUserSettings()
  }
})

// Fetch user settings on component mount
onMounted(async () => {
  if (user.value) {
    await fetchUserSettings()
    initializeProfileForm()
  }
})

const isProfileLoading = ref(true)
const isProfileSaving = ref(false)
const profileSuccess = ref(false)
const profileError = ref<string | null>(null)
const showProfileConfirmModal = ref(false)

const profileForm = ref({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
})

const originalProfile = ref({
  username: '',
  email: ''
})

// Check if profile has changed
const hasProfileChanged = computed(() => {
  // Check if username has changed
  if (profileForm.value.username !== originalProfile.value.username) {
    return true
  }
  
  // Check if password fields have values
  if (profileForm.value.currentPassword && profileForm.value.newPassword && profileForm.value.confirmNewPassword) {
    return true
  }
  
  return false
})

// Initialize profile form with user data
function initializeProfileForm() {
  if (!user.value) return
  
  isProfileLoading.value = true
  profileSuccess.value = false
  profileError.value = null
  
  profileForm.value.username = user.value.name || ''
  profileForm.value.email = user.value.email || ''
  profileForm.value.currentPassword = ''
  profileForm.value.newPassword = ''
  profileForm.value.confirmNewPassword = ''
  
  originalProfile.value.username = user.value.name || ''
  originalProfile.value.email = user.value.email || ''
  
  isProfileLoading.value = false
}

// Show confirmation modal before saving
function confirmProfileUpdate() {
  profileError.value = null
  
  // Validate username
  if (!profileForm.value.username.trim()) {
    profileError.value = 'Username is required'
    return
  }
  
  if (profileForm.value.username.trim().length < 4 || profileForm.value.username.trim().length > 50) {
    profileError.value = 'Username must be between 4 and 50 characters'
    return
  }
  
  // Check if password fields are filled partially
  const hasCurrentPassword = !!profileForm.value.currentPassword
  const hasNewPassword = !!profileForm.value.newPassword
  const hasConfirmPassword = !!profileForm.value.confirmNewPassword
  
  if ((hasCurrentPassword || hasNewPassword || hasConfirmPassword) && 
      !(hasCurrentPassword && hasNewPassword && hasConfirmPassword)) {
    profileError.value = 'All password fields must be filled to change password'
    return
  }
  
  // Validate new password if trying to change
  if (hasNewPassword) {
    if (profileForm.value.newPassword.length < 8 || profileForm.value.newPassword.length > 50) {
      profileError.value = 'Password must be between 8 and 50 characters'
      return
    }
    
    // Password security validation
    const hasUpperCase = /[A-Z]/.test(profileForm.value.newPassword)
    const hasLowerCase = /[a-z]/.test(profileForm.value.newPassword)
    const hasNumbers = /\d/.test(profileForm.value.newPassword)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(profileForm.value.newPassword)
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      profileError.value = 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
      return
    }
    
    if (profileForm.value.newPassword !== profileForm.value.confirmNewPassword) {
      profileError.value = 'New passwords do not match'
      return
    }
  }
  
  showProfileConfirmModal.value = true
}

// Reset profile form to original values
function resetProfileForm() {
  profileForm.value.username = originalProfile.value.username
  profileForm.value.currentPassword = ''
  profileForm.value.newPassword = ''
  profileForm.value.confirmNewPassword = ''
  profileSuccess.value = false
  profileError.value = null
}

// Update profile information
async function updateProfile() {
  showProfileConfirmModal.value = false
  isProfileSaving.value = true
  profileSuccess.value = false
  profileError.value = null
  
  const updateData: {
    username?: string,
    currentPassword?: string,
    newPassword?: string
  } = {}
  
  // Only include fields that should be updated
  if (profileForm.value.username !== originalProfile.value.username) {
    updateData.username = profileForm.value.username
  }
  
  if (profileForm.value.currentPassword && profileForm.value.newPassword) {
    updateData.currentPassword = profileForm.value.currentPassword
    updateData.newPassword = profileForm.value.newPassword
  }
  
  try {
    const response = await $fetch('/api/auth/update-profile', {
      method: 'PATCH',
      body: updateData,
      headers: {
        'X-CSRF-Token': csrfToken.value || ''
      }
    })
    
    // Update user information
    if (response.user && user.value) {
      user.value.name = response.user.name
      
      // Update original profile
      originalProfile.value.username = response.user.name || ''
      
      // Reset password fields
      profileForm.value.currentPassword = ''
      profileForm.value.newPassword = ''
      profileForm.value.confirmNewPassword = ''
    }
    
    profileSuccess.value = true
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      profileSuccess.value = false
    }, 3000)
    
  } catch (error: any) {
    console.error('Failed to update profile:', error)
    
    if (error.response) {
      profileError.value = error.response._data.message || 'Failed to update profile. Please try again.'
    } else {
      profileError.value = 'Failed to update profile. Please try again.'
    }
  } finally {
    isProfileSaving.value = false
  }
}

// Watch for user updates
watch([user], ([newUser]) => {
  if (newUser) {
    initializeProfileForm()
  }
})
</script> 
<template>
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
            <span class="text-sm text-gray-500">{{ settings.focusDuration }} minutes</span>
          </div>
          <input
            id="focusDuration"
            v-model.number="settings.focusDuration"
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
            <span class="text-sm text-gray-500">{{ settings.shortBreakDuration }} minutes</span>
          </div>
          <input
            id="shortBreakDuration"
            v-model.number="settings.shortBreakDuration"
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
            <span class="text-sm text-gray-500">{{ settings.longBreakDuration }} minutes</span>
          </div>
          <input
            id="longBreakDuration"
            v-model.number="settings.longBreakDuration"
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
            <span class="text-sm text-gray-500">After {{ settings.longBreakInterval }} sessions</span>
          </div>
          <input
            id="longBreakInterval"
            v-model.number="settings.longBreakInterval"
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
</template>

<script setup lang="ts">
interface UserSettings {
  userId: string;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  theme: string;
}

const props = defineProps<{
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  settings: UserSettings;
  hasChanged: boolean;
}>();

const emit = defineEmits<{
  (e: 'save'): void;
  (e: 'reset'): void;
}>();

function confirmSave() {
  emit('save');
}

function resetSettings() {
  emit('reset');
}
</script> 
<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
      <div class="mb-4">
        <h3 class="text-xl font-medium text-gray-900">Confirm Settings Update</h3>
        <p class="mt-2 text-gray-600">Are you sure you want to update your Pomodoro timer settings?</p>
      </div>
      
      <div class="space-y-2 mt-4 mb-6">
        <p class="text-sm text-gray-700"><span class="font-medium">Focus Duration:</span> {{ settings.focusDuration }} minutes</p>
        <p class="text-sm text-gray-700"><span class="font-medium">Short Break:</span> {{ settings.shortBreakDuration }} minutes</p>
        <p class="text-sm text-gray-700"><span class="font-medium">Long Break:</span> {{ settings.longBreakDuration }} minutes</p>
        <p class="text-sm text-gray-700"><span class="font-medium">Long Break Interval:</span> {{ settings.longBreakInterval }} sessions</p>
      </div>
      
      <div class="flex justify-end space-x-4">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
        >
          Confirm
        </button>
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

defineProps<{
  show: boolean;
  settings: UserSettings;
}>();

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();
</script> 
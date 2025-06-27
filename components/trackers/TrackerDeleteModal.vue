<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">Delete Tracker</h3>
      </div>
      
      <p class="text-gray-600 mb-6">
        Are you sure you want to delete <strong>{{ tracker?.name }}</strong>? 
        This action cannot be undone. All tracking data for this tracker will be permanently deleted.
      </p>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Delete Tracker
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tracker {
  id: string
  name: string
  groupName: string
  entries: any[]
}

defineProps<{
  show: boolean
  tracker: Tracker | null
}>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script> 
<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Task</h3>
      <p class="text-gray-600 mb-6">Are you sure you want to delete the task "{{ task?.title }}"?</p>
      <div class="flex justify-end space-x-4">
        <button @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
          No, Cancel
        </button>
        <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Task = {
  id: string;
  title: string;
}

defineProps<{
  show: boolean;
  task: Task | null;
}>()

defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>()
</script> 
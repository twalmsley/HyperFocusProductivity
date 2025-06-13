<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white/90 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">{{ task?.title }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
      </div>

      <div v-else-if="!task" class="text-center py-12 text-gray-500">
        Task not found
      </div>

      <div v-else class="space-y-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500">Group</h3>
          <p class="mt-1 text-lg text-gray-900">{{ task.groupName }}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Description</h3>
          <p class="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{{ task.description || 'No description' }}</p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Last Completed</h3>
          <p class="mt-1 text-lg text-gray-900">
            {{ task.lastCompletedDate ? formatDate(task.lastCompletedDate) : 'Never' }}
          </p>
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-500">Created</h3>
          <p class="mt-1 text-lg text-gray-900">{{ formatDate(task.createdAt) }}</p>
        </div>

        <div class="flex justify-end space-x-4 pt-4">
          <button
            @click="$emit('edit', task)"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--button-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          <button
            @click="$emit('complete', task)"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--button-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            Mark Complete
          </button>
          <button
            @click="$emit('delete', task)"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const props = defineProps<{
  show: boolean;
  task: any;
  isLoading?: boolean;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', task: any): void;
  (e: 'complete', task: any): void;
  (e: 'delete', task: any): void;
}>()

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy')
}
</script> 
<template>
  <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-medium text-gray-900">View Task</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
            {{ task.title }}
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200 prose prose-sm max-w-none" v-html="renderMarkdown(task.notes || '')"></div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
            {{ task.status ? task.status.replace('_', ' ') : 'Not set' }}
          </div>
        </div>

        <!-- Priority -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
            {{ task.priority }}
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
            {{ task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date' }}
          </div>
        </div>

        <!-- Estimated Pomodoros -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Pomodoros</label>
          <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
            {{ task.estimatedPomodoros || 'Not set' }}
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="$emit('close')"
          class="px-4 py-2 bg-[var(--primary)] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[var(--button-hover)]">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { marked } from 'marked'

// Configure marked options for proper markdown rendering
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true     // Enable GitHub Flavored Markdown
})

defineProps<{
  show: boolean;
  task: Task;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

function renderMarkdown(content: string): string {
  if (!content) return ''
  return marked(content) as string
}
</script> 
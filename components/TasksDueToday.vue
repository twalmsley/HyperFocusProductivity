<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-semibold mb-4">Tasks Due Today or Earlier</h2>
    <div v-if="isLoading" class="text-gray-600">Loading tasks...</div>
    <div v-else-if="tasks.length === 0" class="text-gray-600">No tasks due today or earlier</div>
    <div v-else class="space-y-4">
      <div 
        v-for="task in tasks" 
        :key="task.id" 
        class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
      >
        <!-- Task Header -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center">
            <h3 class="text-lg font-medium text-gray-900 line-clamp-2">{{ task.title }}</h3>
            <svg v-if="task.repeatType" class="h-4 w-4 text-blue-500 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Recurring task">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <button
            @click="$emit('view-task', task)"
            class="text-gray-400 hover:text-[var(--primary)] transition-colors p-1"
            title="View details"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Task Details -->
        <div class="mb-3 space-y-2">
          <div class="flex items-center space-x-3">
            <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(task)">
              {{ task.status.replace('_', ' ') }}
            </span>
            <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getPriorityClass(task)">
              {{ task.priority }}
            </span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-xs px-2 py-1 rounded-full" :class="getDueDateClass(task)">
              Due: {{ formatDueDate(task.dueDate) }}
            </span>
            <div class="text-xs flex items-center">
              <span :class="{
                'text-green-600 font-medium': task.completedPomodoros && task.estimatedPomodoros && task.completedPomodoros >= task.estimatedPomodoros,
                'text-orange-500': task.completedPomodoros && task.estimatedPomodoros && task.completedPomodoros < task.estimatedPomodoros,
                'text-gray-500': !task.completedPomodoros || !task.estimatedPomodoros
              }">
                {{ task.completedPomodoros || 0 }}
              </span>
              <span class="text-gray-400 mx-0.5">/</span>
              <span class="text-gray-500">{{ task.estimatedPomodoros || '-' }}</span>
              <span class="text-gray-400 ml-1">pomodoros</span>
            </div>
          </div>
        </div>

        <!-- Task Notes -->
        <div v-if="task.notes" class="mb-3">
          <p class="text-sm text-gray-600 line-clamp-2">{{ task.notes }}</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { isTaskDueToday, isTaskOverdue, formatDueDate } from '~/utils/taskUtils'

defineProps<{
  tasks: Task[];
  isLoading: boolean;
}>();

defineEmits<{
  (e: 'view-task', task: Task): void;
}>();

function getStatusClass(task: Task) {
  if (task.status === 'BACKLOG') return 'bg-yellow-100 text-yellow-800';
  if (task.status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800';
  if (task.status === 'DONE') return 'bg-green-100 text-green-800';
  return '';
}

function getPriorityClass(task: Task) {
  switch (task.priority) {
    case 'URGENT': return 'bg-red-100 text-red-800';
    case 'HIGH': return 'bg-orange-100 text-orange-800';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
    case 'LOW': return 'bg-green-100 text-green-800';
    default: return '';
  }
}

function getDueDateClass(task: Task) {
  if (isTaskOverdue(task)) return 'bg-red-100 text-red-800';
  if (isTaskDueToday(task)) return 'bg-amber-100 text-amber-800';
  return 'bg-gray-100 text-gray-800';
}
</script> 
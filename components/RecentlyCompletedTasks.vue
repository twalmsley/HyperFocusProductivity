<template>
  <div class="mt-8">
    <h2 class="text-xl font-semibold mb-4">Recently Completed Tasks</h2>
    <div v-if="isLoading" class="text-gray-600">Loading tasks...</div>
    <div v-else-if="tasks.length === 0" class="text-gray-600 bg-white p-6 rounded-lg shadow-sm">No recently completed tasks</div>
    <div v-else class="bg-white p-6 rounded-lg shadow-sm">
      <TaskTable :tasks="tasks" :show-completed-at="true" :show-due-date="false" @view-task="$emit('view-task', $event)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'

defineProps<{
  tasks: Task[];
  isLoading: boolean;
}>();

defineEmits<{
  (e: 'view-task', task: Task): void;
}>();
</script> 
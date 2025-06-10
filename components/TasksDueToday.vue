<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-semibold mb-4">Tasks Due Today or Earlier</h2>
    <div v-if="isLoading" class="text-gray-600">Loading tasks...</div>
    <div v-else-if="tasks.length === 0" class="text-gray-600">No tasks due today or earlier</div>
    <TaskTable v-else :tasks="tasks" :show-status="true" :show-due-date="true" @view-task="$emit('view-task', $event)" />
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
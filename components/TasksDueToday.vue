<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h2 class="text-xl font-semibold mb-4">Tasks Due Today or Earlier</h2>
    <div v-if="isLoading" class="text-gray-600">Loading tasks...</div>
    <div v-else-if="tasks.length === 0" class="text-gray-600">No tasks due today or earlier</div>
    <TaskTable v-else :tasks="tasks" :show-status="true" @view-task="$emit('view-task', $event)" />
  </div>
</template>

<script setup lang="ts">
interface Task {
  id: string;
  userId: string;
  title: string;
  notes: string;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedPomodoros: number | null;
  completedPomodoros: number | null;
  position: number;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
}

defineProps<{
  tasks: Task[];
  isLoading: boolean;
}>();

defineEmits<{
  (e: 'view-task', task: Task): void;
}>();
</script> 
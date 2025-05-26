<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-medium text-gray-900">{{ task?.title }}</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- Status -->
        <div>
          <h4 class="text-sm font-medium text-gray-500">Status</h4>
          <span class="mt-1 inline-block px-2 py-1 text-sm rounded-full" :class="{
            'bg-yellow-100 text-yellow-800': task?.status === 'BACKLOG',
            'bg-blue-100 text-blue-800': task?.status === 'IN_PROGRESS',
            'bg-green-100 text-green-800': task?.status === 'DONE'
          }">
            {{ task?.status.replace('_', ' ') }}
          </span>
        </div>

        <!-- Notes -->
        <div>
          <h4 class="text-sm font-medium text-gray-500">Notes</h4>
          <p class="mt-1 text-gray-900 whitespace-pre-wrap">{{ task?.notes || 'No notes' }}</p>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-medium text-gray-500">Created</h4>
            <p class="mt-1 text-gray-900">{{ task?.createdAt ? new
              Date(task.createdAt).toISOString().substring(0, 10) : '-' }}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Due Date</h4>
            <p class="mt-1 text-gray-900">{{ task?.dueDate ? new
              Date(task.dueDate).toISOString().substring(0, 10) : 'No due date' }}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Estimated Pomodoros</h4>
            <p class="mt-1 text-gray-900">{{ task?.estimatedPomodoros || '-' }}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Completed Pomodoros</h4>
            <p class="mt-1 flex items-center">
              <span :class="{
                'text-green-600 font-medium': task?.completedPomodoros && task?.estimatedPomodoros && task?.completedPomodoros >= task?.estimatedPomodoros,
                'text-orange-500': task?.completedPomodoros && task?.estimatedPomodoros && task?.completedPomodoros < task?.estimatedPomodoros,
                'text-gray-900': !task?.completedPomodoros || !task?.estimatedPomodoros
              }">
                {{ task?.completedPomodoros || 0 }}
              </span>
              <span v-if="task?.estimatedPomodoros" class="text-gray-400 mx-1">/</span>
              <span v-if="task?.estimatedPomodoros" class="text-gray-900">{{ task?.estimatedPomodoros }}</span>
              <span
                v-if="task?.completedPomodoros && task?.estimatedPomodoros && task?.completedPomodoros >= task?.estimatedPomodoros"
                class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Completed
              </span>
            </p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">Completed</h4>
            <p class="mt-1 text-gray-900">{{ task?.completedAt ? new
              Date(task.completedAt).toLocaleDateString() : 'Not completed' }}</p>
          </div>
        </div>

        <!-- Sessions -->
        <div v-if="task?.sessions?.length">
          <h4 class="text-sm font-medium text-gray-500 mb-2">Pomodoro Sessions</h4>
          <div class="space-y-2">
            <div v-for="session in task.sessions" :key="session.id" class="bg-gray-50 p-3 rounded-lg">
              <div class="flex justify-between text-sm">
                <span class="font-medium">{{ session.type.replace('_', ' ') }}</span>
                <span class="text-gray-500">{{ session.durationMinutes }} minutes</span>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ new Date(session.startTime).toLocaleString() }}
              </div>
              <p v-if="session.notes" class="text-sm text-gray-600 mt-1">{{ session.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE'

type Task = {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  estimatedPomodoros: number | null;
  completedPomodoros: number;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
  dueDate: string | null;
  position: number | null;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  sessions?: Array<{
    id: string;
    userId: string;
    taskId: string | null;
    type: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
    startTime: string;
    endTime: string;
    durationMinutes: number;
    notes: string | null;
  }>;
}

defineProps<{
  show: boolean;
  task: Task | null;
}>()

defineEmits<{
  (e: 'close'): void;
}>()
</script> 
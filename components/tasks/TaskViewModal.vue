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

        <!-- Priority -->
        <div>
          <h4 class="text-sm font-medium text-gray-500">Priority</h4>
          <span class="mt-1 inline-block px-2 py-1 text-sm rounded-full font-medium" :class="{
            'bg-red-100 text-red-800': task?.priority === 'URGENT',
            'bg-orange-100 text-orange-800': task?.priority === 'HIGH',
            'bg-yellow-100 text-yellow-800': task?.priority === 'MEDIUM',
            'bg-green-100 text-green-800': task?.priority === 'LOW'
          }">
            {{ task?.priority }}
          </span>
        </div>

        <!-- Notes -->
        <div>
          <h4 class="text-sm font-medium text-gray-500">Notes</h4>
          <p class="mt-1 text-gray-900 whitespace-pre-wrap">{{ task?.notes || 'No notes' }}</p>
        </div>

        <!-- Repeat Schedule -->
        <div v-if="task?.repeatType">
          <h4 class="text-sm font-medium text-gray-500">Repeat Schedule</h4>
          <div class="mt-1 flex items-center">
            <svg class="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span class="text-gray-900">{{ formatRepeatSchedule() }}</span>
          </div>
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
import type { Task, RepeatSchedule } from '~/types/task'

const props = defineProps<{
  show: boolean;
  task: Task | null;
}>()

defineEmits<{
  (e: 'close'): void;
}>()

function formatRepeatSchedule(): string {
  if (!props.task?.repeatType) return ''

  const task = props.task
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December']
  const ordinals = ['', 'First', 'Second', 'Third', 'Fourth', 'Last']

  switch (task.repeatType) {
    case 'DAILY':
      return 'Repeat daily'

    case 'WEEKLY':
      const interval = task.repeatInterval || 1
      if (task.repeatDays) {
        try {
          const days = JSON.parse(task.repeatDays).map((day: number) => dayNames[day]).join(', ')
          return interval === 1 ? `Every ${days}` : `Every ${interval} weeks on ${days}`
        } catch {
          // Fallback if JSON parsing fails
          return interval === 1 ? 'Repeat weekly' : `Every ${interval} weeks`
        }
      }
      return interval === 1 ? 'Repeat weekly' : `Every ${interval} weeks`

    case 'MONTHLY':
      const day = task.repeatDay
      return day ? `Monthly on day ${day}` : 'Repeat monthly'

    case 'ANNUALLY':
      const month = task.repeatMonth
      const dayOfMonth = task.repeatDay
      if (month && dayOfMonth) {
        return `Annually on ${monthNames[month - 1]} ${dayOfMonth}`
      }
      return 'Repeat annually'

    case 'MONTHLY_BY_WEEKDAY':
      if (task.repeatWeekOfMonth && task.repeatDayOfWeek !== undefined) {
        const week = ordinals[task.repeatWeekOfMonth]
        const day = dayNames[task.repeatDayOfWeek]
        return `${week} ${day} of every month`
      }
      return 'Repeat monthly by weekday'

    default:
      return ''
  }
}
</script> 
<template>
  <div class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow" :class="{
    'bg-orange-50': task.status === 'BACKLOG',
    'bg-blue-50': task.status === 'IN_PROGRESS',
    'bg-green-50': task.status === 'DONE',
    'bg-orange-100': isTaskOverdue(task) && task.status === 'BACKLOG',
    'bg-blue-100': isTaskOverdue(task) && task.status === 'IN_PROGRESS'
  }">
    <div class="flex justify-between items-start">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-lg font-medium text-gray-900">{{ task.title }}</h3>
          <svg v-if="task.repeatType" class="h-4 w-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Recurring task">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-3">
          <span class="px-2 py-1 text-xs rounded-full" :class="{
            'bg-yellow-100 text-yellow-800': task.status === 'BACKLOG',
            'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS',
            'bg-green-100 text-green-800': task.status === 'DONE'
          }">
            {{ task.status.replace('_', ' ') }}
          </span>
          
          <span class="px-2 py-1 text-xs rounded-full font-medium" :class="{
            'bg-red-100 text-red-800': task.priority === 'URGENT',
            'bg-orange-100 text-orange-800': task.priority === 'HIGH',
            'bg-yellow-100 text-yellow-800': task.priority === 'MEDIUM',
            'bg-green-100 text-green-800': task.priority === 'LOW'
          }">
            {{ task.priority }}
          </span>

          <div v-if="task.estimatedPomodoros" class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 flex items-center">
            <span :class="{
              'text-green-600 font-medium': task.completedPomodoros && task.completedPomodoros >= task.estimatedPomodoros,
              'text-orange-500': task.completedPomodoros && task.completedPomodoros < task.estimatedPomodoros,
              'text-gray-500': !task.completedPomodoros
            }">
              {{ task.completedPomodoros || 0 }}
            </span>
            <span class="text-gray-400 mx-0.5">/</span>
            <span class="text-gray-500">{{ task.estimatedPomodoros }}</span>
            <span class="ml-1">🍅</span>
          </div>

          <span v-if="task.dueDate" class="px-2 py-1 text-xs rounded-full" :class="{
            'bg-red-100 text-red-800': isTaskOverdue(task),
            'bg-gray-100 text-gray-800': !isTaskOverdue(task)
          }">
            {{ new Date(task.dueDate).toISOString().slice(0, 10) }}
          </span>
        </div>

        <p v-if="task.notes" class="text-sm text-gray-600 line-clamp-2">{{ task.notes }}</p>
      </div>

      <div class="flex items-center gap-2 ml-4">
        <button
          v-if="task.status === 'IN_PROGRESS' && (!task.estimatedPomodoros || task.completedPomodoros < task.estimatedPomodoros)"
          @click="$emit('start-pomodoro', task)"
          class="text-gray-400 hover:text-[var(--primary)]"
          title="Start Pomodoro Timer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button @click="$emit('view', task)" class="text-gray-400 hover:text-[var(--primary)]" title="View Details">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button @click="$emit('edit', task)" class="text-gray-400 hover:text-[var(--primary)]" title="Edit Task">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        
        <button @click="$emit('update-status', task)" class="text-gray-400 hover:text-[var(--primary)]"
          :title="task.status === 'BACKLOG' ? 'Start Task' : task.status === 'IN_PROGRESS' ? 'Complete Task' : 'Reopen Task'">
          <svg v-if="task.status === 'BACKLOG'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          <svg v-else-if="task.status === 'IN_PROGRESS'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button @click="$emit('delete', task)" class="text-gray-400 hover:text-red-600" title="Delete Task">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button 
          v-if="task.dueDate"
          @click="$emit('extend-due-date', task)" 
          class="text-gray-400 hover:text-[var(--primary)]" 
          title="Move to next day">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798L4.555 5.168z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'

defineProps<{
  task: Task;
}>()

defineEmits<{
  (e: 'view', task: Task): void;
  (e: 'edit', task: Task): void;
  (e: 'delete', task: Task): void;
  (e: 'update-status', task: Task): void;
  (e: 'start-pomodoro', task: Task): void;
  (e: 'extend-due-date', task: Task): void;
}>()

function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'DONE') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)

  return dueDate < today
}
</script> 
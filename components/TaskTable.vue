<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          <th v-if="showStatus" scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
          <th v-if="showDueDate !== false" scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
          <th v-if="showCompletedAt" scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
          <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
          <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="task in tasks" :key="task.id" :class="getRowClass(task)">
          <td class="px-4 py-3 whitespace-nowrap">
            <div class="flex items-center">
              <div class="font-medium text-gray-900">{{ task.title }}</div>
              <svg v-if="task.repeatType" class="h-4 w-4 text-blue-500 ml-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Recurring task">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </td>
          <td v-if="showStatus" class="px-4 py-3 whitespace-nowrap">
            <span class="px-2 py-1 text-xs rounded-full" :class="getStatusClass(task)">
              {{ task.status.replace('_', ' ') }}
            </span>
          </td>
          <td class="px-4 py-3 whitespace-nowrap">
            <span class="px-2 py-1 text-xs rounded-full font-medium" :class="getPriorityClass(task)">
              {{ task.priority }}
            </span>
          </td>
          <td v-if="showDueDate !== false" class="px-4 py-3 whitespace-nowrap">
            <span class="text-xs px-2 py-1 rounded-full" :class="getDueDateClass(task)">
              {{ formatDueDate(task.dueDate) }}
            </span>
          </td>
          <td v-if="showCompletedAt" class="px-4 py-3 whitespace-nowrap">
            <span class="bg-green-100 text-green-800 px-2 py-1 text-xs rounded-full">
              {{ task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Unknown' }}
            </span>
          </td>
          <td class="px-4 py-3">
            <div class="text-sm text-gray-500 truncate max-w-xs">
              {{ task.notes.length > 50 ? task.notes.substring(0, 50) + '...' : task.notes }}
            </div>
          </td>
          <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex justify-end space-x-2">
              <button @click="$emit('view-task', task)" class="text-gray-400 hover:text-[var(--primary)]" title="View Task">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types/task'
import { isTaskDueToday, isTaskOverdue } from '~/utils/taskUtils';

const props = defineProps<{
  tasks: Task[];
  showStatus?: boolean;
  showCompletedAt?: boolean;
  showDueDate?: boolean;
}>();

defineEmits<{
  (e: 'view-task', task: Task): void;
}>();

function getRowClass(task: Task) {
  if (task.status === 'DONE') return 'bg-green-50 hover:bg-green-100';
  if (task.status === 'IN_PROGRESS') return 'bg-blue-50 hover:bg-blue-100';
  if (task.status === 'BACKLOG') return 'bg-orange-50 hover:bg-orange-100';
  return '';
}

function getStatusClass(task: Task) {
  if (task.status === 'BACKLOG') return 'bg-yellow-100 text-yellow-800';
  if (task.status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800';
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
  return '';
}

function formatDueDate(dateString: string | null): string {
  if (!dateString) return 'No due date';

  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dueDate.getTime() === today.getTime()) {
    return 'Due today';
  } else if (dueDate.getTime() === yesterday.getTime()) {
    return 'Due yesterday';
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return 'Due tomorrow';
  } else if (dueDate < today) {
    const diffTime = Math.abs(today.getTime() - dueDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays > 1 ? 's' : ''} overdue`;
  } else {
    return `Due on ${dueDate.toLocaleDateString()}`;
  }
}

</script> 
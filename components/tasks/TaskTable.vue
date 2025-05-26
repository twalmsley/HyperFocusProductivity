<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <div v-if="tasks.length === 0" class="p-6 text-gray-600">
      <p v-if="totalTasks === 0">Your tasks will appear here.</p>
      <p v-else>No tasks match your current filters.</p>
    </div>
    <table v-else class="w-full divide-y divide-gray-200 text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th @click="$emit('sort', 'title')" scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-1/4">
            Title
            <SortIndicator :active="sortColumn === 'title'" :direction="sortDirection" />
          </th>
          <th @click="$emit('sort', 'status')" scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px]">
            Status
            <SortIndicator :active="sortColumn === 'status'" :direction="sortDirection" />
          </th>
          <th @click="$emit('sort', 'priority')" scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px]">
            Priority
            <SortIndicator :active="sortColumn === 'priority'" :direction="sortDirection" />
          </th>
          <th @click="$emit('sort', 'estimatedPomodoros')" scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px] hidden sm:table-cell">
            Pomodoros
            <SortIndicator :active="sortColumn === 'estimatedPomodoros'" :direction="sortDirection" />
          </th>
          <th @click="$emit('sort', 'dueDate')" scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 w-[100px]">
            Due Date
            <SortIndicator :active="sortColumn === 'dueDate'" :direction="sortDirection" />
          </th>
          <th scope="col"
            class="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
            Notes</th>
          <th scope="col"
            class="px-2 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[120px]">
            Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="task in tasks" :key="task.id" :class="{
          'hover:bg-orange-100': task.status === 'BACKLOG',
          'hover:bg-blue-100': task.status === 'IN_PROGRESS',
          'hover:bg-green-100': task.status === 'DONE',
          'bg-orange-50': task.status === 'BACKLOG',
          'bg-blue-50': task.status === 'IN_PROGRESS',
          'bg-green-50': task.status === 'DONE',
          'bg-orange-100': isTaskOverdue(task) && task.status === 'BACKLOG',
          'bg-blue-100': isTaskOverdue(task) && task.status === 'IN_PROGRESS'
        }">
          <td class="px-2 py-2">
            <div class="text-xs font-medium text-gray-900 truncate">{{ task.title }}</div>
          </td>
          <td class="px-2 py-2">
            <span class="px-2 py-1 text-xs rounded-full" :class="{
              'bg-yellow-100 text-yellow-800': task.status === 'BACKLOG',
              'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS',
              'bg-green-100 text-green-800': task.status === 'DONE'
            }">
              {{ task.status.replace('_', ' ') }}
            </span>
          </td>
          <td class="px-2 py-2">
            <span class="px-2 py-1 text-xs rounded-full font-medium" :class="{
              'bg-red-100 text-red-800': task.priority === 'URGENT',
              'bg-orange-100 text-orange-800': task.priority === 'HIGH',
              'bg-yellow-100 text-yellow-800': task.priority === 'MEDIUM',
              'bg-green-100 text-green-800': task.priority === 'LOW'
            }">
              {{ task.priority }}
            </span>
          </td>
          <td class="px-2 py-2 hidden sm:table-cell">
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
            </div>
          </td>
          <td class="px-2 py-2">
            <div class="text-xs text-gray-500">
              {{ task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '-' }}
            </div>
          </td>
          <td class="px-2 py-2 hidden sm:table-cell">
            <div class="text-xs text-gray-500 truncate">
              {{ task.notes || '-' }}
            </div>
          </td>
          <td class="px-2 py-2 text-right text-xs font-medium">
            <div class="flex justify-end space-x-2">
              <button
                v-if="task.status === 'IN_PROGRESS' && (!task.estimatedPomodoros || task.completedPomodoros < task.estimatedPomodoros)"
                @click="$emit('start-pomodoro', task)" class="text-gray-400 hover:text-[var(--primary)]"
                title="Start Pomodoro Timer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <button @click="$emit('view', task)" class="text-gray-400 hover:text-[var(--primary)]"
                title="View Details">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <button @click="$emit('edit', task)" class="text-gray-400 hover:text-[var(--primary)]" title="Edit Task">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button @click="$emit('update-status', task)" class="text-gray-400 hover:text-[var(--primary)]"
                :title="task.status === 'BACKLOG' ? 'Start Task' : task.status === 'IN_PROGRESS' ? 'Complete Task' : 'Reopen Task'">
                <svg v-if="task.status === 'BACKLOG'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clip-rule="evenodd" />
                </svg>
                <svg v-else-if="task.status === 'IN_PROGRESS'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <button @click="$emit('delete', task)" class="text-gray-400 hover:text-red-600" title="Delete Task">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
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
import SortIndicator from '~/components/SortIndicator.vue'

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
}

defineProps<{
  tasks: Task[];
  totalTasks: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}>()

defineEmits<{
  (e: 'sort', column: string): void;
  (e: 'view', task: Task): void;
  (e: 'edit', task: Task): void;
  (e: 'delete', task: Task): void;
  (e: 'update-status', task: Task): void;
  (e: 'start-pomodoro', task: Task): void;
}>()

// Add isTaskOverdue helper function
function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'DONE') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)

  return dueDate < today
}
</script> 
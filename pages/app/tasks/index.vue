<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Tasks</h1>
        <NuxtLink 
          to="/app/tasks/new" 
          class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
        >
          New Task
        </NuxtLink>
      </div>
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="tasks.length === 0" class="p-6 text-gray-600">
          <p>Your tasks will appear here.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                @click="sortTasks('title')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Title
                <SortIndicator :active="sortColumn === 'title'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('status')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Status
                <SortIndicator :active="sortColumn === 'status'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('estimatedPomodoros')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Pomodoros
                <SortIndicator :active="sortColumn === 'estimatedPomodoros'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('createdAt')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Created
                <SortIndicator :active="sortColumn === 'createdAt'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('dueDate')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Due Date
                <SortIndicator :active="sortColumn === 'dueDate'" :direction="sortDirection" />
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in sortedTasks" :key="task.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': task.status === 'BACKLOG',
                    'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS',
                    'bg-green-100 text-green-800': task.status === 'DONE'
                  }"
                >
                  {{ task.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ task.estimatedPomodoros || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ new Date(task.createdAt).toLocaleDateString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '-' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 max-w-xs truncate">
                  {{ task.notes || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="updateTaskStatus(task)"
                  class="text-[var(--primary)] hover:text-[var(--button-hover)] mr-4"
                >
                  <span v-if="task.status === 'BACKLOG'">Start</span>
                  <span v-else-if="task.status === 'IN_PROGRESS'">Complete</span>
                  <span v-else>Reopen</span>
                </button>
                <button 
                  @click="confirmDelete(task)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Confirmation Dialog -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Task</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete the task "{{ taskToDelete?.title }}"?</p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="cancelDelete" 
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            No, Cancel
          </button>
          <button 
            @click="confirmDeleteTask" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SortIndicator from '~/components/SortIndicator.vue'

definePageMeta({
  middleware: ['auth']
})

const user = ref<{
  id: string;
  email: string;
  name: string | null;
  subscription: {
    type: string | null;
    status: string;
    freeTrialExpiresAt: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
} | null>(null)

type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE'

const tasks = ref<Array<{
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  estimatedPomodoros: number | null;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
  dueDate: string | null;
  position: number | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    proStatus: boolean;
  };
  sessions: Array<{
    id: string;
    userId: string;
    taskId: string | null;
    type: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
    startTime: string;
    endTime: string;
    durationMinutes: number;
    notes: string | null;
  }>;
}>>([])

// Sorting state
const sortColumn = ref<string>('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Variables for delete confirmation
const showDeleteConfirm = ref(false)
const taskToDelete = ref<typeof tasks.value[0] | null>(null)

// Computed property for sorted tasks
const sortedTasks = computed(() => {
  if (!tasks.value.length) return []
  
  const sorted = [...tasks.value].sort((a, b) => {
    let valA, valB
    
    // Handle different data types for sorting
    switch(sortColumn.value) {
      case 'title':
        valA = a.title?.toLowerCase() || ''
        valB = b.title?.toLowerCase() || ''
        break
      case 'status':
        // Custom order for status: BACKLOG, IN_PROGRESS, DONE
        const statusOrder = { 'BACKLOG': 1, 'IN_PROGRESS': 2, 'DONE': 3 }
        valA = statusOrder[a.status] || 0
        valB = statusOrder[b.status] || 0
        break
      case 'estimatedPomodoros':
        valA = a.estimatedPomodoros || 0
        valB = b.estimatedPomodoros || 0
        break
      case 'createdAt':
        valA = new Date(a.createdAt).getTime()
        valB = new Date(b.createdAt).getTime()
        break
      case 'dueDate':
        // Handle null due dates (sort them at the end)
        valA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        valB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        break
      default:
        valA = a[sortColumn.value as keyof typeof a] || ''
        valB = b[sortColumn.value as keyof typeof b] || ''
    }
    
    // Compare based on direction
    if (sortDirection.value === 'asc') {
      return valA > valB ? 1 : valA < valB ? -1 : 0
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0
    }
  })
  
  return sorted
})

// Sort tasks by column
function sortTasks(column: string) {
  // If clicking the same column, toggle direction
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Otherwise switch to the new column with default desc direction
    sortColumn.value = column
    sortDirection.value = 'desc'
  }
}

// Fetch user data and tasks on component mount
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/me')
    user.value = response
    
    if (user.value) {
      const tasksResponse = await $fetch('/api/tasks', {
        query: {
          userId: user.value.id
        }
      }) as typeof tasks.value
      tasks.value = tasksResponse
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
})

async function updateTaskStatus(task: typeof tasks.value[0]) {
  if (!user.value) return

  try {
    const newStatus = task.status === 'BACKLOG' 
      ? 'IN_PROGRESS' 
      : task.status === 'IN_PROGRESS' 
        ? 'DONE' 
        : 'BACKLOG'

    const updatedTask = await $fetch('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: newStatus,
        completedAt: newStatus === 'DONE' ? new Date().toISOString() : null
      }
    }) as typeof tasks.value[0]

    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Open delete confirmation dialog
function confirmDelete(task: typeof tasks.value[0]) {
  taskToDelete.value = task
  showDeleteConfirm.value = true
}

// Close delete confirmation dialog
function cancelDelete() {
  showDeleteConfirm.value = false
  taskToDelete.value = null
}

// Confirm and execute task deletion
async function confirmDeleteTask() {
  if (!user.value || !taskToDelete.value) return
  
  try {
    await $fetch('/api/tasks', {
      method: 'DELETE',
      query: {
        id: taskToDelete.value.id
      }
    })
    
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value?.id)
    
    // Close the dialog
    showDeleteConfirm.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}
</script> 
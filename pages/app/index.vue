<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Welcome to HyperFocusProductivity</h1>
      
      <!-- Quick Actions -->
      <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 class="text-lg font-semibold mb-3">Quick Actions</h2>
        <div class="flex flex-wrap gap-3">
          <NuxtLink 
            to="/app/tasks/new" 
            class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors"
          >
            Create New Task
          </NuxtLink>
          <NuxtLink 
            to="/app/tasks" 
            class="flex-1 min-w-[120px] border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2 rounded-lg text-center transition-colors"
          >
            View All Tasks
          </NuxtLink>
          <NuxtLink 
            to="/app/settings" 
            class="flex-1 min-w-[120px] border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2 rounded-lg text-center transition-colors"
          >
            Update Settings
          </NuxtLink>
        </div>
      </div>
      
      <div class="grid grid-cols-1 gap-6">
        <!-- Today's Tasks -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Tasks Due Today or Earlier</h2>
          <div v-if="isLoading" class="text-gray-600">Loading tasks...</div>
          <div v-else-if="dueTasks.length === 0" class="text-gray-600">No tasks due today or earlier</div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in dueTasks" :key="task.id"
                  :class="{
                    'bg-red-50': isOverdue(task),
                    'bg-amber-50': isDueToday(task)
                  }"
                >
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="font-medium text-gray-900">{{ task.title }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span 
                      class="px-2 py-1 text-xs rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-800': task.status === 'BACKLOG',
                        'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS'
                      }"
                    >
                      {{ task.status.replace('_', ' ') }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span 
                      class="text-xs px-2 py-1 rounded-full"
                      :class="{
                        'bg-red-100 text-red-800': isOverdue(task),
                        'bg-amber-100 text-amber-800': isDueToday(task)
                      }"
                    >
                      {{ formatDueDate(task.dueDate) }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ task.notes.length > 50 ? task.notes.substring(0, 50) + '...' : task.notes }}
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button 
                        @click="editTask(task)"
                        class="text-gray-400 hover:text-[var(--primary)]"
                        title="Edit Task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        @click="markInProgress(task)"
                        v-if="task.status === 'BACKLOG'"
                        class="text-gray-400 hover:text-blue-600"
                        title="Mark as In Progress"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        @click="markDone(task)"
                        class="text-gray-400 hover:text-green-600"
                        title="Mark as Done"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Recently Completed Tasks -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Recently Completed Tasks</h2>
        <div v-if="isLoading" class="text-gray-600">Loading tasks...</div>
        <div v-else-if="completedTasks.length === 0" class="text-gray-600 bg-white p-6 rounded-lg shadow-sm">No recently completed tasks</div>
        <div v-else class="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="task in completedTasks" :key="task.id" class="bg-green-50">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ task.title }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  {{ task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
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
                  <div class="flex justify-end">
                    <button 
                      @click="reopenTask(task)"
                      class="text-gray-400 hover:text-blue-600"
                      title="Reopen Task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
    
    <!-- Edit Task Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/95 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-medium text-gray-900">Edit Task</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              v-model="editingTask.title"
              type="text"
              required
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>
          
          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="notes"
              v-model="editingTask.notes"
              rows="3"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            ></textarea>
          </div>
          
          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              v-model="editingTask.status"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          
          <!-- Due Date -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              id="dueDate"
              v-model="editingTask.dueDate"
              type="date"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>
          
          <!-- Estimated Pomodoros -->
          <div>
            <label for="estimatedPomodoros" class="block text-sm font-medium text-gray-700 mb-1">Estimated Pomodoros</label>
            <input
              id="estimatedPomodoros"
              v-model.number="editingTask.estimatedPomodoros"
              type="number"
              min="0"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="closeEditModal"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveTask"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[var(--button-hover)]"
          >
            Save Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: ['auth']
})

interface Task {
  id: string;
  userId: string;
  title: string;
  notes: string;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
  estimatedPomodoros: number | null;
  completedPomodoros: number | null;
  position: number;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
}

const { user, isLoading } = useAuth()
const tasks = ref<Task[]>([])
const dueTasks = computed(() => {
  if (!tasks.value || tasks.value.length === 0) return []
  
  // Get current date
  const now = new Date()
  
  // Create end of today timestamp for comparison
  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)
  
  const filteredTasks = tasks.value
    .filter(task => {
      // Filter for incomplete tasks (BACKLOG or IN_PROGRESS)
      if (task.status === 'DONE') {
        return false
      }
      
      // Filter for tasks with due date on or before end of today
      if (!task.dueDate) {
        return false
      }
      
      const dueDate = new Date(task.dueDate)
      const isDueToday = dueDate <= endOfToday
      
      return isDueToday
    })
    // Sort by due date (ascending)
    .sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
    
  
  return filteredTasks
})

// Format due date with relative terms
function formatDueDate(dateString: string | null): string {
  if (!dateString) return 'No due date'
  
  const dueDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (dueDate.getTime() === today.getTime()) {
    return 'Due today'
  } else if (dueDate.getTime() === yesterday.getTime()) {
    return 'Due yesterday'
  } else if (dueDate.getTime() === tomorrow.getTime()) {
    return 'Due tomorrow'
  } else if (dueDate < today) {
    const diffTime = Math.abs(today.getTime() - dueDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays > 1 ? 's' : ''} overdue`
  } else {
    return `Due on ${dueDate.toLocaleDateString()}`
  }
}

// Check if task is overdue
function isOverdue(task: Task): boolean {
  if (!task.dueDate) return false
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Start of today
  return dueDate < today
}

// Check if task is due today
function isDueToday(task: Task): boolean {
  if (!task.dueDate) return false
  const dueDate = new Date(task.dueDate)
  const today = new Date()
  
  // Set today to start of day
  const startOfDay = new Date(today)
  startOfDay.setHours(0, 0, 0, 0)
  
  // Set today to end of day
  const endOfDay = new Date(today)
  endOfDay.setHours(23, 59, 59, 999)
  
  // Check if dueDate is between start and end of today
  return dueDate >= startOfDay && dueDate <= endOfDay
}

// Mark task as in progress
async function markInProgress(task: Task) {
  try {
    const updatedTask = await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: 'IN_PROGRESS'
      }
    })
    
    // Refresh all tasks to ensure computed properties update correctly
    await fetchTasks()
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Mark task as done
async function markDone(task: Task) {
  try {
    const updatedTask = await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: 'DONE',
        completedAt: new Date().toISOString()
      }
    })
    
    // Refresh all tasks to ensure computed properties update correctly
    await fetchTasks()
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Fetch tasks on component mount
async function fetchTasks() {
  if (!user.value) {
    console.error('No user available for fetching tasks')
    return
  }
  
  try {
    const response = await $fetch<Task[]>(`/api/tasks?userId=${user.value.id}`)
    
    // Sanitize and validate tasks
    const sanitizedTasks = response.map(task => {
      // Ensure task has all required properties
      if (!task.id || !task.title) {
        console.error('Task missing required properties:', task)
      }
      
      // Ensure status is valid
      if (!['BACKLOG', 'IN_PROGRESS', 'DONE'].includes(task.status)) {
        console.error(`Task ${task.id} has invalid status: ${task.status}`)
        // Default to BACKLOG if invalid
        task.status = 'BACKLOG'
      }
      
      // Make sure notes exists
      if (!task.notes) {
        task.notes = ''
      }
      
      return task
    })
    
    tasks.value = sanitizedTasks
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  }
}

// Redirect to login if not authenticated
watch([isLoading, user], ([loading, currentUser]) => {
  if (!loading && !currentUser) {
    navigateTo('/login')
  } else if (!loading && currentUser) {
    fetchTasks()
  }
})

// Fetch templates on component mount
onMounted(() => {
  if (user.value) {
    fetchTasks()
  }
})

// Refresh tasks
function refreshTasks() {
  fetchTasks()
}

// Add computed property for completed tasks
const completedTasks = computed(() => {
  if (!tasks.value || tasks.value.length === 0) return []
  
  return tasks.value
    .filter(task => task.status === 'DONE' && task.completedAt)
    // Sort by completion date (most recent first)
    .sort((a, b) => {
      if (!a.completedAt) return 1
      if (!b.completedAt) return -1
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    })
    // Limit to 15 most recent
    .slice(0, 15)
})

// Reopen a completed task
async function reopenTask(task: Task) {
  try {
    const updatedTask = await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: 'IN_PROGRESS',
        completedAt: null
      }
    })
    
    // Refresh all tasks to ensure computed properties update correctly
    await fetchTasks()
  } catch (error) {
    console.error('Failed to reopen task:', error)
  }
}

// Add state for edit modal
const showEditModal = ref(false)
const editingTask = ref<Partial<Task>>({})

// Function to open edit modal
function editTask(task: Task) {
  // Format the date for the input field (YYYY-MM-DD)
  const formattedTask = {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : null
  }
  editingTask.value = formattedTask
  showEditModal.value = true
}

// Function to close edit modal
function closeEditModal() {
  showEditModal.value = false
  editingTask.value = {}
}

// Function to save edited task
async function saveTask() {
  if (!user.value || !editingTask.value.id) return

  try {
    // Format the date for the API (ISO string)
    const taskToUpdate = {
      ...editingTask.value,
      dueDate: editingTask.value.dueDate ? new Date(editingTask.value.dueDate + 'T00:00:00').toISOString() : null
    }

    await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: taskToUpdate.id,
        title: taskToUpdate.title,
        notes: taskToUpdate.notes,
        status: taskToUpdate.status,
        estimatedPomodoros: taskToUpdate.estimatedPomodoros,
        dueDate: taskToUpdate.dueDate,
        completedAt: taskToUpdate.status === 'DONE' ? new Date().toISOString() : null
      }
    })

    // Refresh tasks and close modal
    await fetchTasks()
    closeEditModal()
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}
</script> 
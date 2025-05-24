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
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                  <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="task in dueTasks" :key="task.id"
                  :class="{
                    'bg-orange-50 hover:bg-orange-100': task.status === 'BACKLOG',
                    'bg-blue-50 hover:bg-blue-100': task.status === 'IN_PROGRESS',
                    'bg-green-50 hover:bg-green-100': task.status === 'DONE',
                    'bg-orange-100': isOverdue(task) && task.status === 'BACKLOG',
                    'bg-blue-100': isOverdue(task) && task.status === 'IN_PROGRESS'
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
                      class="px-2 py-1 text-xs rounded-full font-medium"
                      :class="{
                        'bg-red-100 text-red-800': task.priority === 'URGENT',
                        'bg-orange-100 text-orange-800': task.priority === 'HIGH',
                        'bg-yellow-100 text-yellow-800': task.priority === 'MEDIUM',
                        'bg-green-100 text-green-800': task.priority === 'LOW'
                      }"
                    >
                      {{ task.priority }}
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
                        @click="viewTask(task)"
                        class="text-gray-400 hover:text-[var(--primary)]"
                        title="View Task"
                      >
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
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="task in completedTasks" :key="task.id" 
                class="bg-green-50 hover:bg-green-100"
              >
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ task.title }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span 
                    class="px-2 py-1 text-xs rounded-full font-medium"
                    :class="{
                      'bg-red-100 text-red-800': task.priority === 'URGENT',
                      'bg-orange-100 text-orange-800': task.priority === 'HIGH',
                      'bg-yellow-100 text-yellow-800': task.priority === 'MEDIUM',
                      'bg-green-100 text-green-800': task.priority === 'LOW'
                    }"
                  >
                    {{ task.priority }}
                  </span>
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
                        @click="viewTask(task)"
                        class="text-gray-400 hover:text-[var(--primary)]"
                        title="View Task"
                      >
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
      </div>
    </main>
    
    <!-- View Task Modal -->
    <div v-if="showViewModal" class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/95 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-medium text-gray-900">View Task</h3>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
              {{ viewingTask.title }}
            </div>
          </div>
          
          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">
              {{ viewingTask.notes }}
            </div>
          </div>
          
          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
              {{ viewingTask.status ? viewingTask.status.replace('_', ' ') : 'Not set' }}
            </div>
          </div>
          
          <!-- Priority -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
              {{ viewingTask.priority }}
            </div>
          </div>
          
          <!-- Due Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
              {{ viewingTask.dueDate ? new Date(viewingTask.dueDate).toLocaleDateString() : 'No due date' }}
            </div>
          </div>
          
          <!-- Estimated Pomodoros -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Pomodoros</label>
            <div class="w-full p-2 bg-gray-50 rounded-md border border-gray-200">
              {{ viewingTask.estimatedPomodoros || 'Not set' }}
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button
            @click="closeViewModal"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[var(--button-hover)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

definePageMeta({
  middleware: ['auth', 'subscription']
})

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

const tasks = ref<Task[]>([])
const dueTasks = computed(() => {
  if (!tasks.value || tasks.value.length === 0) return []
  
  // Get current date
  const now = new Date()
  
  // Create end of today timestamp for comparison
  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)
  
  return tasks.value
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
      return dueDate <= endOfToday
    })
    // Sort by due date (ascending)
    .sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
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
    await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: 'IN_PROGRESS'
      }
    })
    
    // Refresh tasks to update both lists
    await fetchTasks()
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Mark task as done
async function markDone(task: Task) {
  try {
    const completedAt = new Date().toISOString()
    await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: 'DONE',
        completedAt
      }
    })
    
    // Update the task in the local state immediately
    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = {
        ...task,
        status: 'DONE',
        completedAt
      }
    }
    
    // Then refresh all tasks to ensure everything is in sync
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
      
      // Ensure priority is valid
      if (!['URGENT', 'HIGH', 'MEDIUM', 'LOW'].includes(task.priority)) {
        console.error(`Task ${task.id} has invalid priority: ${task.priority}`)
        // Default to MEDIUM if invalid
        task.priority = 'MEDIUM'
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
    .filter(task => task.status === 'DONE')
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
    await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: 'IN_PROGRESS',
        completedAt: null
      }
    })
    
    // Refresh tasks to update both lists
    await fetchTasks()
  } catch (error) {
    console.error('Failed to reopen task:', error)
  }
}

// Add state for view modal
const showViewModal = ref(false)
const viewingTask = ref<Partial<Task>>({})

// Function to open view modal
function viewTask(task: Task) {
  viewingTask.value = task
  showViewModal.value = true
}

// Function to close view modal
function closeViewModal() {
  showViewModal.value = false
  viewingTask.value = {}
}
</script> 
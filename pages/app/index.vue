<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Welcome to HyperFocusProductivity</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Today's Tasks -->
        <div class="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 class="text-xl font-semibold mb-4">Tasks Due Today or Overdue</h2>
          <div v-if="isLoading" class="text-gray-600">Loading tasks...</div>
          <div v-else-if="dueTasks.length === 0" class="text-gray-600">No tasks due today or overdue</div>
          <ul v-else class="space-y-2">
            <li v-for="task in dueTasks" :key="task.id" 
              class="p-3 rounded-lg border" 
              :class="{
                'border-red-200 bg-red-50': isOverdue(task),
                'border-amber-200 bg-amber-50': isDueToday(task)
              }"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-medium">{{ task.title }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ task.notes.length > 50 ? task.notes.substring(0, 50) + '...' : task.notes }}</p>
                  <div class="flex items-center mt-2 space-x-2">
                    <span 
                      class="px-2 py-0.5 text-xs rounded-full"
                      :class="{
                        'bg-yellow-100 text-yellow-800': task.status === 'BACKLOG',
                        'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS'
                      }"
                    >
                      {{ task.status.replace('_', ' ') }}
                    </span>
                    <span 
                      class="text-xs px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-red-100 text-red-800': isOverdue(task),
                        'bg-amber-100 text-amber-800': isDueToday(task)
                      }"
                    >
                      {{ formatDueDate(task.dueDate) }}
                    </span>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <NuxtLink 
                    :to="`/app/tasks?edit=${task.id}`"
                    class="text-gray-400 hover:text-[var(--primary)]"
                    title="Edit Task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </NuxtLink>
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
              </div>
            </li>
          </ul>
        </div>
        
        <!-- Quick Actions -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <NuxtLink 
              to="/app/tasks/new" 
              class="block w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors"
            >
              Create New Task
            </NuxtLink>
            <NuxtLink 
              to="/app/tasks" 
              class="block w-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2 rounded-lg text-center transition-colors"
            >
              View All Tasks
            </NuxtLink>
            <NuxtLink 
              to="/app/settings" 
              class="block w-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white px-4 py-2 rounded-lg text-center transition-colors"
            >
              Update Settings
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>
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
  
  var today = new Date()
  today.setHours(0, 0, 0, 0)
  today = new Date(today.getTime() + 1000 * 60 * 60 * 24)
  
  return tasks.value
    .filter(task => {
      // Filter for incomplete tasks (BACKLOG or IN_PROGRESS)
      if (task.status === 'DONE') return false
      
      // Filter for tasks with due date on or before today
      if (!task.dueDate) return false
      const dueDate = new Date(task.dueDate)
      dueDate.setHours(0, 0, 0, 0)

      return dueDate.getTime() <= today.getTime()
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
  dueDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate < today
}

// Check if task is due today
function isDueToday(task: Task): boolean {
  if (!task.dueDate) return false
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate.getTime() === today.getTime()
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
    
    // Update task in the local state
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
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
    
    // Update task in the local state
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Fetch tasks on component mount
async function fetchTasks() {
  if (!user.value) return
  
  try {
    tasks.value = await $fetch<Task[]>(`/api/tasks?userId=${user.value.id}`)
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
</script> 
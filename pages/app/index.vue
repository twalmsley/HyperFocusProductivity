<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Welcome to HyperFocusProductivity</h1>
      <!-- Subscription Section -->
      <div v-if="userSession?.blocked">
        <h2 class="text-xl font-semibold mb-4">Subscription no longer active, please update your payment method</h2>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-gray-600 mb-4">Manage your subscription and view your current plan details.</p>
          <NuxtLink to="/app/subscription"
            class="inline-block px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]">
            My Subscription
          </NuxtLink>
        </div>
      </div>

      <div v-else>
        <QuickActions />
        <div class="grid grid-cols-1 gap-6">
          <TasksDueToday :tasks="dueTasks" :is-loading="isLoading" @view-task="viewTask" />
        </div>
        <RecentlyCompletedTasks :tasks="completedTasks" :is-loading="isLoading" @view-task="viewTask" />
      </div>
    </main>

    <ViewTaskModal :show="showViewModal" :task="viewingTask" @close="closeViewModal" />
  </div>
</template>

<script setup lang="ts">
const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()

const userSession = await getSession()
const user = userSession?.user;

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

const isLoading = ref(false)
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

// Fetch tasks on component mount
async function fetchTasks() {
  if (!user) {
    console.error('No user available for fetching tasks')
    return
  }

  try {
    const response = await $fetch<Task[]>(`/api/tasks?userId=${user?.id}`)

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

// Fetch tasks on component mount
onMounted(() => {
  if (user) {
    fetchTasks()
  }
})

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
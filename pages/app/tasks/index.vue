<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
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
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">Tasks</h1>
          <NuxtLink to="/app/tasks/new"
            class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors">
            New Task
          </NuxtLink>
        </div>

        <!-- Filter controls -->
        <TaskFilters v-model:filters="filters" />

        <!-- Sort controls -->
        <TaskSortControls 
          :sort-column="sortColumn"
          :sort-direction="sortDirection"
          :show-due-date="true"
          @sort="sortTasks"
        />

        <!-- Task cards -->
        <div v-if="tasks.length === 0" class="bg-white rounded-lg shadow-sm p-6 text-gray-600">
          <p>Your tasks will appear here.</p>
        </div>
        <div v-else class="space-y-4">
          <TaskCard
            v-for="task in paginatedTasks"
            :key="task.id"
            :task="task"
            @view="viewTask"
            @edit="editTask"
            @delete="confirmDelete"
            @update-status="updateTaskStatus"
            @start-pomodoro="startPomodoro"
            @extend-due-date="extendDueDate"
          />
        </div>

        <!-- Task Stats -->
        <TaskStats :tasks="filteredTasks" :filter="filters.dueDate || 'all'" />

        <!-- Pagination -->
        <TaskPagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="filteredTasks.length" />

        <!-- Edit Task Modal -->
        <TaskEditModal v-if="showEditModal" :show="showEditModal" :task="editingTask as Task" @close="closeEditModal"
          @save="saveTask" />

        <!-- View Task Modal -->
        <TaskViewModal v-if="showViewModal" :show="showViewModal" :task="selectedTask" @close="closeViewModal" />

        <!-- Delete Confirmation Modal -->
        <TaskDeleteModal v-if="showDeleteConfirm" :show="showDeleteConfirm" :task="taskToDelete" @cancel="cancelDelete"
          @confirm="confirmDeleteTask" />

        <!-- Pomodoro Timer Modal -->
        <PomodoroTimer v-if="showPomodoroTimer" :total-rounds="selectedTask?.estimatedPomodoros || 1"
          :focus-duration="userSettings?.focusDuration || 25" :short-break-duration="userSettings?.shortBreakDuration || 5"
          :long-break-duration="userSettings?.longBreakDuration || 15"
          :long-break-interval="userSettings?.longBreakInterval || 4"
          :completed-pomodoros="selectedTask?.completedPomodoros || 0" @close="closePomodoroTimer"
          @update:completed-pomodoros="updateCompletedPomodoros" />

        <!-- Success Dialog -->
        <div v-if="showSuccessDialog" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-white/90 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Success</h3>
            <p class="text-gray-600 mb-4">{{ successMessage }}</p>
            <div class="flex justify-end">
              <button
                @click="showSuccessDialog = false"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--button-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { startOfTomorrow, addWeeks, addMonths, parseISO, isBefore, isSameDay, isWithinInterval, startOfToday } from 'date-fns'
import PomodoroTimer from '~/components/PomodoroTimer.vue'
import TaskFilters from '~/components/tasks/TaskFilters.vue'
import TaskCard from '~/components/tasks/TaskCard.vue'
import TaskSortControls from '~/components/tasks/TaskSortControls.vue'
import TaskPagination from '~/components/tasks/TaskPagination.vue'
import TaskEditModal from '~/components/tasks/TaskEditModal.vue'
import TaskViewModal from '~/components/tasks/TaskViewModal.vue'
import TaskDeleteModal from '~/components/tasks/TaskDeleteModal.vue'
import TaskStats from '~/components/tasks/TaskStats.vue'

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

interface ExtendedSession {
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
  blocked?: boolean;
}

interface ExtendedUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

const userSession = await getSession() as ExtendedSession
const user = userSession?.user as ExtendedUser | undefined
const router = useRouter()

type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE'

import type { Task } from '~/types/task'

const tasks = ref<Task[]>([])

// Sorting state
const sortColumn = ref<string>('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Filtering state
const filters = ref({
  search: '',
  status: '',
  priority: '',
  dueDate: ''
})

// Pagination state
const currentPage = ref(1)
const pageSize = ref(10) // Default to 10

// Load page size from localStorage on mount
onMounted(() => {
  try {
    const saved = localStorage.getItem('taskPageSize')
    if (saved) {
      const parsed = parseInt(saved, 10)
      if (!isNaN(parsed)) {
        pageSize.value = parsed
      }
    }
  } catch (error) {
    console.error('Error loading page size from localStorage:', error)
  }
})

// Watch for changes that should reset pagination
watch([filters, sortColumn, sortDirection], () => {
  currentPage.value = 1
})

// Watch for page size changes to save to localStorage
watch(pageSize, (newSize) => {
  try {
    localStorage.setItem('taskPageSize', newSize.toString())
  } catch (error) {
    console.error('Error saving page size to localStorage:', error)
  }
})

// Computed property for filtered tasks
const filteredTasks = computed(() => {
  if (!tasks.value.length) return []

  // Apply filters
  return tasks.value.filter(task => {
    // Filter by search text (title and notes)
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      const titleMatch = task.title.toLowerCase().includes(searchTerm)
      const notesMatch = task.notes ? task.notes.toLowerCase().includes(searchTerm) : false
      if (!titleMatch && !notesMatch) return false
    }

    // Filter by status
    if (filters.value.status && task.status !== filters.value.status) {
      return false
    }

    // Filter by priority
    if (filters.value.priority && task.priority !== filters.value.priority) {
      return false
    }

    // Filter by due date
    if (filters.value.dueDate) {
      // Exclude DONE tasks when filtering by due date
      if (task.status === 'DONE') return false

      const today = startOfToday()
      const oneWeekFromNow = addWeeks(today, 1)
      const oneMonthFromNow = addMonths(today, 1)

      // Handle no due date case first
      if (filters.value.dueDate === 'none') {
        if (task.dueDate !== null) return false
      } else if (task.dueDate === null) {
        return false
      } else {
        const taskDueDate = parseISO(task.dueDate)

        switch (filters.value.dueDate) {
          case 'overdue':
            if (!isBefore(taskDueDate, today)) return false
            break
          case 'today':
            if (!isSameDay(taskDueDate, today)) return false
            break
          case 'week':
            if (!isWithinInterval(taskDueDate, { start: today, end: oneWeekFromNow })) return false
            break
          case 'month':
            if (!isWithinInterval(taskDueDate, { start: today, end: oneMonthFromNow })) return false
            break
        }
      }
    }

    return true
  })
})

// Computed property for sorted tasks
const sortedTasks = computed(() => {
  if (!filteredTasks.value.length) return []

  const sorted = [...filteredTasks.value].sort((a, b) => {
    let valA, valB

    // Handle different data types for sorting
    switch (sortColumn.value) {
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
      case 'priority':
        // Custom order for priority: URGENT, HIGH, MEDIUM, LOW
        const priorityOrder = { 'URGENT': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4 }
        valA = priorityOrder[a.priority] || 0
        valB = priorityOrder[b.priority] || 0
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

// Computed property for paginated tasks
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedTasks.value.slice(start, end)
})

// Variables for delete confirmation
const showDeleteConfirm = ref(false)
const taskToDelete = ref<Task | null>(null)

// View task modal state
const showViewModal = ref(false)
const selectedTask = ref<Task | null>(null)

// Edit task modal state
const showEditModal = ref(false)
const editingTask = ref<Partial<Task>>({})

// Pomodoro timer state
const showPomodoroTimer = ref(false)
const userSettings = ref<{
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  userId?: string;
  theme?: string;
} | null>(null)

// Success dialog state
const showSuccessDialog = ref(false)
const successMessage = ref('')

// Sort tasks by column
function sortTasks(column: string) {
  // If clicking the same column, toggle direction
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Otherwise switch to the new column with default desc direction
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

async function updateTaskStatus(task: Task) {
  if (!user) return

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
    }) as Task

    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }

    // If this was a repeating task that was completed, refresh the task list to show the new repeat task
    if (newStatus === 'DONE' && task.repeatType) {
      await fetchTasks()
    }
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Open delete confirmation dialog
function confirmDelete(task: Task) {
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
  if (!user || !taskToDelete.value) return

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

// Fetch tasks
async function fetchTasks() {
  if (!user) return

  try {
    const response = await $fetch<Task[]>(`/api/tasks?userId=${user.id}`)
    tasks.value = response
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  }
}

function viewTask(task: Task) {
  selectedTask.value = task
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  selectedTask.value = null
}

function editTask(task: Task) {
  // Format the date for the input field (YYYY-MM-DD)
  const formattedTask = {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().substring(0, 10) : null
  }
  editingTask.value = formattedTask
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingTask.value = {}
}

async function saveTask(task: Partial<Task> & { repeatSchedule?: any }) {
  if (!user || !task.id) return

  try {
    // Format the date for the API (ISO string)
    const taskToUpdate = {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null
    } as Task

    const updateBody: any = {
      id: taskToUpdate.id,
      title: taskToUpdate.title,
      notes: taskToUpdate.notes,
      status: taskToUpdate.status,
      priority: taskToUpdate.priority,
      estimatedPomodoros: taskToUpdate.estimatedPomodoros,
      dueDate: taskToUpdate.dueDate,
      completedAt: taskToUpdate.status === 'DONE' ? new Date().toISOString() : null
    }

    // Add repeat schedule fields if present
    if (task.repeatSchedule) {
      const schedule = task.repeatSchedule
      updateBody.repeatType = schedule.repeatType
      updateBody.repeatInterval = schedule.repeatInterval
      updateBody.repeatDays = schedule.repeatDays
      updateBody.repeatMonth = schedule.repeatMonth
      updateBody.repeatDay = schedule.repeatDay
      updateBody.repeatWeekOfMonth = schedule.repeatWeekOfMonth
      updateBody.repeatDayOfWeek = schedule.repeatDayOfWeek
    }

    const updatedTask = await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: updateBody
    })

    // Update the task in the local state
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }

    closeEditModal()
    
    // Refresh tasks to get any newly created repeat tasks
    if (task.repeatSchedule && updatedTask.status === 'DONE') {
      await fetchTasks()
    }
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Fetch user settings
async function fetchUserSettings() {
  if (!user) return

  try {
    const response = await $fetch('/api/settings')
    userSettings.value = response || {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4
    }
  } catch (error) {
    console.error('Failed to fetch user settings:', error)
  }
}

function startPomodoro(task: Task) {
  selectedTask.value = task
  showPomodoroTimer.value = true
}

function closePomodoroTimer() {
  showPomodoroTimer.value = false
  selectedTask.value = null
}

async function updateCompletedPomodoros(value: number) {
  if (!selectedTask.value) return

  try {
    const updatedTask = await $fetch('/api/tasks', {
      method: 'PATCH',
      body: {
        id: selectedTask.value.id,
        completedPomodoros: value
      }
    }) as Task

    // Update the task in the local state
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
    selectedTask.value = updatedTask
  } catch (error) {
    console.error('Failed to update completed pomodoros:', error)
  }
}

// Add the extendDueDate function before the onMounted hook
async function extendDueDate(task: Task) {
  if (!user || !task.dueDate) return

  try {
    // Add one day to the current due date
    const currentDueDate = new Date(task.dueDate)
    const newDueDate = new Date(currentDueDate)
    newDueDate.setDate(newDueDate.getDate() + 1)

    const updatedTask = await $fetch('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        dueDate: newDueDate.toISOString()
      }
    }) as Task

    // Update the task in the local state
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }

    // Show success message
    successMessage.value = `Task "${task.title}" moved to ${newDueDate.toLocaleDateString()}`
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Failed to extend due date:', error)
  }
}

// Fetch user settings when component mounts
onMounted(async () => {
  fetchUserSettings()
  await fetchTasks()
})
</script>
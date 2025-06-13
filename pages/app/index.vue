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
        <QuickActions @open-journal-dialog="openCreateModal" />
        <div class="grid grid-cols-1 gap-6">
          <TasksDueToday :tasks="dueTasks" :is-loading="isLoading" @view-task="viewTask" />
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold">Recent Journal Entries</h2>
              <NuxtLink to="/app/journal" class="text-[var(--primary)] hover:text-[var(--button-hover)]">
                View All
              </NuxtLink>
            </div>
            <div v-if="isLoadingJournal" class="text-center py-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
            </div>
            <div v-else-if="recentJournalEntries.length === 0" class="text-center text-gray-500 py-4">
              No entries yet. Start your journaling journey today!
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mood</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="entry in recentJournalEntries" :key="entry.id" 
                      class="hover:bg-gray-50 cursor-pointer transition-colors"
                      @click="viewJournalEntry(entry)">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ entry.title }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {{ entry.type }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="entry.mood" class="text-xl" :title="entry.mood">
                        {{ getMoodEmoji(entry.mood) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-600 line-clamp-2">
                        {{ entry.content }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(entry.createdAt) }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex flex-wrap gap-1">
                        <span v-for="tag in entry.tags" :key="tag"
                          class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {{ tag }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <RecentlyCompletedTasks :tasks="completedTasks" :is-loading="isLoading" @view-task="viewTask" />
      </div>
    </main>

    <ViewTaskModal :show="showViewModal" :task="viewingTask" @close="closeViewModal" />

    <!-- Create Journal Entry Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">New Journal Entry</h2>
          <button @click="closeCreateModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="createEntry" class="space-y-4">
          <div>
            <label for="create-title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="create-title"
              v-model="newEntry.title"
              type="text"
              maxlength="200"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label for="create-type" class="block text-sm font-medium text-gray-700">Entry Type</label>
            <select
              id="create-type"
              v-model="newEntry.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            >
              <option value="DAILY">Daily Journal</option>
              <option value="FREEFORM">Free-form Entry</option>
              <option value="REVIEW">Review Entry</option>
            </select>
          </div>
          <div>
            <label for="create-mood" class="block text-sm font-medium text-gray-700">Mood</label>
            <select
              id="create-mood"
              v-model="newEntry.mood"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            >
              <option value="">Select a mood...</option>
              <option value="HAPPY">😊 Happy</option>
              <option value="SAD">😢 Sad</option>
              <option value="NEUTRAL">😐 Neutral</option>
              <option value="ANGRY">😠 Angry</option>
              <option value="EXCITED">🤩 Excited</option>
            </select>
          </div>
          <div>
            <label for="create-content" class="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              id="create-content"
              v-model="newEntry.content"
              rows="6"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            ></textarea>
          </div>
          <div>
            <label for="create-tags" class="block text-sm font-medium text-gray-700">Tags</label>
            <div class="mt-1 flex flex-wrap gap-2">
              <span v-for="tag in newEntry.tags" :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center">
                {{ tag }}
                <button type="button" @click="removeNewTag(tag)" class="ml-1 text-gray-500 hover:text-gray-700">
                  ×
                </button>
              </span>
              <input
                id="create-tags"
                v-model="newTagInput"
                type="text"
                placeholder="Add tags..."
                @keydown.enter.prevent="addNewTag"
                class="flex-1 min-w-[120px] rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeCreateModal"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Creating...' : 'Create Entry' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { startOfTomorrow, addWeeks, addMonths, parseISO, isBefore, isSameDay, isWithinInterval, startOfToday } from 'date-fns'
import PomodoroTimer from '~/components/PomodoroTimer.vue'
import TaskFilters from '~/components/tasks/TaskFilters.vue'
import TaskTable from '~/components/tasks/TaskTable.vue'
import TaskPagination from '~/components/tasks/TaskPagination.vue'
import TaskEditModal from '~/components/tasks/TaskEditModal.vue'
import TaskViewModal from '~/components/tasks/TaskViewModal.vue'
import TaskDeleteModal from '~/components/tasks/TaskDeleteModal.vue'
import TaskStats from '~/components/tasks/TaskStats.vue'
import RecentJournalEntries from '~/components/journal/RecentJournalEntries.vue'
import type { Task } from '~/types/task'

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

interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'DAILY' | 'FREEFORM' | 'REVIEW';
  date: string;
  mood: 'HAPPY' | 'SAD' | 'NEUTRAL' | 'ANGRY' | 'EXCITED' | null;
  tags: string[];
  templateUsed: string | null;
  createdAt: string;
  updatedAt: string;
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

// Add journal entries state
const isLoadingJournal = ref(false)
const journalEntries = ref<JournalEntry[]>([])

// Add computed property for recent journal entries
const recentJournalEntries = computed(() => {
  if (!journalEntries.value || journalEntries.value.length === 0) return []
  return journalEntries.value.slice(0, 3)
})

// Fetch journal entries
async function fetchJournalEntries() {
  if (!user?.id) {
    console.error('No user available for fetching journal entries')
    return
  }

  try {
    isLoadingJournal.value = true
    const response = await $fetch<JournalEntry[]>('/api/journal')
    journalEntries.value = response.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error('Failed to fetch journal entries:', error)
  } finally {
    isLoadingJournal.value = false
  }
}

// View a journal entry
function viewJournalEntry(entry: JournalEntry) {
  navigateTo(`/app/journal/${entry.id}`)
}

// Fetch tasks and journal entries on component mount
onMounted(() => {
  if (user?.id) {
    fetchTasks()
    fetchJournalEntries()
  }
})

// Add getMoodEmoji function
const getMoodEmoji = (mood: string | null) => {
  const emojis: Record<string, string> = {
    'HAPPY': '😊',
    'SAD': '😢',
    'NEUTRAL': '😐',
    'ANGRY': '😠',
    'EXCITED': '🤩'
  }
  return mood ? emojis[mood] || '❓' : null
}

// Update formatDate function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Journal entry create modal state and logic
const showCreateModal = ref(false)
const newEntry = ref<Partial<JournalEntry>>({
  title: '',
  content: '',
  type: 'FREEFORM',
  date: new Date().toISOString().split('T')[0],
  tags: [],
})
const newTagInput = ref('')
const isSaving = ref(false)

function openCreateModal() {
  newEntry.value = {
    title: '',
    content: '',
    type: 'FREEFORM',
    date: new Date().toISOString().split('T')[0],
    tags: [],
  }
  newTagInput.value = ''
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
  newEntry.value = {
    title: '',
    content: '',
    type: 'FREEFORM',
    date: new Date().toISOString().split('T')[0],
    tags: [],
  }
  newTagInput.value = ''
}

function addNewTag() {
  if (!newTagInput.value.trim()) return
  const tags = newTagInput.value
    .split(/[,;\s]+/)
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
  tags.forEach(tag => {
    if (!newEntry.value.tags?.includes(tag)) {
      newEntry.value.tags?.push(tag)
    }
  })
  newTagInput.value = ''
}

function removeNewTag(tag: string) {
  newEntry.value.tags = newEntry.value.tags?.filter(t => t !== tag)
}

async function createEntry() {
  try {
    isSaving.value = true
    // Parse any remaining tags in the input field
    if (newTagInput.value.trim()) {
      const remainingTags = newTagInput.value
        .split(/[,;\s]+/)
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0)
      remainingTags.forEach(tag => {
        if (!newEntry.value.tags?.includes(tag)) {
          newEntry.value.tags?.push(tag)
        }
      })
      newTagInput.value = ''
    }
    const response = await $fetch('/api/journal', {
      method: 'POST',
      body: {
        title: newEntry.value.title,
        content: newEntry.value.content,
        type: newEntry.value.type,
        date: newEntry.value.date,
        mood: newEntry.value.mood,
        tags: newEntry.value.tags,
        templateUsed: newEntry.value.templateUsed
      }
    })
    // Refresh the journal entries list
    await fetchJournalEntries()
    closeCreateModal()
  } catch (error) {
    console.error('Error creating journal entry:', error)
  } finally {
    isSaving.value = false
  }
}
</script>
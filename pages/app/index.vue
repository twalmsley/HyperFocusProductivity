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
                      <div class="text-sm text-gray-600 line-clamp-2 prose prose-sm max-w-none" v-html="renderMarkdown(entry.content)">
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
    <JournalEntryModal
      :show="journalModal.showModal.value"
      :is-saving="journalModal.isSaving.value"
      :show-markdown-preview="true"
      :max-content-length="10000"
      @close="journalModal.closeModal"
      @submit="handleJournalSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { startOfTomorrow, addWeeks, addMonths, parseISO, isBefore, isSameDay, isWithinInterval, startOfToday } from 'date-fns'
import { marked } from 'marked'
import PomodoroTimer from '~/components/PomodoroTimer.vue'
import TaskFilters from '~/components/tasks/TaskFilters.vue'
import TaskTable from '~/components/tasks/TaskTable.vue'
import TaskPagination from '~/components/tasks/TaskPagination.vue'
import TaskEditModal from '~/components/tasks/TaskEditModal.vue'
import TaskViewModal from '~/components/tasks/TaskViewModal.vue'
import TaskDeleteModal from '~/components/tasks/TaskDeleteModal.vue'
import TaskStats from '~/components/tasks/TaskStats.vue'
import RecentJournalEntries from '~/components/journal/RecentJournalEntries.vue'
import JournalEntryModal from '~/components/journal/JournalEntryModal.vue'
import type { Task } from '~/types/task'
import type { JournalEntry } from '~/types/journal'

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

// Configure marked options for proper markdown rendering
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true     // Enable GitHub Flavored Markdown
})

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

// Use the journal entry modal composable
const journalModal = useJournalEntryModal()

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

// Add renderMarkdown function
const renderMarkdown = (content: string) => {
  if (!content) return ''
  return marked(content)
}

// Update the openCreateModal function to use the composable
function openCreateModal() {
  journalModal.openModal()
}

// Add handleJournalSubmit function
function handleJournalSubmit(entry: Partial<JournalEntry>) {
  journalModal.createEntry(entry, fetchJournalEntries)
}
</script>
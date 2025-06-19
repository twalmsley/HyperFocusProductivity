<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Journal</h1>
        <button @click="openCreateModal"
          class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          New Entry
        </button>
      </div>

      <!-- Calendar View -->
      <div class="bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Calendar</h2>
          <button 
            @click="jumpToToday"
            class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
        <div class="calendar-grid">
          <Calendar
            v-model="selectedDate"
            :attributes="calendarAttributes"
            @dayclick="onDayClick"
            is-expanded
            trim-weeks
            :first-day-of-week="1"
          />
        </div>
      </div>

      <!-- Entries for Selected Day -->
      <div class="bg-white p-6 rounded-lg shadow-sm mt-6">
        <h2 class="text-xl font-semibold mb-4">Entries for {{ formatDate(selectedDate.toISOString()) }}</h2>
        <div v-if="isLoading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
        </div>
        <div v-else-if="entriesForSelectedDay.length === 0" class="text-center text-gray-500 py-4">
          No entries for this day. Click "New Entry" to create one!
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mood</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="entry in entriesForSelectedDay" :key="entry.id" 
                  class="hover:bg-gray-50 transition-colors">
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
                  {{ formatTime(entry.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span v-for="tag in entry.tags" :key="tag"
                      class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center space-x-3">
                    <button @click="viewEntry(entry)" class="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    <button @click="editEntry(entry)" class="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button @click="confirmDelete(entry)" class="text-gray-400 hover:text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
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
    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">{{ viewingEntry?.title }}</h2>
          <button @click="closeViewModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <span>{{ formatDate(viewingEntry?.createdAt || '') }}</span>
            <span>•</span>
            <span>{{ viewingEntry?.type }}</span>
            <span v-if="viewingEntry?.mood" class="flex items-center">
              • {{ getMoodEmoji(viewingEntry.mood) }} {{ viewingEntry.mood }}
            </span>
          </div>
          <div class="whitespace-pre-wrap text-gray-700 prose prose-sm max-w-none" v-html="renderMarkdown(viewingEntry?.content || '')"></div>
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in viewingEntry?.tags" :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              #{{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Journal Entry</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveEdit" class="space-y-4">
          <div>
            <label for="edit-title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="edit-title"
              v-model="editingEntry.title"
              type="text"
              maxlength="200"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label for="edit-type" class="block text-sm font-medium text-gray-700">Entry Type</label>
            <select
              id="edit-type"
              v-model="editingEntry.type"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            >
              <option value="DAILY">Daily Journal</option>
              <option value="FREEFORM">Free-form Entry</option>
              <option value="REVIEW">Review Entry</option>
            </select>
          </div>
          <div>
            <label for="edit-mood" class="block text-sm font-medium text-gray-700">Mood</label>
            <select
              id="edit-mood"
              v-model="editingEntry.mood"
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
            <label for="edit-content" class="block text-sm font-medium text-gray-700">Content</label>
            <div class="mt-1 grid grid-cols-2 gap-4">
              <div>
                <textarea
                  id="edit-content"
                  v-model="editingEntry.content"
                  rows="6"
                  maxlength="10000"
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                ></textarea>
              </div>
              <div class="prose prose-sm max-w-none p-4 bg-gray-50 rounded-md overflow-auto">
                <div v-html="renderMarkdown(editingEntry.content || '')"></div>
              </div>
            </div>
          </div>
          <div>
            <label for="edit-tags" class="block text-sm font-medium text-gray-700">Tags</label>
            <div class="mt-1 flex flex-wrap gap-2">
              <span v-for="tag in editingEntry.tags" :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center">
                {{ tag }}
                <button type="button" @click="removeTag(tag)" class="ml-1 text-gray-500 hover:text-gray-700">
                  ×
                </button>
              </span>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Modal -->
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
import { ref, onMounted, computed } from 'vue'
import { Calendar } from 'v-calendar'
import { marked } from 'marked'
import JournalEntryModal from '~/components/journal/JournalEntryModal.vue'
import type { JournalEntry } from '~/types/journal'
import 'v-calendar/style.css'

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

definePageMeta({
  auth: true
})

const isLoading = ref(true)
const journalEntries = ref<JournalEntry[]>([])
const selectedDate = ref(new Date())

// Configure marked options
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true,    // Enable GitHub Flavored Markdown
  headerIds: true,
  mangle: false
})

// Get mood emoji
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

// Format time for display
const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Computed property for entries on selected day
const entriesForSelectedDay = computed(() => {
  return journalEntries.value.filter(entry => {
    const entryDate = new Date(entry.createdAt)
    return entryDate.toDateString() === selectedDate.value.toDateString()
  })
})

const calendarAttributes = computed(() => {
  const attributes = [
    {
      key: 'selected',
      dot: {
        color: '#0f172a', // very dark blue
        class: 'selected-date-dot'
      },
      dates: [selectedDate.value]
    },
    ...journalEntries.value.map(entry => ({
      key: entry.id,
      highlight: {
        color: 'blue',
        fillMode: 'light' as const,
      },
      dates: [new Date(entry.createdAt)],
      popover: {
        label: entry.title,
      },
    }))
  ]
  return attributes
})

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Add these new refs
const showViewModal = ref(false)
const showEditModal = ref(false)
const viewingEntry = ref<Partial<JournalEntry>>({})
const editingEntry = ref<Partial<JournalEntry>>({})
const isSaving = ref(false)

// Use the journal entry modal composable
const journalModal = useJournalEntryModal()

// Modify the viewEntry function
const viewEntry = (entry: JournalEntry) => {
  viewingEntry.value = entry
  showViewModal.value = true
}

// Add closeViewModal function
const closeViewModal = () => {
  showViewModal.value = false
  viewingEntry.value = {}
}

// Modify the editEntry function
const editEntry = (entry: JournalEntry) => {
  editingEntry.value = { ...entry }
  showEditModal.value = true
}

// Add closeEditModal function
const closeEditModal = () => {
  showEditModal.value = false
  editingEntry.value = {}
}

// Add create modal functions
const openCreateModal = () => {
  journalModal.openModal()
}

// Add back the saveEdit function
const saveEdit = async () => {
  try {
    isSaving.value = true

    const response = await $fetch(`/api/journal/${editingEntry.value.id}`, {
      method: 'PATCH',
      body: {
        title: editingEntry.value.title,
        content: editingEntry.value.content,
        type: editingEntry.value.type,
        date: editingEntry.value.date,
        mood: editingEntry.value.mood,
        tags: editingEntry.value.tags,
        templateUsed: editingEntry.value.templateUsed
      }
    })

    // Update the entry in the local list
    const index = journalEntries.value.findIndex(e => e.id === response.id)
    if (index !== -1) {
      journalEntries.value[index] = response
    }

    closeEditModal()
  } catch (error) {
    console.error('Error updating journal entry:', error)
  } finally {
    isSaving.value = false
  }
}

// Modify the createEntry function
const createEntry = async () => {
  await journalModal.createEntry(fetchEntries)
}

// Add handleJournalSubmit function
function handleJournalSubmit(entry: Partial<JournalEntry>) {
  journalModal.createEntry(entry, fetchEntries)
}

// Delete a specific entry
const confirmDelete = async (entry: JournalEntry) => {
  if (confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
    try {
      await $fetch(`/api/journal/${entry.id}`, {
        method: 'DELETE'
      })
      // Refresh the entries list
      await fetchEntries()
      // Navigate back to the main journal page
      navigateTo('/app/journal')
    } catch (error) {
      console.error('Error deleting journal entry:', error)
    }
  }
}

// Fetch journal entries
const fetchEntries = async () => {
  try {
    isLoading.value = true
    const response = await $fetch('/api/journal')
    // Sort entries by createdAt in descending order (most recent first)
    journalEntries.value = response.sort((a: JournalEntry, b: JournalEntry) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (error) {
    console.error('Error fetching journal entries:', error)
  } finally {
    isLoading.value = false
  }
}

// Add this function in the script section, before the onMounted hook
const jumpToToday = () => {
  selectedDate.value = new Date()
}

// Initial fetch
onMounted(() => {
  fetchEntries()
})

const onDayClick = (day: any) => {
  selectedDate.value = day.date
}

// Update the renderMarkdown function
const renderMarkdown = (content: string) => {
  if (!content) return ''
  return marked(content)
}
</script>

<style scoped>
.calendar-grid {
  min-height: 400px;
}

:deep(.selected-date-dot) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 2px;
}

:deep(.prose) {
  max-width: none;
}

:deep(.prose ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose ol) {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose h1),
:deep(.prose h2),
:deep(.prose h3),
:deep(.prose h4),
:deep(.prose h5),
:deep(.prose h6) {
  margin-top: 1em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
}

:deep(.prose p) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

:deep(.prose pre) {
  background-color: #f3f4f6;
  padding: 1em;
  border-radius: 0.375rem;
  overflow-x: auto;
}

:deep(.prose code) {
  background-color: #f3f4f6;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

:deep(.prose a) {
  color: #2563eb; /* Blue color for links */
  text-decoration: underline;
  transition: color 0.2s ease;
}

:deep(.prose a:hover) {
  color: #1d4ed8; /* Darker blue on hover */
  text-decoration: underline;
}

:deep(.prose a:visited) {
  color: #7c3aed; /* Purple for visited links */
}
</style> 
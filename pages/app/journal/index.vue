<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-center items-center mb-6 relative">
        <h1 class="text-3xl font-bold">Journal</h1>
        <button @click="openCreateModal"
          class="absolute right-0 bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          New Entry
        </button>
      </div>

      <!-- Side by side layout -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Calendar View -->
        <div class="bg-white p-4 rounded-lg shadow-sm lg:w-80 flex-shrink-0">
          <div class="flex items-center justify-between mb-2">
            <h2 class="text-xl font-semibold">Calendar</h2>
            <button 
              @click="jumpToToday"
              class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-3 py-1.5 rounded-lg transition-colors text-sm"
            >
              Today
            </button>
          </div>
          <div class="calendar-grid">
            <Calendar
              v-model="selectedDate"
              :attributes="calendarAttributes"
              @dayclick="onDayClick"
              @monthchange="onMonthChange"
              is-expanded
              trim-weeks
              :first-day-of-week="1"
            />
          </div>
        </div>

        <!-- Entries for Selected Day -->
        <div class="bg-white p-4 rounded-lg shadow-sm flex-1 min-w-0">
          <h2 class="text-xl font-semibold mb-3">Entries for {{ formatDate(selectedDate.toISOString()) }}</h2>
          <div v-if="isLoading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
          </div>
          <div v-else-if="entriesForSelectedDay.length === 0" class="text-center text-gray-500 py-4">
            No entries for this day. Click "New Entry" to create one!
          </div>
          <div v-else class="grid gap-4">
            <div v-for="entry in entriesForSelectedDay" :key="entry.id" 
                class="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <!-- Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ entry.title }}</h3>
                  <div class="flex items-center gap-3 text-sm text-gray-500">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {{ entry.type }}
                    </span>
                    <span>{{ formatTime(entry.createdAt) }}</span>
                    <span v-if="entry.mood" class="flex items-center gap-1">
                      {{ getMoodEmoji(entry.mood) }} {{ entry.mood }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="viewEntry(entry)" class="text-gray-400 hover:text-gray-600 p-1 rounded" title="View">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button @click="editEntry(entry)" class="text-gray-400 hover:text-gray-600 p-1 rounded" title="Edit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(entry)" class="text-gray-400 hover:text-gray-600 p-1 rounded" title="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="mb-3">
                <div class="text-gray-700 prose prose-sm max-w-none line-clamp-4">
                  <!-- For partial entries, we don't have content, so show a placeholder -->
                  <span class="text-gray-500 italic">Content preview not available in calendar view. Click "View" to see full entry.</span>
                </div>
              </div>

              <!-- Tags -->
              <div class="flex flex-wrap gap-1">
                <span class="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                  Tags not shown in calendar view
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- View Modal -->
    <div v-if="showViewModal" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
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
      <div class="bg-white rounded-lg p-6 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Edit Journal Entry</h2>
          <button @click="closeEditModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveEdit" class="space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
          </div>
          <div>
            <label for="edit-content" class="block text-sm font-medium text-gray-700">Content</label>
            <div class="mt-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <textarea
                  id="edit-content"
                  v-model="editingEntry.content"
                  rows="12"
                  maxlength="10000"
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                ></textarea>
              </div>
              <div class="prose prose-sm max-w-none p-4 bg-gray-50 rounded-md overflow-auto max-h-96">
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
import { ref, onMounted, computed, watch } from 'vue'
import { Calendar } from 'v-calendar'
import { marked } from 'marked'
import JournalEntryModal from '~/components/journal/JournalEntryModal.vue'
import type { JournalEntry, PartialJournalEntry } from '~/types/journal'
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
const journalEntries = ref<PartialJournalEntry[]>([])
const selectedDate = ref(new Date())
const currentMonth = ref(new Date().getMonth() + 1)
const currentYear = ref(new Date().getFullYear())

// Configure marked options
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true     // Enable GitHub Flavored Markdown
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
    const entryDate = new Date(entry.date)
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
      dates: [new Date(entry.date)],
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

// Modify the viewEntry function to fetch full entry
const viewEntry = async (entry: PartialJournalEntry) => {
  try {
    const fullEntry = await $fetch<JournalEntry>(`/api/journal/${entry.id}`)
    viewingEntry.value = fullEntry
    showViewModal.value = true
  } catch (error) {
    console.error('Error fetching full journal entry:', error)
  }
}

// Add closeViewModal function
const closeViewModal = () => {
  showViewModal.value = false
  viewingEntry.value = {}
}

// Modify the editEntry function to fetch full entry
const editEntry = async (entry: PartialJournalEntry) => {
  try {
    const fullEntry = await $fetch<JournalEntry>(`/api/journal/${entry.id}`)
    editingEntry.value = { ...fullEntry }
    showEditModal.value = true
  } catch (error) {
    console.error('Error fetching full journal entry:', error)
  }
}

// Add closeEditModal function
const closeEditModal = () => {
  showEditModal.value = false
  editingEntry.value = {}
}

// Add removeTag function
const removeTag = (tagToRemove: string) => {
  editingEntry.value.tags = editingEntry.value.tags?.filter(tag => tag !== tagToRemove) || []
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

    // Update the entry in the local list if it's in the current month
    const index = journalEntries.value.findIndex(e => e.id === response.id)
    if (index !== -1) {
      journalEntries.value[index] = {
        id: response.id,
        title: response.title,
        date: response.date,
        type: response.type,
        mood: response.mood,
        createdAt: response.createdAt
      }
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
  await journalModal.createEntry({}, fetchEntriesForMonth)
}

// Add handleJournalSubmit function
function handleJournalSubmit(entry: Partial<JournalEntry>) {
  journalModal.createEntry(entry, fetchEntriesForMonth)
}

// Delete a specific entry
const confirmDelete = async (entry: PartialJournalEntry) => {
  if (confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
    try {
      await $fetch(`/api/journal/${entry.id}`, {
        method: 'DELETE'
      })
      // Refresh the entries list for current month
      await fetchEntriesForMonth()
    } catch (error) {
      console.error('Error deleting journal entry:', error)
    }
  }
}

// Fetch partial journal entries for a specific month
const fetchEntriesForMonth = async (year?: number, month?: number) => {
  try {
    isLoading.value = true
    const targetYear = year || currentYear.value
    const targetMonth = month || currentMonth.value
    
    const response = await $fetch(`/api/journal/partial?year=${targetYear}&month=${targetMonth}`)
    // Ensure response is an array and properly typed
    const entries = Array.isArray(response) ? response : []
    journalEntries.value = entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      date: entry.date,
      type: entry.type,
      mood: entry.mood,
      createdAt: entry.createdAt
    })) as PartialJournalEntry[]
  } catch (error) {
    console.error('Error fetching journal entries:', error)
  } finally {
    isLoading.value = false
  }
}

// Watch for month changes in the calendar
const onMonthChange = (month: any) => {
  const newMonth = month.month + 1
  const newYear = month.year
  
  if (newMonth !== currentMonth.value || newYear !== currentYear.value) {
    currentMonth.value = newMonth
    currentYear.value = newYear
    fetchEntriesForMonth(newYear, newMonth)
  }
}

// Add this function in the script section, before the onMounted hook
const jumpToToday = () => {
  selectedDate.value = new Date()
  const today = new Date()
  const todayMonth = today.getMonth() + 1
  const todayYear = today.getFullYear()
  
  if (todayMonth !== currentMonth.value || todayYear !== currentYear.value) {
    currentMonth.value = todayMonth
    currentYear.value = todayYear
    fetchEntriesForMonth(todayYear, todayMonth)
  }
}

// Initial fetch
onMounted(() => {
  fetchEntriesForMonth()
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
  min-height: 300px;
}

:deep(.selected-date-dot) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 2px;
}

/* Make calendar more compact */
:deep(.vc-container) {
  --vc-pane-padding: 8px;
  --vc-day-content-margin: 2px;
  --vc-day-content-padding: 4px;
  --vc-day-content-min-height: 32px;
  --vc-day-content-min-width: 32px;
  --vc-day-content-font-size: 14px;
  --vc-header-padding: 8px;
  --vc-weekday-padding: 4px;
  --vc-weekday-font-size: 12px;
}

:deep(.vc-header) {
  padding: var(--vc-header-padding);
}

:deep(.vc-weeks) {
  padding: var(--vc-pane-padding);
}

:deep(.vc-weekday) {
  padding: var(--vc-weekday-padding);
  font-size: var(--vc-weekday-font-size);
}

:deep(.vc-day-content) {
  margin: var(--vc-day-content-margin);
  padding: var(--vc-day-content-padding);
  min-height: var(--vc-day-content-min-height);
  min-width: var(--vc-day-content-min-width);
  font-size: var(--vc-day-content-font-size);
}

/* Line clamp utility for content truncation */
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
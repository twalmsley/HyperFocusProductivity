<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Journal</h1>
        <NuxtLink to="/app/journal/new"
          class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors">
          New Entry
        </NuxtLink>
      </div>

      <!-- Calendar View -->
      <div class="bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
        <h2 class="text-xl font-semibold mb-4">Calendar</h2>
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
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="entry in entriesForSelectedDay" :key="entry.id" 
                  class="hover:bg-gray-50 cursor-pointer transition-colors"
                  @click="viewEntry(entry)">
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Calendar } from 'v-calendar'
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

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: 'DAILY' | 'FREEFORM' | 'REVIEW';
  date: string;
  mood: 'HAPPY' | 'SAD' | 'NEUTRAL' | 'ANGRY' | 'EXCITED' | null;
  tags: string[];
  templateUsed: string | null;
}

const isLoading = ref(true)
const journalEntries = ref<JournalEntry[]>([])
const selectedDate = ref(new Date())

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
  return journalEntries.value.map(entry => ({
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
})

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// View a specific entry
const viewEntry = (entry: JournalEntry) => {
  navigateTo(`/app/journal/${entry.id}`)
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

// Initial fetch
onMounted(() => {
  fetchEntries()
})

const onDayClick = (day: any) => {
  selectedDate.value = day.date
}
</script>

<style scoped>
.calendar-grid {
  min-height: 400px;
}
</style> 
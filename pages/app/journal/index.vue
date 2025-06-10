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
      <div class="bg-white p-6 rounded-lg shadow-sm">
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
  const entriesForDay = journalEntries.value.filter(entry => {
    const entryDate = new Date(entry.createdAt)
    return entryDate.toDateString() === day.date.toDateString()
  })
  
  if (entriesForDay.length > 0) {
    // If there's only one entry, navigate directly to it
    if (entriesForDay.length === 1) {
      viewEntry(entriesForDay[0])
    } else {
      // If there are multiple entries, you could show a modal or navigate to a filtered view
      // For now, we'll just navigate to the first entry
      viewEntry(entriesForDay[0])
    }
  }
}
</script>

<style scoped>
.calendar-grid {
  min-height: 400px;
}
</style> 
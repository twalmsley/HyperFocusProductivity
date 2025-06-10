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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar View -->
        <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Calendar</h2>
          <div class="calendar-grid">
            <!-- Calendar will be implemented here -->
            <div class="text-center text-gray-500 py-8">
              Calendar view coming soon...
            </div>
          </div>
        </div>

        <!-- Recent Entries -->
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <h2 class="text-xl font-semibold mb-4">Recent Entries</h2>
          <div v-if="isLoading" class="text-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
          </div>
          <div v-else-if="journalEntries.length === 0" class="text-center text-gray-500 py-4">
            No entries yet. Start your journaling journey today!
          </div>
          <div v-else class="space-y-4">
            <div v-for="entry in journalEntries" :key="entry.id" 
              class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              @click="viewEntry(entry)">
              <div class="flex justify-between items-start">
                <h3 class="font-medium">{{ entry.title }}</h3>
                <span class="text-sm text-gray-500">{{ formatDate(entry.createdAt) }}</span>
              </div>
              <p class="text-gray-600 mt-2 line-clamp-2">{{ entry.content }}</p>
              <div class="flex gap-2 mt-2">
                <span v-for="tag in entry.tags" :key="tag" 
                  class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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

definePageMeta({
  auth: true
})

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  type: 'daily' | 'freeform' | 'review';
  date: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'angry' | 'excited';
  tags: string[];
  backlinks: string[];
  templateUsed?: string;
}

const isLoading = ref(true)
const journalEntries = ref<JournalEntry[]>([])

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
    journalEntries.value = response
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
</script>

<style scoped>
.calendar-grid {
  min-height: 400px;
}
</style> 
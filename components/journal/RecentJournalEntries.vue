<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Recent Journal Entries</h2>
      <NuxtLink to="/app/journal" class="text-[var(--primary)] hover:text-[var(--button-hover)]">
        View All
      </NuxtLink>
    </div>
    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
    </div>
    <div v-else-if="entries.length === 0" class="text-center text-gray-500 py-4">
      No entries yet. Start your journaling journey today!
    </div>
    <div v-else class="space-y-4">
      <div v-for="entry in entries" :key="entry.id" 
           class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
           @click="$emit('view-entry', entry)">
        <div class="flex justify-between items-start">
          <h3 class="font-medium text-gray-900">{{ entry.title }}</h3>
          <span v-if="entry.mood" class="text-xl" :title="entry.mood.toLowerCase()">
            {{ getMoodEmoji(entry.mood) }}
          </span>
        </div>
        <div class="mt-2 text-sm text-gray-500">
          {{ formatDate(entry.createdAt) }}
        </div>
        <div class="mt-2 text-sm text-gray-600 line-clamp-2">
          {{ entry.content || 'No content available' }}
        </div>
        <div class="mt-2 flex flex-wrap gap-2">
          <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Tags available in full view
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

defineProps<{
  entries: JournalEntry[];
  isLoading: boolean;
}>()

defineEmits<{
  (e: 'view-entry', entry: JournalEntry): void;
}>()

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

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
</script> 
<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <NuxtLink 
              to="/app/journal" 
              class="text-gray-600 hover:text-gray-900 mr-4"
            >
              ← Back
            </NuxtLink>
            <h1 class="text-3xl font-bold">{{ entry?.title || 'Loading...' }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Edit
            </button>
            <button
              v-if="isEditing"
              @click="saveChanges"
              class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
            <button
              v-if="isEditing"
              @click="cancelEditing"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
        </div>

        <div v-else-if="!entry" class="text-center py-12 text-gray-500">
          Entry not found
        </div>

        <div v-else class="bg-white p-6 rounded-lg shadow-sm">
          <!-- Entry Metadata -->
          <div class="flex items-center justify-between mb-6 text-sm text-gray-500">
            <div class="flex items-center space-x-4">
              <span>{{ formatDate(entry.createdAt) }}</span>
              <span>•</span>
              <span>{{ entry.type }}</span>
              <span v-if="entry.mood" class="flex items-center">
                • {{ getMoodEmoji(entry.mood) }} {{ entry.mood }}
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <span v-for="tag in entry.tags" :key="tag" 
                class="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Entry Content -->
          <div v-if="!isEditing" class="whitespace-pre-wrap">{{ entry.content }}</div>

          <div v-else class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                v-model="editedEntry.title"
                type="text"
                maxlength="200"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </div>

            <!-- Entry Type -->
            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">Entry Type</label>
              <select
                id="type"
                v-model="editedEntry.type"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              >
                <option value="daily">Daily Journal</option>
                <option value="freeform">Free-form Entry</option>
                <option value="review">Review Entry</option>
              </select>
            </div>

            <!-- Mood -->
            <div>
              <label for="mood" class="block text-sm font-medium text-gray-700">Mood</label>
              <select
                id="mood"
                v-model="editedEntry.mood"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              >
                <option value="">Select a mood...</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="neutral">😐 Neutral</option>
                <option value="angry">😠 Angry</option>
                <option value="excited">🤩 Excited</option>
              </select>
            </div>

            <!-- Content -->
            <div>
              <label for="content" class="block text-sm font-medium text-gray-700">Content</label>
              <div class="mt-1">
                <textarea
                  id="content"
                  v-model="editedEntry.content"
                  rows="12"
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                ></textarea>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Use # for tags and [[note-title]] for backlinks.
              </p>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
              <div class="mt-1">
                <input
                  id="tags"
                  v-model="tagInput"
                  type="text"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  placeholder="Add tags separated by spaces"
                  @keydown.enter.prevent="addTag"
                />
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in editedEntry.tags"
                  :key="tag"
                  class="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                >
                  #{{ tag }}
                  <button
                    type="button"
                    class="ml-1 text-gray-500 hover:text-gray-700"
                    @click="removeTag(tag)"
                  >
                    ×
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Backlinks Section -->
          <div v-if="entry.backlinks.length > 0" class="mt-8 pt-6 border-t">
            <h3 class="text-lg font-semibold mb-4">Linked Notes</h3>
            <div class="space-y-2">
              <NuxtLink
                v-for="backlink in entry.backlinks"
                :key="backlink"
                :to="`/app/notes/${backlink}`"
                class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {{ backlink }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const route = useRoute()
const entryId = route.params.id as string

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
const isEditing = ref(false)
const isSaving = ref(false)
const entry = ref<JournalEntry | null>(null)
const editedEntry = ref<Partial<JournalEntry>>({})
const tagInput = ref('')

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

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

// Add a tag
const addTag = () => {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !editedEntry.value.tags?.includes(tag)) {
    editedEntry.value.tags?.push(tag)
  }
  tagInput.value = ''
}

// Remove a tag
const removeTag = (tag: string) => {
  editedEntry.value.tags = editedEntry.value.tags?.filter(t => t !== tag)
}

// Start editing
const startEditing = () => {
  editedEntry.value = { ...entry.value }
  isEditing.value = true
}

// Cancel editing
const cancelEditing = () => {
  editedEntry.value = {}
  isEditing.value = false
}

// Fetch entry
const fetchEntry = async () => {
  try {
    isLoading.value = true
    const response = await $fetch(`/api/journal/${entryId}`)
    entry.value = response
  } catch (error) {
    console.error('Error fetching journal entry:', error)
  } finally {
    isLoading.value = false
  }
}

// Save changes
const saveChanges = async () => {
  try {
    isSaving.value = true
    const response = await $fetch(`/api/journal/${entryId}`, {
      method: 'PATCH',
      body: {
        title: editedEntry.value.title,
        content: editedEntry.value.content,
        type: editedEntry.value.type,
        date: editedEntry.value.date,
        mood: editedEntry.value.mood,
        tags: editedEntry.value.tags,
        backlinks: editedEntry.value.backlinks,
        templateUsed: editedEntry.value.templateUsed
      }
    })
    entry.value = response
    isEditing.value = false
  } catch (error) {
    console.error('Error updating journal entry:', error)
  } finally {
    isSaving.value = false
  }
}

// Initial fetch
onMounted(() => {
  fetchEntry()
})
</script>

<style>
/* Remove custom prose styles as they are now handled by @tailwindcss/typography */
</style> 
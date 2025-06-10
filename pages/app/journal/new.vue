<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center mb-6">
          <NuxtLink 
            to="/app/journal" 
            class="text-gray-600 hover:text-gray-900 mr-4"
          >
            ← Back
          </NuxtLink>
          <h1 class="text-3xl font-bold">New Journal Entry</h1>
        </div>

        <form @submit.prevent="createEntry" class="bg-white p-6 rounded-lg shadow-sm">
          <div class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                v-model="entry.title"
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
                v-model="entry.type"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              >
                <option value="daily">Daily Journal</option>
                <option value="freeform">Free-form Entry</option>
                <option value="review">Review Entry</option>
              </select>
            </div>

            <!-- Mood (optional) -->
            <div>
              <label for="mood" class="block text-sm font-medium text-gray-700">Mood (optional)</label>
              <select
                id="mood"
                v-model="entry.mood"
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
                  v-model="entry.content"
                  rows="12"
                  required
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
                  placeholder="Start writing your journal entry here..."
                ></textarea>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                Use # for tags.
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
                  placeholder="Add tags separated by spaces (e.g., work personal goals)"
                  @keydown.enter.prevent="addTag"
                />
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in entry.tags"
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

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-6 py-2 rounded-lg transition-colors"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : 'Save Entry' }}
              </button>
            </div>
          </div>
        </form>
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

const entry = ref<Partial<JournalEntry>>({
  title: '',
  content: '',
  type: 'freeform',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  backlinks: []
})

const tagInput = ref('')
const isSaving = ref(false)

// Add a tag
const addTag = () => {
  const tag = tagInput.value.trim().toLowerCase()
  if (tag && !entry.value.tags?.includes(tag)) {
    entry.value.tags?.push(tag)
  }
  tagInput.value = ''
}

// Remove a tag
const removeTag = (tag: string) => {
  entry.value.tags = entry.value.tags?.filter(t => t !== tag)
}

// Create new entry
const createEntry = async () => {
  try {
    isSaving.value = true
    const response = await $fetch('/api/journal', {
      method: 'POST',
      body: {
        title: entry.value.title,
        content: entry.value.content,
        type: entry.value.type,
        date: entry.value.date,
        mood: entry.value.mood,
        tags: entry.value.tags,
        backlinks: entry.value.backlinks,
        templateUsed: entry.value.templateUsed
      }
    })
    navigateTo('/app/journal')
  } catch (error) {
    console.error('Error creating journal entry:', error)
  } finally {
    isSaving.value = false
  }
}
</script> 
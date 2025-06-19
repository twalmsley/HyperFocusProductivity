<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">New Journal Entry</h2>
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="create-title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="create-title"
            v-model="localEntry.title"
            type="text"
            :maxlength="maxTitleLength"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          />
        </div>
        <div>
          <label for="create-type" class="block text-sm font-medium text-gray-700">Entry Type</label>
          <select
            id="create-type"
            v-model="localEntry.type"
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
            v-model="localEntry.mood"
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
          <div class="mt-1" :class="showMarkdownPreview ? 'grid grid-cols-2 gap-4' : ''">
            <div>
              <textarea
                id="create-content"
                v-model="localEntry.content"
                rows="6"
                :maxlength="maxContentLength"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              ></textarea>
            </div>
            <div v-if="showMarkdownPreview" class="prose prose-sm max-w-none p-4 bg-gray-50 rounded-md overflow-auto">
              <div v-html="renderMarkdown(localEntry.content || '')"></div>
            </div>
          </div>
        </div>
        <div>
          <label for="create-tags" class="block text-sm font-medium text-gray-700">Tags</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <span v-for="tag in localEntry.tags" :key="tag"
              class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs flex items-center">
              {{ tag }}
              <button type="button" @click="removeTag(tag)" class="ml-1 text-gray-500 hover:text-gray-700">
                ×
              </button>
            </span>
            <input
              id="create-tags"
              v-model="localTagInput"
              type="text"
              maxlength="200"
              placeholder="Add tags..."
              @keydown.enter.prevent="addTag"
              class="flex-1 min-w-[120px] rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="handleClose"
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
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { marked } from 'marked'
import type { JournalEntryForm } from '~/types/journal'

// Configure marked options for proper markdown rendering
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true     // Enable GitHub Flavored Markdown
})

interface Props {
  show: boolean;
  isSaving: boolean;
  showMarkdownPreview?: boolean;
  maxTitleLength?: number;
  maxContentLength?: number;
}

interface Emits {
  (e: 'close'): void;
  (e: 'submit', entry: Partial<JournalEntryForm>): void;
}

const props = withDefaults(defineProps<Props>(), {
  showMarkdownPreview: false,
  maxTitleLength: 200,
  maxContentLength: 2000
})

const emit = defineEmits<Emits>()

// Local state
const localEntry = ref<Partial<JournalEntryForm>>({
  title: '',
  content: '',
  type: 'FREEFORM',
  date: new Date().toISOString().split('T')[0],
  tags: [],
})
const localTagInput = ref('')

// Reset local entry when modal opens
watch(() => props.show, (newShow) => {
  if (newShow) {
    localEntry.value = {
      title: '',
      content: '',
      type: 'FREEFORM',
      date: new Date().toISOString().split('T')[0],
      tags: [],
    }
    localTagInput.value = ''
  }
})

function handleClose() {
  emit('close')
}

function handleSubmit() {
  // Parse any remaining tags in the input field
  if (localTagInput.value.trim()) {
    const remainingTags = localTagInput.value
      .split(/[,;\s]+/)
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)
    remainingTags.forEach(tag => {
      if (!localEntry.value.tags?.includes(tag)) {
        if (!localEntry.value.tags) localEntry.value.tags = []
        localEntry.value.tags.push(tag)
      }
    })
    localTagInput.value = ''
  }
  
  emit('submit', localEntry.value)
}

function addTag() {
  if (!localTagInput.value.trim()) return
  const tags = localTagInput.value
    .split(/[,;\s]+/)
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
  tags.forEach(tag => {
    if (!localEntry.value.tags?.includes(tag)) {
      if (!localEntry.value.tags) localEntry.value.tags = []
      localEntry.value.tags.push(tag)
    }
  })
  localTagInput.value = ''
}

function removeTag(tag: string) {
  if (localEntry.value.tags) {
    localEntry.value.tags = localEntry.value.tags.filter(t => t !== tag)
  }
}

function renderMarkdown(content: string): string {
  return marked(content) as string
}
</script> 
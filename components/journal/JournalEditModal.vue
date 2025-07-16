<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Edit Journal Entry</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label for="edit-title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="edit-title"
              v-model="localEntry.title"
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
            <label for="edit-mood" class="block text-sm font-medium text-gray-700">Mood</label>
            <select
              id="edit-mood"
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
        </div>
        <div>
          <label for="edit-content" class="block text-sm font-medium text-gray-700">Content</label>
          <div class="mt-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <textarea
                ref="textareaRef"
                id="edit-content"
                v-model="localEntry.content"
                rows="12"
                maxlength="10000"
                required
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] resize-y"
                @input="updateMarkdownHeight"
              ></textarea>
            </div>
            <div ref="markdownRef" class="prose prose-sm max-w-none p-4 bg-gray-50 rounded-md overflow-y-auto">
              <div v-html="renderMarkdown(localEntry.content || '')"></div>
            </div>
          </div>
        </div>
        <div>
          <label for="edit-tags" class="block text-sm font-medium text-gray-700">Tags</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <span v-for="tag in localEntry.tags" :key="tag"
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
            @click="$emit('close')"
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
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { marked } from 'marked'
import type { JournalEntry } from '~/types/journal'
import DOMPurify from 'dompurify'

// Configure marked options for proper markdown rendering
marked.setOptions({
  breaks: true, // Convert line breaks to <br>
  gfm: true     // Enable GitHub Flavored Markdown
})

interface Props {
  show: boolean;
  entry: JournalEntry;
  isSaving: boolean;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', entry: JournalEntry): void;
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Refs for dynamic height matching
const textareaRef = ref<HTMLTextAreaElement>()
const markdownRef = ref<HTMLDivElement>()

// Function to update markdown div height to match textarea
function updateMarkdownHeight() {
  if (textareaRef.value && markdownRef.value) {
    const textareaHeight = textareaRef.value.offsetHeight
    markdownRef.value.style.height = `${textareaHeight}px`
  }
}

// Local copy of the entry to avoid direct mutation
const localEntry = ref<JournalEntry>({ ...props.entry })

// Watch for changes in the entry prop
watch(() => props.entry, (newEntry) => {
  localEntry.value = { ...newEntry }
}, { deep: true })

// Watch for modal show to set up resize observer
watch(() => props.show, (show) => {
  if (show) {
    nextTick(() => {
      updateMarkdownHeight()
      
      // Set up resize observer for textarea
      if (textareaRef.value) {
        const resizeObserver = new ResizeObserver(() => {
          updateMarkdownHeight()
        })
        resizeObserver.observe(textareaRef.value)
        
        // Clean up observer when modal closes
        watch(() => props.show, (modalShow) => {
          if (!modalShow) {
            resizeObserver.disconnect()
          }
        })
      }
    })
  }
})

function handleSave() {
  emit('save', localEntry.value)
}

function removeTag(tagToRemove: string) {
  localEntry.value.tags = localEntry.value.tags?.filter(tag => tag !== tagToRemove) || []
}

function renderMarkdown(content: string): string {
  return DOMPurify.sanitize(marked(content) as string)
}
</script> 
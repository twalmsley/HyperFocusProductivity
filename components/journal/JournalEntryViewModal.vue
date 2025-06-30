<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">{{ entry?.title }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="space-y-4">
        <div class="flex items-center space-x-4 text-sm text-gray-500">
          <span>{{ formatDate(entry?.createdAt || '') }}</span>
          <span>•</span>
          <span>{{ entry?.type }}</span>
          <span v-if="entry?.mood" class="flex items-center">
            • {{ getMoodEmoji(entry.mood) }} {{ entry.mood }}
          </span>
        </div>
        <div class="whitespace-pre-wrap text-gray-700 prose prose-sm max-w-none" v-html="renderMarkdown(entry?.content || '')"></div>
        <div class="flex flex-wrap gap-2">
          <span v-for="tag in entry?.tags" :key="tag"
            class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            #{{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { computed } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps({
  show: Boolean,
  entry: {
    type: Object as () => Record<string, any> | null,
    default: null
  }
})

const emit = defineEmits(['close'])

function formatDate(dateString: string) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getMoodEmoji(mood: string | null) {
  const emojis: Record<string, string> = {
    'HAPPY': '😊',
    'SAD': '😢',
    'NEUTRAL': '😐',
    'ANGRY': '😠',
    'EXCITED': '🤩'
  }
  return mood ? emojis[mood] || '❓' : null
}

function renderMarkdown(content: string) {
  if (!content) return ''
  return DOMPurify.sanitize(marked(content) as string)
}
</script> 
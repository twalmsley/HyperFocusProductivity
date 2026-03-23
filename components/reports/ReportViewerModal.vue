<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
    <div class="bg-white/95 rounded-lg shadow-xl flex flex-col" style="max-width: 90vw; max-height: 90vh; width: 900px;">
      <div class="flex justify-between items-start p-6 pb-0">
        <h3 class="text-lg font-medium">{{ title }}</h3>
        <button @click="$emit('dismiss')" class="text-gray-400 hover:text-gray-500 flex-shrink-0">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="overflow-auto p-6 flex-1">
        <div class="prose prose-sm max-w-none" v-html="renderedHtml"></div>
      </div>

      <div class="flex justify-end p-6 pt-0">
        <button
          type="button"
          @click="$emit('dismiss')"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)]"
        >
          Dismiss
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps<{
  show: boolean
  title: string
  markdown: string
}>()

defineEmits<{
  (e: 'dismiss'): void
}>()

const renderedHtml = computed(() => {
  if (!props.markdown) return ''
  const raw = marked(props.markdown) as string
  return DOMPurify.sanitize(raw, {
    ADD_TAGS: ['svg', 'circle', 'path', 'rect', 'text', 'g', 'line', 'defs', 'clipPath', 'use'],
    ADD_ATTR: [
      'viewBox', 'xmlns', 'width', 'height', 'fill', 'stroke', 'stroke-width',
      'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
      'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'dx', 'dy', 'transform',
      'text-anchor', 'dominant-baseline', 'font-size', 'font-weight'
    ]
  })
})
</script>

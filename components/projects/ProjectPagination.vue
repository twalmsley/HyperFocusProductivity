<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <!-- Page size selector -->
      <div class="flex items-center gap-2">
        <label for="pageSize" class="text-sm text-gray-700">Show:</label>
        <select
          id="pageSize"
          :value="pageSize"
          @change="$emit('update:pageSize', parseInt($event.target.value))"
          class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span class="text-sm text-gray-700">per page</span>
      </div>

      <!-- Pagination info -->
      <div class="text-sm text-gray-700">
        Showing {{ startItem }} to {{ endItem }} of {{ total }} projects
      </div>

      <!-- Pagination controls -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('update:currentPage', currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        <div class="flex items-center gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="$emit('update:currentPage', page)"
            class="px-3 py-1 text-sm border rounded-md transition-colors"
            :class="page === currentPage 
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
          >
            {{ page }}
          </button>
        </div>
        
        <button
          @click="$emit('update:currentPage', currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  pageSize: number
  total: number
}

const props = defineProps<Props>()

defineEmits<{
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))
const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.total))

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  const halfVisible = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, props.currentPage - halfVisible)
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script> 
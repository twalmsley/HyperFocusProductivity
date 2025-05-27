<template>
  <div class="mt-4 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <span class="text-sm text-gray-700">Show</span>
      <select v-model="localPageSize" @change="(e) => handlePageSizeChange((e.target as HTMLSelectElement).value)"
        class="rounded-md border-gray-300 text-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
        <option value="200">200</option>
      </select>
      <span class="text-sm text-gray-700">items per page</span>
    </div>

    <div class="flex items-center space-x-2">
      <span class="text-sm text-gray-700">
        Showing {{ start }} to {{ end }} of {{ total }} items
      </span>
      <div class="flex space-x-1">
        <button @click="$emit('update:currentPage', 1)" :disabled="currentPage === 1"
          class="px-2 py-1 text-sm rounded-md border"
          :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
          title="First Page">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="$emit('update:currentPage', currentPage - 1)" :disabled="currentPage === 1"
          class="px-2 py-1 text-sm rounded-md border"
          :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
          title="Previous Page">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <button v-for="page in displayedPages" :key="page" @click="$emit('update:currentPage', page)"
          class="px-3 py-1 text-sm rounded-md border"
          :class="currentPage === page ? 'bg-[var(--primary)] text-white' : 'text-gray-700 hover:bg-gray-50'">
          {{ page }}
        </button>
        <button @click="$emit('update:currentPage', currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-2 py-1 text-sm rounded-md border"
          :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
          title="Next Page">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <button @click="$emit('update:currentPage', totalPages)" :disabled="currentPage === totalPages"
          class="px-2 py-1 text-sm rounded-md border"
          :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
          title="Last Page">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  currentPage: number;
  pageSize: number;
  total: number;
}>()

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
}>()

const localPageSize = ref(props.pageSize)

// Watch for changes in pageSize prop
watch(() => props.pageSize, (newSize) => {
  localPageSize.value = newSize
})

// Convert string to number when emitting pageSize changes
const handlePageSizeChange = (value: string) => {
  const numValue = parseInt(value, 10)
  localPageSize.value = numValue
  emit('update:pageSize', numValue)
}

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const start = computed(() => {
  if (props.total === 0) return 0
  return (props.currentPage - 1) * props.pageSize + 1
})

const end = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total)
})

const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2))
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)

  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script> 
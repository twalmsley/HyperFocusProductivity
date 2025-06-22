<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex flex-wrap gap-2">
      <span class="text-sm text-gray-500">Sort By:</span>
      <button
        @click="$emit('sort', 'name')"
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors"
        :class="sortColumn === 'name' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        Name
        <SortIndicator :active="sortColumn === 'name'" :direction="sortDirection" />
      </button>
      
      <button
        @click="$emit('sort', 'createdAt')"
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors"
        :class="sortColumn === 'createdAt' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        Created
        <SortIndicator :active="sortColumn === 'createdAt'" :direction="sortDirection" />
      </button>
      
      <button
        @click="$emit('sort', 'updatedAt')"
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors"
        :class="sortColumn === 'updatedAt' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        Updated
        <SortIndicator :active="sortColumn === 'updatedAt'" :direction="sortDirection" />
      </button>
      
      <button
        @click="$emit('sort', 'taskCount')"
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors"
        :class="sortColumn === 'taskCount' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        Tasks
        <SortIndicator :active="sortColumn === 'taskCount'" :direction="sortDirection" />
      </button>
      
      <button
        @click="$emit('sort', 'state')"
        class="flex items-center gap-1 px-3 py-1 text-sm rounded-md transition-colors"
        :class="sortColumn === 'state' ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
      >
        State
        <SortIndicator :active="sortColumn === 'state'" :direction="sortDirection" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SortIndicator from '~/components/SortIndicator.vue'

interface Props {
  sortColumn: string
  sortDirection: 'asc' | 'desc'
}

defineProps<Props>()

defineEmits<{
  sort: [column: string]
}>()
</script> 
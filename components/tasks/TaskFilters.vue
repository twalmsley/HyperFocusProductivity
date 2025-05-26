<template>
  <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
    <div class="flex flex-wrap gap-4 items-end">
      <!-- Search by title/notes -->
      <div class="flex-1 min-w-[200px]">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input id="search" v-model="filters.search" type="text" placeholder="Search in title & notes"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
      </div>

      <!-- Status filter -->
      <div class="w-40">
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select id="status" v-model="filters.status"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
          <option value="">All Statuses</option>
          <option value="BACKLOG">Backlog</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <!-- Priority filter -->
      <div class="w-40">
        <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <select id="priority" v-model="filters.priority"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
          <option value="">All Priorities</option>
          <option value="URGENT">URGENT</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LOW">LOW</option>
        </select>
      </div>

      <!-- Due date filter -->
      <div>
        <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <select id="dueDate" v-model="filters.dueDate"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
          <option value="">All</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due Today</option>
          <option value="week">Due This Week</option>
          <option value="month">Due This Month</option>
          <option value="none">No Due Date</option>
        </select>
      </div>

      <!-- Clear filters button -->
      <button @click="clearFilters"
        class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const emit = defineEmits(['update:filters'])

const filters = ref({
  search: '',
  status: '',
  priority: '',
  dueDate: ''
})

// Watch for changes in filters and emit them
watch(filters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })

// Clear all filters
function clearFilters() {
  filters.value = {
    search: '',
    status: '',
    priority: '',
    dueDate: ''
  }
}
</script> 
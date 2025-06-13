<template>
  <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
    <div class="flex flex-wrap gap-4">
      <button 
        @click="$emit('sort', 'title')" 
        class="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        :class="{ 'text-[var(--primary)]': sortColumn === 'title' }">
        Title
        <SortIndicator :active="sortColumn === 'title'" :direction="sortDirection" />
      </button>

      <button 
        @click="$emit('sort', 'status')" 
        class="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        :class="{ 'text-[var(--primary)]': sortColumn === 'status' }">
        Status
        <SortIndicator :active="sortColumn === 'status'" :direction="sortDirection" />
      </button>

      <button 
        @click="$emit('sort', 'priority')" 
        class="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        :class="{ 'text-[var(--primary)]': sortColumn === 'priority' }">
        Priority
        <SortIndicator :active="sortColumn === 'priority'" :direction="sortDirection" />
      </button>

      <button 
        @click="$emit('sort', 'estimatedPomodoros')" 
        class="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        :class="{ 'text-[var(--primary)]': sortColumn === 'estimatedPomodoros' }">
        Pomodoros
        <SortIndicator :active="sortColumn === 'estimatedPomodoros'" :direction="sortDirection" />
      </button>

      <button 
        v-if="showDueDate !== false"
        @click="$emit('sort', 'dueDate')" 
        class="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
        :class="{ 'text-[var(--primary)]': sortColumn === 'dueDate' }">
        Due Date
        <SortIndicator :active="sortColumn === 'dueDate'" :direction="sortDirection" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SortIndicator from '~/components/SortIndicator.vue'

defineProps<{
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  showDueDate?: boolean;
}>()

defineEmits<{
  (e: 'sort', column: string): void;
}>()
</script> 
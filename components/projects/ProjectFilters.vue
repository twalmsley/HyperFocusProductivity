<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div class="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-[var(--primary)]">
          <Icon name="lucide:search" class="ml-3 text-gray-400 w-4 h-4" />
          <input
            id="search"
            v-model="localFilters.search"
            type="text"
            placeholder="Search projects..."
            class="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      <!-- State Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">State</label>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button 
            type="button" 
            @click="localFilters.state = ''"
            :class="[
              'px-4 py-2 text-sm font-medium border border-gray-300',
              localFilters.state === '' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-l-md'
            ]"
          >
            All
          </button>
          <button 
            type="button" 
            @click="localFilters.state = 'No Tasks'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              localFilters.state === 'No Tasks' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            No Tasks
          </button>
          <button 
            type="button" 
            @click="localFilters.state = 'Not Started'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              localFilters.state === 'Not Started' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Not Started
          </button>
          <button 
            type="button" 
            @click="localFilters.state = 'In Progress'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              localFilters.state === 'In Progress' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            In Progress
          </button>
          <button 
            type="button" 
            @click="localFilters.state = 'Completed'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              localFilters.state === 'Completed' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-r-md'
            ]"
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ProjectFilters } from '~/utils/projectFilters'

interface Props {
  filters: ProjectFilters
}

interface Emits {
  'update:filters': [filters: ProjectFilters]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Initialize with proper structure to ensure reactivity
const localFilters = ref<ProjectFilters>({
  search: props.filters.search || '',
  state: props.filters.state || ''
})

// Watch for changes in localFilters and emit them
watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })
</script> 
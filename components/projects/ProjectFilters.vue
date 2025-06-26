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
            @click="clearFilters"
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
            @click="updateFilter('state', 'No Tasks')"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              localFilters.state === 'No Tasks' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            No Tasks
          </button>
          <button 
            type="button" 
            @click="updateFilter('state', 'Not Started')"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              localFilters.state === 'Not Started' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            Not Started
          </button>
          <button 
            type="button" 
            @click="updateFilter('state', 'In Progress')"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              localFilters.state === 'In Progress' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]"
          >
            In Progress
          </button>
          <button 
            type="button" 
            @click="updateFilter('state', 'Completed')"
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
import { ref, watch, computed } from 'vue'
import type { ProjectFilters } from '~/utils/projectFilters'

const props = defineProps<{ filters: ProjectFilters }>()
const emit = defineEmits(['update:filters'])

// Local copy of filters
const localFilters = ref<ProjectFilters>({
  search: props.filters.search || '',
  state: props.filters.state || ''
})

// Sync localFilters from props on mount/prop change
watch(() => props.filters, (newFilters) => {
  localFilters.value = {
    search: newFilters.search || '',
    state: newFilters.state || ''
  }
}, { immediate: true, deep: true })

// Handler for filter changes (call this in your UI events)
function updateFilter(key: keyof ProjectFilters, value: string) {
  if (localFilters.value[key] !== value) {
    localFilters.value[key] = value
    emit('update:filters', { ...localFilters.value })
  }
}

// Handler for clearing all filters
function clearFilters() {
  localFilters.value = { search: '', state: '' }
  emit('update:filters', { ...localFilters.value })
}
</script> 
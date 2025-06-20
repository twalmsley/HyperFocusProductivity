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

const localFilters = ref<ProjectFilters>({ ...props.filters })

watch(localFilters, (newFilters) => {
  emit('update:filters', newFilters)
}, { deep: true })

watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script> 
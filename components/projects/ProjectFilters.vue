<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search -->
      <div class="flex-1">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div class="relative">
          <Icon name="lucide:search" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            id="search"
            v-model="localFilters.search"
            type="text"
            placeholder="Search projects..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
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
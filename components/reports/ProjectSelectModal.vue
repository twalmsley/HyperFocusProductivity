<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl mx-4">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium">Select Project</h3>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
      </div>

      <div v-else-if="projects.length === 0" class="text-center py-8 text-gray-500">
        No projects found. Create a project first.
      </div>

      <div v-else class="space-y-4">
        <div>
          <label for="projectSelect" class="block text-sm font-medium text-gray-700 mb-1">Project</label>
          <select
            id="projectSelect"
            v-model="selectedProjectId"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          >
            <option value="" disabled>Choose a project...</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="runReport"
          :disabled="!selectedProjectId"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--primary)] rounded-md hover:bg-[var(--button-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Run Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Project {
  id: string
  name: string
}

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'run', payload: { projectId: string }): void
}>()

const projects = ref<Project[]>([])
const selectedProjectId = ref('')
const isLoading = ref(false)

watch(() => props.show, async (newVal) => {
  if (newVal) {
    selectedProjectId.value = ''
    isLoading.value = true
    try {
      const data = await $fetch<any[]>('/api/projects')
      projects.value = data.map((p) => ({ id: p.id, name: p.name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      projects.value = []
    } finally {
      isLoading.value = false
    }
  }
})

function runReport() {
  if (!selectedProjectId.value) return
  emit('run', { projectId: selectedProjectId.value })
}
</script>

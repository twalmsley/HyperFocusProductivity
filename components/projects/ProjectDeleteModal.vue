<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="lucide:alert-triangle" class="w-5 h-5 text-red-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Delete Project</h3>
        </div>
        
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{{ project?.name }}</strong>? 
          This action cannot be undone. All tasks in this project will be unlinked but not deleted.
        </p>

        <div class="flex justify-end gap-3">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'

interface Props {
  show: boolean
  project: Project | null
}

defineProps<Props>()

defineEmits<{
  cancel: []
  confirm: []
}>()
</script> 
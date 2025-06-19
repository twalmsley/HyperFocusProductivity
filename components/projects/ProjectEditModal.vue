<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Edit Project</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Project Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter project name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            />
          </div>

          <!-- Project Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              placeholder="Enter project description (optional)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
            ></textarea>
          </div>

          <!-- Project Color -->
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <div class="flex items-center gap-2">
              <input
                id="color"
                v-model="form.color"
                type="color"
                class="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                v-model="form.color"
                type="text"
                placeholder="#3B82F6"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Project, UpdateProjectData } from '~/types/project'

interface Props {
  show: boolean
  project: Project
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  save: [project: UpdateProjectData]
}>()

const form = ref<UpdateProjectData>({
  name: '',
  description: '',
  color: ''
})

const isSubmitting = ref(false)

// Update form when project changes
watch(() => props.project, (newProject) => {
  if (newProject) {
    form.value = {
      name: newProject.name,
      description: newProject.description || '',
      color: newProject.color || '#3B82F6'
    }
  }
}, { immediate: true })

async function handleSubmit() {
  if (!form.value.name?.trim()) return

  isSubmitting.value = true

  try {
    const updateData: UpdateProjectData = {
      name: form.value.name.trim(),
      description: form.value.description?.trim() || null,
      color: form.value.color || null
    }

    emit('save', { id: props.project.id, ...updateData })
  } catch (error) {
    console.error('Failed to update project:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script> 
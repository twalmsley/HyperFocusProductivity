<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Project Details</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div v-if="project" class="space-y-6">
          <!-- Project Header -->
          <div class="flex items-center gap-3">
            <div 
              v-if="project.color" 
              class="w-6 h-6 rounded-full flex-shrink-0"
              :style="{ backgroundColor: project.color }"
            ></div>
            <h3 class="text-2xl font-bold text-gray-900">{{ project.name }}</h3>
          </div>

          <!-- Project Description -->
          <div v-if="project.description">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p class="text-gray-600 whitespace-pre-wrap">{{ project.description }}</p>
          </div>

          <!-- Project Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-[var(--primary)]">{{ project._count?.tasks || 0 }}</div>
              <div class="text-sm text-gray-600">Tasks</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ completedTasks }}</div>
              <div class="text-sm text-gray-600">Completed</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ inProgressTasks }}</div>
              <div class="text-sm text-gray-600">In Progress</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">{{ backlogTasks }}</div>
              <div class="text-sm text-gray-600">Backlog</div>
            </div>
          </div>

          <!-- Project Tasks -->
          <div v-if="project.tasks && project.tasks.length > 0">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Tasks</h4>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="task in project.tasks"
                :key="task.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="text-sm font-medium text-gray-900">{{ task.title }}</span>
                  <span 
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getStatusClass(task.status)"
                  >
                    {{ task.status.replace('_', ' ') }}
                  </span>
                  <span 
                    class="px-2 py-1 text-xs rounded-full"
                    :class="getPriorityClass(task.priority)"
                  >
                    {{ task.priority }}
                  </span>
                </div>
                <div v-if="task.dueDate" class="text-xs text-gray-500">
                  {{ formatDate(task.dueDate) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Project Metadata -->
          <div class="border-t pt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Created:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(project.createdAt) }}</span>
              </div>
              <div>
                <span class="text-gray-500">Last Updated:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(project.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '~/types/project'

interface Props {
  show: boolean
  project: Project | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const completedTasks = computed(() => {
  if (!props.project?.tasks) return 0
  return props.project.tasks.filter(task => task.status === 'DONE').length
})

const inProgressTasks = computed(() => {
  if (!props.project?.tasks) return 0
  return props.project.tasks.filter(task => task.status === 'IN_PROGRESS').length
})

const backlogTasks = computed(() => {
  if (!props.project?.tasks) return 0
  return props.project.tasks.filter(task => task.status === 'BACKLOG').length
})

function getStatusClass(status: string): string {
  switch (status) {
    case 'DONE':
      return 'bg-green-100 text-green-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'BACKLOG':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPriorityClass(priority: string): string {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-100 text-red-800'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800'
    case 'LOW':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 
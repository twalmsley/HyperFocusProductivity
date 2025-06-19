<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3 mb-2">
          <div 
            v-if="project.color" 
            class="w-4 h-4 rounded-full flex-shrink-0"
            :style="{ backgroundColor: project.color }"
          ></div>
          <h3 class="text-lg font-semibold text-gray-900 truncate">{{ project.name }}</h3>
        </div>
        
        <p v-if="project.description" class="text-gray-600 mb-4 line-clamp-2">
          {{ project.description }}
        </p>
        
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <Icon name="lucide:list-todo" class="w-4 h-4" />
            <span>{{ project._count?.tasks || 0 }} tasks</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            <span>{{ formatDate(project.createdAt) }}</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2 ml-4">
        <button
          @click="$emit('view', project)"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          title="View project"
        >
          <Icon name="lucide:eye" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('edit', project)"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          title="Edit project"
        >
          <Icon name="lucide:edit" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', project)"
          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Delete project"
        >
          <Icon name="lucide:trash-2" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types/project'

interface Props {
  project: Project
}

defineProps<Props>()

defineEmits<{
  view: [project: Project]
  edit: [project: Project]
  delete: [project: Project]
}>()

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}
</script> 
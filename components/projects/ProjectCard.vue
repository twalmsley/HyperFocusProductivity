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
        
        <!-- Progress Bar and Percentage -->
        <div v-if="project._count?.tasks && project._count.tasks > 0" class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Progress</span>
            <span class="text-sm font-semibold text-gray-900">{{ completionPercentage }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
        </div>
        
        <div class="flex items-center gap-4 text-sm text-gray-500">
          <div class="flex items-center gap-1">
            <Icon name="lucide:list-todo" class="w-4 h-4" />
            <span>{{ project._count?.tasks || 0 }} tasks</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            <span>{{ formatDate(project.createdAt) }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon :name="getStateIcon(projectState)" class="w-4 h-4" />
            <span :class="getStateColor(projectState)">{{ projectState }}</span>
          </div>
        </div>

        <!-- Task Status Breakdown -->
        <div v-if="project._count?.tasks && project._count.tasks > 0" class="flex items-center gap-3 mt-3 text-xs">
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-orange-400"></div>
            <span class="text-orange-600">{{ backlogCount }} backlog</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-blue-400"></div>
            <span class="text-blue-600">{{ inProgressCount }} in progress</span>
          </div>
          <div class="flex items-center gap-1">
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
            <span class="text-green-600">{{ completedCount }} completed</span>
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
import { getProjectState, type ProjectState } from '~/utils/projectFilters'

interface Props {
  project: Project
}

const props = defineProps<Props>()

defineEmits<{
  view: [project: Project]
  edit: [project: Project]
  delete: [project: Project]
}>()

const projectState = computed(() => getProjectState(props.project))

// Calculate task counts by status
const backlogCount = computed(() => {
  if (!props.project.tasks) return 0
  return props.project.tasks.filter(task => task.status === 'BACKLOG').length
})

const inProgressCount = computed(() => {
  if (!props.project.tasks) return 0
  return props.project.tasks.filter(task => task.status === 'IN_PROGRESS').length
})

const completedCount = computed(() => {
  if (!props.project.tasks) return 0
  return props.project.tasks.filter(task => task.status === 'DONE').length
})

// Calculate completion percentage
const completionPercentage = computed(() => {
  const totalTasks = props.project._count?.tasks || 0
  if (totalTasks === 0) return 0
  
  const completedTasks = completedCount.value
  return Math.round((completedTasks / totalTasks) * 100)
})

function getStateIcon(state: ProjectState): string {
  switch (state) {
    case 'No Tasks':
      return 'lucide:circle'
    case 'Not Started':
      return 'lucide:clock'
    case 'In Progress':
      return 'lucide:play-circle'
    case 'Completed':
      return 'lucide:check-circle'
    default:
      return 'lucide:circle'
  }
}

function getStateColor(state: ProjectState): string {
  switch (state) {
    case 'No Tasks':
      return 'text-gray-500'
    case 'Not Started':
      return 'text-yellow-600'
    case 'In Progress':
      return 'text-blue-600'
    case 'Completed':
      return 'text-green-600'
    default:
      return 'text-gray-500'
  }
}

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
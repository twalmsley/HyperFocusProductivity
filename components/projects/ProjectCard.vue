<template>
  <div 
    class="rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    :class="{
      'bg-white': !project.color,
      'text-white': project.color && isDarkColor(project.color),
      'text-gray-900': project.color && !isDarkColor(project.color)
    }"
    :style="project.color ? { backgroundColor: project.color } : {}"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-3 mb-2">
          <div 
            v-if="project.color" 
            class="w-4 h-4 rounded-full flex-shrink-0 border-2"
            :class="{
              'border-white': isDarkColor(project.color),
              'border-gray-900': !isDarkColor(project.color)
            }"
            :style="{ backgroundColor: project.color }"
          ></div>
          <h3 
            class="text-lg font-semibold truncate"
            :class="{
              'text-gray-900': !project.color,
              'text-white': project.color && isDarkColor(project.color),
              'text-gray-900': project.color && !isDarkColor(project.color)
            }"
          >{{ project.name }}</h3>
        </div>
        
        <p 
          v-if="project.description" 
          class="mb-4 line-clamp-2"
          :class="{
            'text-gray-600': !project.color,
            'text-white/90': project.color && isDarkColor(project.color),
            'text-gray-700': project.color && !isDarkColor(project.color)
          }"
        >
          {{ project.description }}
        </p>
        
        <!-- Progress Bar and Percentage -->
        <div v-if="project._count?.tasks && project._count.tasks > 0" class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span 
              class="text-sm font-medium"
              :class="{
                'text-gray-700': !project.color,
                'text-white/90': project.color && isDarkColor(project.color),
                'text-gray-700': project.color && !isDarkColor(project.color)
              }"
            >Progress</span>
            <span 
              class="text-sm font-semibold"
              :class="{
                'text-gray-900': !project.color,
                'text-white': project.color && isDarkColor(project.color),
                'text-gray-900': project.color && !isDarkColor(project.color)
              }"
            >{{ completionPercentage }}%</span>
          </div>
          <div 
            class="w-full rounded-full h-2"
            :class="{
              'bg-gray-200': !project.color,
              'bg-white/20': project.color && isDarkColor(project.color),
              'bg-gray-200': project.color && !isDarkColor(project.color)
            }"
          >
            <div 
              class="h-2 rounded-full transition-all duration-300"
              :class="{
                'bg-[var(--primary)]': !project.color,
                'bg-white': project.color && isDarkColor(project.color),
                'bg-[var(--primary)]': project.color && !isDarkColor(project.color)
              }"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>
        </div>
        
        <div 
          class="flex items-center gap-4 text-sm"
          :class="{
            'text-gray-500': !project.color,
            'text-white/80': project.color && isDarkColor(project.color),
            'text-gray-500': project.color && !isDarkColor(project.color)
          }"
        >
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
            <div 
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-orange-400': !project.color,
                'bg-white': project.color && isDarkColor(project.color),
                'bg-orange-400': project.color && !isDarkColor(project.color)
              }"
            ></div>
            <span 
              :class="{
                'text-orange-600': !project.color,
                'text-white/90': project.color && isDarkColor(project.color),
                'text-orange-600': project.color && !isDarkColor(project.color)
              }"
            >{{ backlogCount }} backlog</span>
          </div>
          <div class="flex items-center gap-1">
            <div 
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-blue-400': !project.color,
                'bg-white': project.color && isDarkColor(project.color),
                'bg-blue-400': project.color && !isDarkColor(project.color)
              }"
            ></div>
            <span 
              :class="{
                'text-blue-600': !project.color,
                'text-white/90': project.color && isDarkColor(project.color),
                'text-blue-600': project.color && !isDarkColor(project.color)
              }"
            >{{ inProgressCount }} in progress</span>
          </div>
          <div class="flex items-center gap-1">
            <div 
              class="w-2 h-2 rounded-full"
              :class="{
                'bg-green-400': !project.color,
                'bg-white': project.color && isDarkColor(project.color),
                'bg-green-400': project.color && !isDarkColor(project.color)
              }"
            ></div>
            <span 
              :class="{
                'text-green-600': !project.color,
                'text-white/90': project.color && isDarkColor(project.color),
                'text-green-600': project.color && !isDarkColor(project.color)
              }"
            >{{ completedCount }} completed</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-2 ml-4">
        <button
          @click="$emit('view', project)"
          class="p-2 rounded-md transition-colors"
          :class="{
            'text-gray-400 hover:text-gray-600 hover:bg-gray-100': !project.color,
            'text-white/70 hover:text-white hover:bg-white/10': project.color && isDarkColor(project.color),
            'text-gray-400 hover:text-gray-600 hover:bg-gray-100': project.color && !isDarkColor(project.color)
          }"
          title="View project"
        >
          <Icon name="lucide:eye" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('edit', project)"
          class="p-2 rounded-md transition-colors"
          :class="{
            'text-gray-400 hover:text-gray-600 hover:bg-gray-100': !project.color,
            'text-white/70 hover:text-white hover:bg-white/10': project.color && isDarkColor(project.color),
            'text-gray-400 hover:text-gray-600 hover:bg-gray-100': project.color && !isDarkColor(project.color)
          }"
          title="Edit project"
        >
          <Icon name="lucide:edit" class="w-4 h-4" />
        </button>
        <button
          @click="$emit('delete', project)"
          class="p-2 rounded-md transition-colors"
          :class="{
            'text-gray-400 hover:text-red-600 hover:bg-red-50': !project.color,
            'text-white/70 hover:text-red-300 hover:bg-red-500/20': project.color && isDarkColor(project.color),
            'text-gray-400 hover:text-red-600 hover:bg-red-50': project.color && !isDarkColor(project.color)
          }"
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

// Function to determine if a color is dark (for text contrast)
function isDarkColor(color: string): boolean {
  // Remove # if present
  const hex = color.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return true if color is dark (luminance < 0.5)
  return luminance < 0.5
}

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
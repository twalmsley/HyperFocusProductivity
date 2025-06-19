<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-[var(--primary)]">{{ projects.length }}</div>
        <div class="text-sm text-gray-600">Total Projects</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ totalTasks }}</div>
        <div class="text-sm text-gray-600">Total Tasks</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ averageTasksPerProject }}</div>
        <div class="text-sm text-gray-600">Avg Tasks/Project</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '~/types/project'

interface Props {
  projects: Project[]
}

const props = defineProps<Props>()

const totalTasks = computed(() => {
  return props.projects.reduce((sum, project) => sum + (project._count?.tasks || 0), 0)
})

const averageTasksPerProject = computed(() => {
  if (props.projects.length === 0) return 0
  return Math.round((totalTasks.value / props.projects.length) * 10) / 10
})
</script> 
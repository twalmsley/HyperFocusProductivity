<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
    <div class="grid grid-cols-1 sm:grid-cols-5 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-[var(--primary)]">{{ projects.length }}</div>
        <div class="text-sm text-gray-600">Total Projects</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-500">{{ stateCounts.noTasks }}</div>
        <div class="text-sm text-gray-600">No Tasks</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-yellow-600">{{ stateCounts.notStarted }}</div>
        <div class="text-sm text-gray-600">Not Started</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-blue-600">{{ stateCounts.inProgress }}</div>
        <div class="text-sm text-gray-600">In Progress</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ stateCounts.completed }}</div>
        <div class="text-sm text-gray-600">Completed</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '~/types/project'
import { getProjectState } from '~/utils/projectFilters'

interface Props {
  projects: Project[]
}

const props = defineProps<Props>()

const stateCounts = computed(() => {
  const counts = {
    noTasks: 0,
    notStarted: 0,
    inProgress: 0,
    completed: 0
  }
  
  props.projects.forEach(project => {
    const state = getProjectState(project)
    switch (state) {
      case 'No Tasks':
        counts.noTasks++
        break
      case 'Not Started':
        counts.notStarted++
        break
      case 'In Progress':
        counts.inProgress++
        break
      case 'Completed':
        counts.completed++
        break
    }
  })
  
  return counts
})
</script> 
<template>
  <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
    <div class="flex flex-wrap gap-4 items-end">
      <!-- Search by title/notes -->
      <div class="flex-1 min-w-[200px]">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <input id="search" v-model="filters.search" type="text" placeholder="Search in title & notes" maxlength="200"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
      </div>

      <!-- Status filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" @click="filters.status = ''"
            :class="[
              'px-4 py-2 text-sm font-medium border border-gray-300',
              filters.status === '' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-l-md'
            ]">
            All
          </button>
          <button type="button" @click="filters.status = 'BACKLOG'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.status === 'BACKLOG' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            Backlog
          </button>
          <button type="button" @click="filters.status = 'IN_PROGRESS'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.status === 'IN_PROGRESS' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            In Progress
          </button>
          <button type="button" @click="filters.status = 'DONE'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.status === 'DONE' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-r-md'
            ]">
            Done
          </button>
        </div>
      </div>

      <!-- Priority filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" @click="filters.priority = ''"
            :class="[
              'px-4 py-2 text-sm font-medium border border-gray-300',
              filters.priority === '' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-l-md'
            ]">
            All
          </button>
          <button type="button" @click="filters.priority = 'URGENT'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.priority === 'URGENT' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            Urgent
          </button>
          <button type="button" @click="filters.priority = 'HIGH'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.priority === 'HIGH' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            High
          </button>
          <button type="button" @click="filters.priority = 'MEDIUM'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.priority === 'MEDIUM' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            Medium
          </button>
          <button type="button" @click="filters.priority = 'LOW'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.priority === 'LOW' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-r-md'
            ]">
            Low
          </button>
        </div>
      </div>

      <!-- Project filter -->
      <div>
        <label for="projectFilter" class="block text-sm font-medium text-gray-700 mb-1">Project</label>
        <select
          id="projectFilter"
          v-model="filters.projectId"
          class="rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
        >
          <option value="">All Projects</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>
      </div>

      <!-- Due date filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
        <div class="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" @click="filters.dueDate = ''"
            :class="[
              'px-4 py-2 text-sm font-medium border border-gray-300',
              filters.dueDate === '' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-l-md'
            ]">
            All
          </button>
          <button type="button" @click="filters.dueDate = 'overdue'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.dueDate === 'overdue' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            Overdue
          </button>
          <button type="button" @click="filters.dueDate = 'today'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.dueDate === 'today' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            Today
          </button>
          <button type="button" @click="filters.dueDate = 'tomorrow'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.dueDate === 'tomorrow' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            Tomorrow
          </button>
          <button type="button" @click="filters.dueDate = 'week'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.dueDate === 'week' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
            ]">
            This Week
          </button>
          <button type="button" @click="filters.dueDate = 'month'"
            :class="[
              'px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-300',
              filters.dueDate === 'month' ? 'bg-[var(--primary)] text-white' : 'bg-white text-gray-700 hover:bg-gray-50',
              'rounded-r-md'
            ]">
            This Month
          </button>
          
        </div>
      </div>

      <!-- Clear filters button -->
      <button @click="clearFilters"
        class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Project } from '~/types/project'
import type { TaskFilters } from '~/utils/taskFilters'

const emit = defineEmits(['update:filters'])

const STORAGE_KEY = 'task-filters'

const filters = ref<TaskFilters>({
  search: '',
  status: '',
  priority: '',
  dueDate: '',
  projectId: ''
})

const projects = ref<Project[]>([])

// Load filters from local storage on mount
onMounted(async () => {
  await fetchProjects()
  
  const savedFilters = localStorage.getItem(STORAGE_KEY)
  if (savedFilters) {
    try {
      const parsedFilters = JSON.parse(savedFilters)
      filters.value = {
        ...filters.value,
        ...parsedFilters
      }
    } catch (e) {
      console.error('Failed to parse saved filters:', e)
    }
  }
})

async function fetchProjects() {
  try {
    const { getSession } = useAuth()
    const userSession = await getSession()
    const user = userSession?.user
    
    if (user) {
      const response = await $fetch<Project[]>(`/api/projects?userId=${user.id}`)
      projects.value = response
    }
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}

// Watch for changes in filters and emit them
watch(filters, (newFilters) => {
  emit('update:filters', newFilters)
  // Save to local storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters))
}, { deep: true })

// Clear all filters
function clearFilters() {
  filters.value = {
    search: '',
    status: '',
    priority: '',
    dueDate: '',
    projectId: ''
  }
  // Remove from local storage
  localStorage.removeItem(STORAGE_KEY)
}
</script> 
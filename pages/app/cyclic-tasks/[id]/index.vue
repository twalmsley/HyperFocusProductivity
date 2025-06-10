<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <NuxtLink 
              to="/app/cyclic-tasks" 
              class="text-gray-600 hover:text-gray-900 mr-4"
            >
              ← Back
            </NuxtLink>
            <h1 class="text-3xl font-bold">{{ task?.title || 'Loading...' }}</h1>
          </div>
          <div class="flex justify-end space-x-4 mt-6">
            <button
              @click="markAsCompleted"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--button-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              title="Mark as completed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Mark Complete
            </button>
            <NuxtLink
              :to="`/app/cyclic-tasks/${taskId}/edit`"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--button-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
              title="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit
            </NuxtLink>
            <button
              @click="deleteTask"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              Delete
            </button>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
        </div>

        <div v-else-if="!task" class="text-center py-12 text-gray-500">
          Task not found
        </div>

        <div v-else class="bg-white p-6 rounded-lg shadow-sm">
          <div class="space-y-6">
            <div>
              <h2 class="text-sm font-medium text-gray-500">Group</h2>
              <p class="mt-1 text-lg text-gray-900">{{ task.groupName }}</p>
            </div>

            <div>
              <h2 class="text-sm font-medium text-gray-500">Description</h2>
              <p class="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{{ task.description || 'No description' }}</p>
            </div>

            <div>
              <h2 class="text-sm font-medium text-gray-500">Last Completed</h2>
              <p class="mt-1 text-lg text-gray-900">
                {{ task.lastCompletedDate ? formatDate(task.lastCompletedDate) : 'Never' }}
              </p>
            </div>

            <div>
              <h2 class="text-sm font-medium text-gray-500">Created</h2>
              <p class="mt-1 text-lg text-gray-900">{{ formatDate(task.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'

const route = useRoute()
const taskId = route.params.id

const task = ref(null)
const isLoading = ref(true)

// Format date
const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy')
}

// Fetch task details
const fetchTask = async () => {
  try {
    const response = await fetch(`/api/cyclic-tasks/${taskId}`)
    if (!response.ok) throw new Error('Failed to fetch task')
    task.value = await response.json()
  } catch (error) {
    console.error('Error fetching task:', error)
    alert('Failed to load task details')
  } finally {
    isLoading.value = false
  }
}

// Mark task as completed
const markAsCompleted = async () => {
  try {
    const response = await fetch(`/api/cyclic-tasks/${taskId}/complete`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to mark task as completed')
    await fetchTask() // Refresh the task details
  } catch (error) {
    console.error('Error marking task as completed:', error)
    alert('Failed to mark task as completed')
  }
}

// Delete task
const deleteTask = async () => {
  if (!confirm('Are you sure you want to delete this task?')) return
  
  try {
    const response = await fetch(`/api/cyclic-tasks/${taskId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete task')
    navigateTo('/app/cyclic-tasks')
  } catch (error) {
    console.error('Error deleting task:', error)
    alert('Failed to delete task')
  }
}

// Fetch task on component mount
onMounted(() => {
  fetchTask()
})
</script> 
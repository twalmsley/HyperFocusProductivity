<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center mb-6">
          <NuxtLink 
            to="/app/cyclic-tasks" 
            class="text-gray-600 hover:text-gray-900 mr-4"
          >
            ← Back
          </NuxtLink>
          <h1 class="text-3xl font-bold">New Cyclic Task</h1>
        </div>

        <form @submit.prevent="createTask" class="bg-white p-6 rounded-lg shadow-sm">
          <div class="space-y-4">
            <div>
              <label for="groupName" class="block text-sm font-medium text-gray-700">Group Name</label>
              <input
                id="groupName"
                v-model="task.groupName"
                type="text"
                list="groupNames"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <datalist id="groupNames">
                <option v-for="group in groupNames" :key="group" :value="group" />
              </datalist>
            </div>

            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                v-model="task.title"
                type="text"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                v-model="task.description"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              ></textarea>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Creating...' : 'Create Task' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const task = ref({
  groupName: '',
  title: '',
  description: ''
})

const isSubmitting = ref(false)
const groupNames = ref<string[]>([])

// Fetch existing group names
const fetchGroupNames = async () => {
  try {
    const response = await fetch('/api/cyclic-tasks/groups')
    if (!response.ok) throw new Error('Failed to fetch group names')
    groupNames.value = await response.json()
  } catch (error) {
    console.error('Error fetching group names:', error)
  }
}

const createTask = async () => {
  isSubmitting.value = true
  try {
    const response = await fetch('/api/cyclic-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task.value)
    })

    if (!response.ok) throw new Error('Failed to create task')

    // Redirect to the tasks list
    navigateTo('/app/cyclic-tasks')
  } catch (error) {
    console.error('Error creating task:', error)
    alert('Failed to create task. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Fetch group names on component mount
onMounted(() => {
  fetchGroupNames()
})
</script> 
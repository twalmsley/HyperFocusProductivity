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
          <h1 class="text-3xl font-bold">Edit Cyclic Task</h1>
        </div>

        <div v-if="isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
        </div>

        <form v-else @submit.prevent="updateTask" class="bg-white p-6 rounded-lg shadow-sm">
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

            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="navigateTo('/app/cyclic-tasks')"
                class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const taskId = route.params.id

const task = ref({
  groupName: '',
  title: '',
  description: ''
})

const isLoading = ref(true)
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

// Fetch task details
const fetchTask = async () => {
  try {
    const response = await fetch(`/api/cyclic-tasks/${taskId}`)
    if (!response.ok) throw new Error('Failed to fetch task')
    const data = await response.json()
    task.value = data
  } catch (error) {
    console.error('Error fetching task:', error)
    alert('Failed to load task details')
  } finally {
    isLoading.value = false
  }
}

// Update task
const updateTask = async () => {
  isSubmitting.value = true
  try {
    const response = await fetch(`/api/cyclic-tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task.value)
    })

    if (!response.ok) throw new Error('Failed to update task')

    // Redirect to the tasks list
    navigateTo('/app/cyclic-tasks')
  } catch (error) {
    console.error('Error updating task:', error)
    alert('Failed to update task. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Fetch task and group names on component mount
onMounted(async () => {
  await Promise.all([fetchTask(), fetchGroupNames()])
})
</script> 
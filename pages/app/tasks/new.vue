<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center mb-6">
          <NuxtLink 
            to="/app/tasks" 
            class="text-gray-600 hover:text-gray-900 mr-4"
          >
            ← Back
          </NuxtLink>
          <h1 class="text-3xl font-bold">New Task</h1>
        </div>

        <form @submit.prevent="createTask" class="bg-white p-6 rounded-lg shadow-sm">
          <div class="space-y-4">
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
              <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                v-model="task.notes"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              ></textarea>
            </div>

            <div>
              <label for="estimatedPomodoros" class="block text-sm font-medium text-gray-700">Estimated Pomodoros</label>
              <input
                id="estimatedPomodoros"
                v-model.number="task.estimatedPomodoros"
                type="number"
                min="1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                v-model="task.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div class="flex justify-end">
              <button
                type="submit"
                class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const user = ref<{
  id: string;
  email: string;
  name: string | null;
  subscription: {
    type: string | null;
    status: string;
    freeTrialExpiresAt: string;
    currentPeriodStart: string | null;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
} | null>(null)
const router = useRouter()

const task = ref({
  title: '',
  notes: '',
  estimatedPomodoros: 1,
  status: 'BACKLOG'
})

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/me')
    user.value = response
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

async function createTask() {
  if (!user.value) {
    console.error('User not found')
    return
  }

  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: {
        userId: user.value.id,
        ...task.value
      }
    })
    
    // Redirect to tasks list after successful creation
    router.push('/app/tasks')
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}
</script> 
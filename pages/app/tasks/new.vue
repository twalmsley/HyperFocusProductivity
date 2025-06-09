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
                maxlength="200"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                v-model="task.status"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              >
                <option value="BACKLOG">Backlog</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                v-model="task.priority"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              >
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                id="notes"
                v-model="task.notes"
                rows="3"
                required
                maxlength="2000"
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
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                id="dueDate"
                v-model="task.dueDate"
                type="date"
                required
                pattern="\d{4}-\d{2}-\d{2}"
                placeholder="YYYY-MM-DD"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
              />
            </div>

            <!-- Repeat Schedule -->
            <RepeatScheduleSelector v-model="repeatSchedule" />

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
import RepeatScheduleSelector from '~/components/tasks/RepeatScheduleSelector.vue'
import type { RepeatSchedule } from '~/types/task'

const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()

const userSession = await getSession()
const user = userSession?.user
const router = useRouter()

interface NewTask {
  title: string;
  notes: string;
  estimatedPomodoros: number;
  status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
}

const task = ref<NewTask>({
  title: '',
  notes: '',
  estimatedPomodoros: 1,
  status: 'BACKLOG',
  priority: 'MEDIUM',
  dueDate: new Date().toISOString().substring(0, 10)
})

const repeatSchedule = ref<RepeatSchedule>({
  repeatType: null
})

async function createTask() {
  if (!user) {
    console.error('User not found')
    return
  }

  // Check that all required fields are filled
  if (!task.value.title || !task.value.notes || !task.value.estimatedPomodoros || !task.value.status || !task.value.dueDate) {
    console.error('All fields are required')
    return
  }

  try {
    // Ensure date is in ISO format
    const dueDate = task.value.dueDate ? new Date(task.value.dueDate).toISOString() : null;
    
    const requestBody: any = {
      userId: user.id,
      ...task.value,
      dueDate: dueDate
    }

    // Add repeat schedule fields if present
    if (repeatSchedule.value.repeatType) {
      requestBody.repeatType = repeatSchedule.value.repeatType
      requestBody.repeatInterval = repeatSchedule.value.repeatInterval
      requestBody.repeatDays = repeatSchedule.value.repeatDays
      requestBody.repeatMonth = repeatSchedule.value.repeatMonth
      requestBody.repeatDay = repeatSchedule.value.repeatDay
      requestBody.repeatWeekOfMonth = repeatSchedule.value.repeatWeekOfMonth
      requestBody.repeatDayOfWeek = repeatSchedule.value.repeatDayOfWeek
    }
    
    await $fetch('/api/tasks', {
      method: 'POST',
      body: requestBody
    })
    
    // Redirect to tasks list after successful creation
    router.push('/app/tasks')
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}
</script> 
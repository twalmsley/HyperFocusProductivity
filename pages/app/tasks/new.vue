<template>
  <div class="min-h-screen bg-gray-50">
    <main class="py-10">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <form @submit.prevent="createTask" class="space-y-8 divide-y divide-gray-200">
          <div class="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">Create New Task</h3>
                <p class="mt-1 text-sm text-gray-500">Fill in the details below to create a new task.</p>
              </div>

              <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <!-- Title -->
                <div class="sm:col-span-4">
                  <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
                  <div class="mt-1">
                    <input
                      id="title"
                      v-model="task.title"
                      type="text"
                      maxlength="200"
                      required
                      class="shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <!-- Priority -->
                <div class="sm:col-span-3">
                  <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    id="priority"
                    v-model="task.priority"
                    required
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] sm:text-sm rounded-md"
                  >
                    <option value="URGENT">Urgent</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <!-- Notes -->
                <div class="sm:col-span-6">
                  <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                  <div class="mt-1">
                    <textarea
                      id="notes"
                      v-model="task.notes"
                      rows="3"
                      maxlength="2000"
                      required
                      class="shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  </div>
                </div>

                <!-- Estimated Pomodoros -->
                <div class="sm:col-span-3">
                  <label for="estimatedPomodoros" class="block text-sm font-medium text-gray-700">Estimated Pomodoros</label>
                  <div class="mt-1">
                    <input
                      id="estimatedPomodoros"
                      v-model.number="task.estimatedPomodoros"
                      type="number"
                      min="1"
                      required
                      class="shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <!-- Due Date -->
                <div class="sm:col-span-3">
                  <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
                  <div class="mt-1">
                    <input
                      id="dueDate"
                      v-model="task.dueDate"
                      type="date"
                      required
                      pattern="\d{4}-\d{2}-\d{2}"
                      placeholder="YYYY-MM-DD"
                      class="shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <!-- Repeat Schedule -->
                <div class="sm:col-span-6">
                  <RepeatScheduleSelector v-model="repeatSchedule" />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-5">
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
      requestBody.isTemplate = true // Set isTemplate to true for repeating tasks
    }
    
    const response = await $fetch('/api/tasks', {
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
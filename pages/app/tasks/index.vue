<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Tasks</h1>
        <NuxtLink 
          to="/app/tasks/new" 
          class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
        >
          New Task
        </NuxtLink>
      </div>
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="tasks.length === 0" class="p-6 text-gray-600">
          <p>Your tasks will appear here.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pomodoros</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ task.title }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': task.status === 'BACKLOG',
                    'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS',
                    'bg-green-100 text-green-800': task.status === 'DONE'
                  }"
                >
                  {{ task.status.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ task.estimatedPomodoros || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ new Date(task.createdAt).toLocaleDateString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '-' }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 max-w-xs truncate">
                  {{ task.notes || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="updateTaskStatus(task)"
                  class="text-[var(--primary)] hover:text-[var(--button-hover)] mr-4"
                >
                  <span v-if="task.status === 'BACKLOG'">Start</span>
                  <span v-else-if="task.status === 'IN_PROGRESS'">Complete</span>
                  <span v-else>Reopen</span>
                </button>
                <button 
                  @click="deleteTask(task.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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

type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE'

const tasks = ref<Array<{
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  estimatedPomodoros: number | null;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
  dueDate: string | null;
  position: number | null;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    proStatus: boolean;
  };
  sessions: Array<{
    id: string;
    userId: string;
    taskId: string | null;
    type: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';
    startTime: string;
    endTime: string;
    durationMinutes: number;
    notes: string | null;
  }>;
}>>([])

// Fetch user data and tasks on component mount
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/me')
    user.value = response
    
    if (user.value) {
      const tasksResponse = await $fetch('/api/tasks', {
        query: {
          userId: user.value.id
        }
      }) as typeof tasks.value
      tasks.value = tasksResponse
    }
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
})

async function updateTaskStatus(task: typeof tasks.value[0]) {
  if (!user.value) return

  try {
    const newStatus = task.status === 'BACKLOG' 
      ? 'IN_PROGRESS' 
      : task.status === 'IN_PROGRESS' 
        ? 'DONE' 
        : 'BACKLOG'

    const updatedTask = await $fetch('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        status: newStatus,
        completedAt: newStatus === 'DONE' ? new Date().toISOString() : null
      }
    }) as typeof tasks.value[0]

    const index = tasks.value.findIndex(t => t.id === task.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

async function deleteTask(taskId: string) {
  if (!user.value) return

  try {
    await $fetch('/api/tasks', {
      method: 'DELETE',
      query: {
        id: taskId
      }
    })
    
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}
</script> 
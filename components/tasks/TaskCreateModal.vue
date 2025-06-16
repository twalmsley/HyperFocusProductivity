<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <h3 class="text-xl font-medium text-gray-900">Create New Task</h3>
    </template>

    <form @submit.prevent="createTask" class="space-y-6">
      <!-- Title -->
      <div>
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
      <div>
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
      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <div class="mt-1">
          <textarea
            id="notes"
            v-model="task.notes"
            rows="3"
            maxlength="2000"
            class="shadow-sm focus:ring-[var(--primary)] focus:border-[var(--primary)] block w-full sm:text-sm border-gray-300 rounded-md"
          ></textarea>
        </div>
      </div>

      <!-- Estimated Pomodoros -->
      <div>
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
      <div>
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
      <div>
        <RepeatScheduleSelector v-model="repeatSchedule" />
      </div>

      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
        >
          Create Task
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '~/components/BaseModal.vue'
import RepeatScheduleSelector from '~/components/tasks/RepeatScheduleSelector.vue'
import type { RepeatSchedule } from '~/types/task'

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'created'): void;
}>();

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

const {
  getSession,
} = useAuth()

async function createTask() {
  const userSession = await getSession()
  const user = userSession?.user

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
    
    await $fetch('/api/tasks', {
      method: 'POST',
      body: requestBody
    })
    
    // Reset form
    task.value = {
      title: '',
      notes: '',
      estimatedPomodoros: 1,
      status: 'BACKLOG',
      priority: 'MEDIUM',
      dueDate: new Date().toISOString().substring(0, 10)
    }
    repeatSchedule.value = { repeatType: null }
    
    // Emit created event and close modal
    emit('created')
    emit('close')
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}
</script> 
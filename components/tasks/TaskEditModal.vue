<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white/95 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-medium text-gray-900">Edit Task</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSave" class="space-y-4">
        <!-- Title -->
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input id="title" v-model="task.title" type="text" required maxlength="200"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
          <select id="status" v-model="task.status" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
            <option value="BACKLOG">Backlog</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <!-- Priority -->
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700">Priority</label>
          <select id="priority" v-model="task.priority" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]">
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
          <textarea id="notes" v-model="task.notes" rows="4" maxlength="2000"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"></textarea>
        </div>

        <!-- Estimated Pomodoros -->
        <div>
          <label for="estimatedPomodoros" class="block text-sm font-medium text-gray-700">Estimated Pomodoros</label>
          <input id="estimatedPomodoros" v-model.number="task.estimatedPomodoros" type="number" min="0"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
        </div>

        <!-- Due Date -->
        <div>
          <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
          <input id="dueDate" v-model="task.dueDate" type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
        </div>

        <!-- Repeat Schedule -->
        <RepeatScheduleSelector v-model="repeatSchedule" />

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 mt-6">
          <button type="button" @click="$emit('close')"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit"
            class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RepeatScheduleSelector from './RepeatScheduleSelector.vue'
import type { Task, RepeatSchedule } from '~/types/task'

const props = defineProps<{
  show: boolean;
  task: Task;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', task: Task & { repeatSchedule: RepeatSchedule }): void;
}>()

// Create a local copy of the task to avoid direct mutation
const task = ref<Task>({ ...props.task })

// Initialize repeat schedule from task data
const repeatSchedule = ref<RepeatSchedule>({
  repeatType: props.task.repeatType,
  repeatInterval: props.task.repeatInterval || undefined,
  repeatDays: parseRepeatDays(props.task.repeatDays),
  repeatMonth: props.task.repeatMonth || undefined,
  repeatDay: props.task.repeatDay || undefined,
  repeatWeekOfMonth: props.task.repeatWeekOfMonth || undefined,
  repeatDayOfWeek: props.task.repeatDayOfWeek || undefined
})

// Helper function to safely parse repeat days
function parseRepeatDays(repeatDays: string | null): number[] | undefined {
  if (!repeatDays) return undefined
  try {
    return JSON.parse(repeatDays)
  } catch {
    return undefined
  }
}

// Watch for changes in the task prop
watch(() => props.task, (newTask) => {
  task.value = { ...newTask }
  
  // Update repeat schedule
  repeatSchedule.value = {
    repeatType: newTask.repeatType,
    repeatInterval: newTask.repeatInterval || undefined,
    repeatDays: parseRepeatDays(newTask.repeatDays),
    repeatMonth: newTask.repeatMonth || undefined,
    repeatDay: newTask.repeatDay || undefined,
    repeatWeekOfMonth: newTask.repeatWeekOfMonth || undefined,
    repeatDayOfWeek: newTask.repeatDayOfWeek || undefined
  }
}, { deep: true })

function handleSave() {
  emit('save', { 
    ...task.value, 
    repeatSchedule: repeatSchedule.value 
  })
}
</script> 
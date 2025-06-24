<template>
  <div class="task-calendar">
    <!-- Calendar Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <button
          @click="previousMonth"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-2xl font-bold">{{ currentMonthYear }}</h2>
        <button
          @click="nextMonth"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <button
        @click="goToToday"
        class="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-colors"
      >
        Today
      </button>
    </div>

    <!-- Calendar Grid -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Day Headers -->
      <div class="grid grid-cols-7 bg-gray-50 border-b hidden md:grid">
        <div
          v-for="day in weekDays"
          :key="day"
          class="p-3 text-center text-sm font-medium text-gray-500"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-1 md:grid-cols-7">
        <div
          v-for="day in calendarDays"
          :key="day.date"
          :class="[
            'min-h-[120px] p-2 border-r border-b border-gray-200 relative',
            {
              'bg-gray-50': !day.isCurrentMonth,
              'bg-blue-50': day.isToday,
              'hover:bg-gray-50': day.isCurrentMonth,
              'border-r-0': true // Remove right border on mobile
            }
          ]"
          @dragover="handleDragOverWithDate($event, day.date)"
          @drop="handleDrop($event, day.date)"
        >
          <!-- Date Number with day name on mobile -->
          <div
            :class="[
              'text-sm font-medium mb-2 flex items-center',
              {
                'text-gray-400': !day.isCurrentMonth,
                'text-blue-600 bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center': day.isToday,
                'text-gray-900': day.isCurrentMonth && !day.isToday
              }
            ]"
          >
            <span class="md:hidden mr-2 text-xs text-gray-500 font-normal">
              {{ format(day.date, 'EEE') }}
            </span>
            {{ day.dayNumber }}
          </div>

          <!-- Tasks for this day -->
          <div class="space-y-1">
            <div
              v-for="task in getTasksForDate(day.date)"
              :key="task.id"
              :draggable="true"
              @dragstart="handleDragStart($event, task)"
              @click="viewTask(task)"
              :class="[
                'p-2 rounded text-xs cursor-pointer transition-all duration-200 hover:shadow-md',
                getTaskStatusClass(task.status),
                getTaskPriorityClass(task.priority)
              ]"
            >
              <div class="font-medium truncate">{{ task.title }}</div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-xs opacity-75">
                  {{ task.estimatedPomodoros }}🍅
                </span>
                <div class="flex space-x-1">
                  <button
                    @click.stop="updateTaskStatus(task)"
                    :class="[
                      'w-4 h-4 rounded-full border-2 transition-colors',
                      getStatusButtonClass(task.status)
                    ]"
                    :title="getStatusTitle(task.status)"
                  />
                  <button
                    @click.stop="startPomodoro(task)"
                    class="text-xs opacity-75 hover:opacity-100"
                    title="Start Pomodoro"
                  >
                    ▶️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Drop indicator -->
          <div
            v-if="dragOverDate === day.date"
            class="absolute inset-0 border-2 border-dashed border-[var(--primary)] bg-[var(--primary)]/10 pointer-events-none"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns'
import type { Task } from '~/types/task'

const props = defineProps<{
  tasks: Task[]
}>()

const emit = defineEmits<{
  (e: 'view', task: Task): void
  (e: 'update-status', task: Task): void
  (e: 'start-pomodoro', task: Task): void
  (e: 'update-due-date', task: Task, newDate: Date): void
}>()

const currentDate = ref(new Date())
const dragOverDate = ref<Date | null>(null)
const draggedTask = ref<Task | null>(null)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  return format(currentDate.value, 'MMMM yyyy')
})

const calendarDays = computed(() => {
  const start = startOfWeek(startOfMonth(currentDate.value))
  const end = endOfWeek(endOfMonth(currentDate.value))
  const days = eachDayOfInterval({ start, end })

  return days.map(date => ({
    date,
    dayNumber: format(date, 'd'),
    isCurrentMonth: isSameMonth(date, currentDate.value),
    isToday: isToday(date)
  }))
})

function previousMonth() {
  currentDate.value = subMonths(currentDate.value, 1)
}

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1)
}

function goToToday() {
  currentDate.value = new Date()
}

function getTasksForDate(date: Date): Task[] {
  return props.tasks.filter(task => {
    if (!task.dueDate) return false
    return isSameDay(new Date(task.dueDate), date)
  })
}

function getTaskStatusClass(status: string): string {
  switch (status) {
    case 'BACKLOG':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'DONE':
      return 'bg-green-100 text-green-800 border border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

function getTaskPriorityClass(priority: string): string {
  switch (priority) {
    case 'URGENT':
      return 'border-l-4 border-l-red-500'
    case 'HIGH':
      return 'border-l-4 border-l-orange-500'
    case 'MEDIUM':
      return 'border-l-4 border-l-yellow-500'
    case 'LOW':
      return 'border-l-4 border-l-green-500'
    default:
      return ''
  }
}

function getStatusButtonClass(status: string): string {
  switch (status) {
    case 'BACKLOG':
      return 'border-yellow-400 bg-yellow-100'
    case 'IN_PROGRESS':
      return 'border-blue-400 bg-blue-100'
    case 'DONE':
      return 'border-green-400 bg-green-100'
    default:
      return 'border-gray-400 bg-gray-100'
  }
}

function getStatusTitle(status: string): string {
  switch (status) {
    case 'BACKLOG':
      return 'Mark as In Progress'
    case 'IN_PROGRESS':
      return 'Mark as Done'
    case 'DONE':
      return 'Mark as Backlog'
    default:
      return 'Change Status'
  }
}

function handleDragStart(event: DragEvent, task: Task) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', task.id)
    draggedTask.value = task
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'move'
}

function handleDrop(event: DragEvent, targetDate: Date) {
  event.preventDefault()
  
  if (!draggedTask.value) return

  // Don't allow dropping on the same date
  if (draggedTask.value.dueDate && isSameDay(new Date(draggedTask.value.dueDate), targetDate)) {
    return
  }

  emit('update-due-date', draggedTask.value, targetDate)
  dragOverDate.value = null
  draggedTask.value = null
}

function viewTask(task: Task) {
  emit('view', task)
}

function updateTaskStatus(task: Task) {
  emit('update-status', task)
}

function startPomodoro(task: Task) {
  emit('start-pomodoro', task)
}

// Watch for drag over to show drop indicator
const handleDragOverWithDate = (event: DragEvent, date: Date) => {
  handleDragOver(event)
  dragOverDate.value = date
}

// Clear drag over when leaving calendar
const handleDragLeave = () => {
  dragOverDate.value = null
}

onMounted(() => {
  document.addEventListener('dragleave', handleDragLeave)
})
</script>

<style scoped>
.task-calendar {
  @apply w-full;
}

/* Custom scrollbar for task lists */
.task-calendar ::-webkit-scrollbar {
  width: 4px;
}

.task-calendar ::-webkit-scrollbar-track {
  background: transparent;
}

.task-calendar ::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}

.task-calendar ::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* Responsive design for mobile */
@media (max-width: 768px) {
  .task-calendar .min-h-\[120px\] {
    min-height: 80px;
  }
  
  .task-calendar .text-xs {
    font-size: 10px;
  }
}

/* Smooth transitions for drag and drop */
.task-calendar [draggable="true"] {
  transition: all 0.2s ease-in-out;
}

.task-calendar [draggable="true"]:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Drop zone highlighting */
.task-calendar .border-dashed {
  transition: all 0.2s ease-in-out;
}

/* Task card hover effects */
.task-calendar .p-2.rounded {
  transition: all 0.2s ease-in-out;
}

.task-calendar .p-2.rounded:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style> 
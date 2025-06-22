<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Project Details</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="lucide:x" class="w-5 h-5" />
          </button>
        </div>

        <div v-if="project" class="space-y-6">
          <!-- Project Header -->
          <div class="flex items-center gap-3">
            <div 
              v-if="project.color" 
              class="w-6 h-6 rounded-full flex-shrink-0"
              :style="{ backgroundColor: project.color }"
            ></div>
            <h3 class="text-2xl font-bold text-gray-900">{{ project.name }}</h3>
          </div>

          <!-- Project Description -->
          <div v-if="project.description">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
            <p class="text-gray-600 whitespace-pre-wrap">{{ project.description }}</p>
          </div>

          <!-- Project Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-[var(--primary)]">{{ totalTasks }}</div>
              <div class="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ completedTasks }}</div>
              <div class="text-sm text-gray-600">Completed</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ inProgressTasks }}</div>
              <div class="text-sm text-gray-600">In Progress</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">{{ backlogTasks }}</div>
              <div class="text-sm text-gray-600">Backlog</div>
            </div>
          </div>

          <!-- Project Tasks Section -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-medium text-gray-900">Tasks</h4>
              <div class="flex items-center gap-2">
                <button
                  @click="showCreateTaskModal = true"
                  class="px-3 py-1 text-sm bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)] transition-colors"
                >
                  <Icon name="lucide:plus" class="w-4 h-4 mr-1" />
                  Add Task
                </button>
                <button
                  @click="refreshTasks"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  :disabled="isLoadingTasks"
                >
                  <Icon name="lucide:refresh-cw" class="w-4 h-4" :class="{ 'animate-spin': isLoadingTasks }" />
                </button>
                <NuxtLink
                  :to="`/app/tasks?project=${project.id}`"
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  View All Tasks
                </NuxtLink>
              </div>
            </div>

            <!-- Task Cards -->
            <div v-if="isLoadingTasks" class="flex justify-center py-8">
              <div class="text-gray-500">Loading tasks...</div>
            </div>
            <div v-else-if="projectTasks.length === 0" class="text-center py-8 text-gray-500">
              <Icon name="lucide:list-todo" class="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No tasks in this project yet.</p>
              <button
                @click="showCreateTaskModal = true"
                class="inline-block mt-2 px-4 py-2 text-sm bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)] transition-colors"
              >
                Create First Task
              </button>
            </div>
            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <TaskCard
                v-for="task in projectTasks"
                :key="task.id"
                :task="task"
                @view="viewTask"
                @edit="editTask"
                @delete="deleteTask"
                @update-status="updateTaskStatus"
                @start-pomodoro="startPomodoro"
                @extend-due-date="extendDueDate"
              />
            </div>
          </div>

          <!-- Project Metadata -->
          <div class="border-t pt-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">Created:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(project.createdAt) }}</span>
              </div>
              <div>
                <span class="text-gray-500">Last Updated:</span>
                <span class="ml-2 text-gray-900">{{ formatDate(project.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Task Modals -->
  <TaskViewModal v-if="showTaskViewModal" :show="showTaskViewModal" :task="selectedTask" @close="closeTaskViewModal" />
  <TaskEditModal v-if="showTaskEditModal && selectedTask" :show="showTaskEditModal" :task="selectedTask" @close="closeTaskEditModal" @save="saveTask" />
  <TaskDeleteModal v-if="showTaskDeleteModal" :show="showTaskDeleteModal" :task="selectedTask" @cancel="closeTaskDeleteModal" @confirm="confirmDeleteTask" />
  <TaskCreateModal v-if="showCreateTaskModal" :show="showCreateTaskModal" :preselected-project-id="project?.id" :preselected-project-name="project?.name" @close="closeCreateTaskModal" @created="handleTaskCreated" />
  <PomodoroTimer v-if="showPomodoroTimer" :total-rounds="selectedTask?.estimatedPomodoros || 1" :focus-duration="userSettings?.focusDuration || 25" :short-break-duration="userSettings?.shortBreakDuration || 5" :long-break-duration="userSettings?.longBreakDuration || 15" :long-break-interval="userSettings?.longBreakInterval || 4" :completed-pomodoros="selectedTask?.completedPomodoros || 0" @close="closePomodoroTimer" @update:completed-pomodoros="updateCompletedPomodoros" />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { Project } from '~/types/project'
import type { Task } from '~/types/task'
import TaskCard from '~/components/tasks/TaskCard.vue'
import TaskViewModal from '~/components/tasks/TaskViewModal.vue'
import TaskEditModal from '~/components/tasks/TaskEditModal.vue'
import TaskDeleteModal from '~/components/tasks/TaskDeleteModal.vue'
import TaskCreateModal from '~/components/tasks/TaskCreateModal.vue'
import PomodoroTimer from '~/components/PomodoroTimer.vue'

interface Props {
  show: boolean
  project: Project | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  projectUpdated: [project: Project]
}>()

const projectTasks = ref<Task[]>([])
const isLoadingTasks = ref(false)
const selectedTask = ref<Task | null>(null)

// Task modal states
const showTaskViewModal = ref(false)
const showTaskEditModal = ref(false)
const showTaskDeleteModal = ref(false)
const showPomodoroTimer = ref(false)
const showCreateTaskModal = ref(false)

// User settings for pomodoro
const userSettings = ref<{
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
} | null>(null)

const completedTasks = computed(() => {
  return projectTasks.value.filter(task => task.status === 'DONE').length
})

const inProgressTasks = computed(() => {
  return projectTasks.value.filter(task => task.status === 'IN_PROGRESS').length
})

const backlogTasks = computed(() => {
  return projectTasks.value.filter(task => task.status === 'BACKLOG').length
})

const totalTasks = computed(() => {
  return projectTasks.value.length
})

// Fetch tasks when project changes
watch(() => props.project, async (newProject) => {
  if (newProject) {
    await fetchProjectTasks()
  }
}, { immediate: true })

async function fetchProjectTasks() {
  if (!props.project) return

  isLoadingTasks.value = true
  try {
    const response = await $fetch<Task[]>(`/api/tasks?userId=${props.project.userId}&projectId=${props.project.id}`)
    projectTasks.value = response
  } catch (error) {
    console.error('Failed to fetch project tasks:', error)
  } finally {
    isLoadingTasks.value = false
  }
}

async function refreshTasks() {
  await fetchProjectTasks()
}

async function fetchUserSettings() {
  try {
    const response = await $fetch('/api/settings')
    userSettings.value = response || {
      focusDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4
    }
  } catch (error) {
    console.error('Failed to fetch user settings:', error)
  }
}

// Task event handlers
function viewTask(task: Task) {
  selectedTask.value = task
  showTaskViewModal.value = true
}

function closeTaskViewModal() {
  showTaskViewModal.value = false
  selectedTask.value = null
}

function editTask(task: Task) {
  selectedTask.value = task
  showTaskEditModal.value = true
}

function closeTaskEditModal() {
  showTaskEditModal.value = false
  selectedTask.value = null
}

async function saveTask(taskData: Task & { repeatSchedule: any }) {
  if (!selectedTask.value) {
    return
  }

  try {
    // Extract the task data and repeat schedule
    const { repeatSchedule, id, userId, createdAt, sessions, ...taskUpdate } = taskData
    
    // Prepare the request body with only updatable fields
    const requestBody: any = {
      id: selectedTask.value.id,
      title: taskUpdate.title,
      notes: taskUpdate.notes,
      estimatedPomodoros: taskUpdate.estimatedPomodoros,
      completedPomodoros: taskUpdate.completedPomodoros,
      status: taskUpdate.status,
      priority: taskUpdate.priority,
      projectId: taskUpdate.projectId,
      position: taskUpdate.position
    }

    // Convert due date to ISO string if it exists
    if (taskUpdate.dueDate) {
      requestBody.dueDate = new Date(taskUpdate.dueDate + 'T00:00:00.000Z').toISOString()
    }

    // Add repeat schedule fields if present
    if (repeatSchedule && repeatSchedule.repeatType) {
      requestBody.repeatType = repeatSchedule.repeatType
      requestBody.repeatInterval = repeatSchedule.repeatInterval
      requestBody.repeatDays = repeatSchedule.repeatDays
      requestBody.repeatMonth = repeatSchedule.repeatMonth
      requestBody.repeatDay = repeatSchedule.repeatDay
      requestBody.repeatWeekOfMonth = repeatSchedule.repeatWeekOfMonth
      requestBody.repeatDayOfWeek = repeatSchedule.repeatDayOfWeek
    }

    const updatedTask = await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: requestBody
    })

    // Update the task in the local state
    const index = projectTasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      projectTasks.value[index] = updatedTask
    }

    closeTaskEditModal()
    await refreshTasks() // Refresh to update counts
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

function deleteTask(task: Task) {
  selectedTask.value = task
  showTaskDeleteModal.value = true
}

function closeTaskDeleteModal() {
  showTaskDeleteModal.value = false
  selectedTask.value = null
}

async function confirmDeleteTask() {
  if (!selectedTask.value) return

  try {
    await $fetch('/api/tasks', {
      method: 'DELETE',
      query: {
        id: selectedTask.value.id
      }
    })

    projectTasks.value = projectTasks.value.filter(t => t.id !== selectedTask.value?.id)
    closeTaskDeleteModal()
    await refreshTasks() // Refresh to update counts
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}

async function updateTaskStatus(task: Task) {
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
    }) as Task

    // Update the task in the local state
    const index = projectTasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      projectTasks.value[index] = updatedTask
    }

    await refreshTasks() // Refresh to update counts
  } catch (error) {
    console.error('Failed to update task status:', error)
  }
}

function startPomodoro(task: Task) {
  selectedTask.value = task
  showPomodoroTimer.value = true
}

function closePomodoroTimer() {
  showPomodoroTimer.value = false
  selectedTask.value = null
}

async function updateCompletedPomodoros(value: number) {
  if (!selectedTask.value) return

  try {
    const updatedTask = await $fetch('/api/tasks', {
      method: 'PATCH',
      body: {
        id: selectedTask.value.id,
        completedPomodoros: value
      }
    }) as Task

    // Update the task in the local state
    const index = projectTasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      projectTasks.value[index] = updatedTask
    }
    selectedTask.value = updatedTask
  } catch (error) {
    console.error('Failed to update completed pomodoros:', error)
  }
}

async function extendDueDate(task: Task) {
  if (!task.dueDate) return

  try {
    const currentDueDate = new Date(task.dueDate)
    const newDueDate = new Date(currentDueDate)
    newDueDate.setDate(newDueDate.getDate() + 1)

    const updatedTask = await $fetch('/api/tasks', {
      method: 'PATCH',
      body: {
        id: task.id,
        dueDate: newDueDate.toISOString()
      }
    }) as Task

    // Update the task in the local state
    const index = projectTasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      projectTasks.value[index] = updatedTask
    }
  } catch (error) {
    console.error('Failed to extend due date:', error)
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function closeCreateTaskModal() {
  showCreateTaskModal.value = false
}

async function handleTaskCreated(createdTask: Task) {
  try {
    // Add the new task to the list
    projectTasks.value.push(createdTask)
    
    // Update the project data to reflect the new task
    if (props.project) {
      const updatedProject = { ...props.project }
      
      // Update the task count
      if (updatedProject._count) {
        updatedProject._count.tasks = (updatedProject._count.tasks || 0) + 1
      } else {
        updatedProject._count = { tasks: 1 }
      }
      
      // Add the new task to the tasks array if it exists
      if (updatedProject.tasks) {
        updatedProject.tasks.push({
          id: createdTask.id,
          title: createdTask.title,
          status: createdTask.status,
          priority: createdTask.priority,
          dueDate: createdTask.dueDate
        })
      }
      
      // Emit the updated project data
      emit('projectUpdated', updatedProject)
    }
    
    closeCreateTaskModal()
    // Refresh to update counts and ensure consistency
    await refreshTasks()
  } catch (error) {
    console.error('Failed to handle task creation:', error)
  }
}

onMounted(async () => {
  await fetchUserSettings()
})
</script> 
<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-center items-center mb-6 relative">
        <h1 class="text-3xl font-bold">Cyclic Tasks</h1>
        <button
          @click="showCreateModal = true"
          class="absolute right-0 bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
        >
          New Cyclic Task
        </button>
      </div>

      <!-- Task Groups -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
      </div>

      <div v-else-if="cyclicTasks.length === 0" class="text-center py-12 text-gray-500">
        No cyclic tasks found. Create your first one!
      </div>

      <div v-else class="space-y-6">
        <div v-for="group in groupedTasks" :key="group.name" class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="flex items-center justify-center p-4 border-b border-gray-200">
            <h2 class="text-xl font-semibold">{{ group.name }}</h2>
            <div class="flex items-center space-x-4 absolute right-25">
              <button
                @click="openCreateModal(group.name)"
                class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
                title="Add new task to this group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button 
                @click="toggleGroup(group.name)"
                class="text-gray-500 hover:text-gray-700 transition-colors"
                :title="isGroupExpanded(group.name) ? 'Collapse group' : 'Expand group'"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-6 w-6 transform transition-transform duration-200"
                  :class="{ 'rotate-180': isGroupExpanded(group.name) }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform -translate-y-2 opacity-0"
            enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform -translate-y-2 opacity-0"
          >
            <div v-show="isGroupExpanded(group.name)" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Completed</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="task in group.tasks" :key="task.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ task.title }}</td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{ task.description || '-' }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ task.lastCompletedDate ? formatDate(task.lastCompletedDate) : 'Never' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div class="flex items-center space-x-3">
                        <button
                          @click="viewTask(task)"
                          class="text-gray-400 hover:text-gray-600 transition-colors"
                          title="View details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        <button
                          @click="editTask(task)"
                          class="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit task"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button
                          @click="markAsCompleted(task)"
                          class="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Mark as completed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        <button
                          @click="deleteTask(task)"
                          class="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete task"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </transition>
        </div>
      </div>
    </main>

    <!-- Success Dialog -->
    <div v-if="showSuccessDialog" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Task Completed</h3>
        <div class="flex justify-end">
          <button
            @click="showSuccessDialog = false"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--button-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white/90 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Task Completion</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to mark this task as completed?</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showConfirmDialog = false"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            Cancel
          </button>
          <button
            @click="confirmTaskCompletion"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[var(--primary)] hover:bg-[var(--button-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
          >
            Complete
          </button>
        </div>
      </div>
    </div>

    <!-- Task Form Modal -->
    <TaskFormModal
      :show="showCreateModal || showEditModal"
      :is-editing="showEditModal"
      :initial-task="selectedTask"
      @close="closeTaskForm"
      @submit="handleTaskSubmit"
    />

    <!-- Task View Modal -->
    <TaskViewModal
      :show="showViewModal"
      :task="selectedTask"
      @close="closeViewModal"
      @edit="editTask"
      @complete="markAsCompleted"
      @delete="deleteTask"
    />
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import TaskFormModal from '~/components/cyclic-tasks/TaskFormModal.vue'
import TaskViewModal from '~/components/cyclic-tasks/TaskViewModal.vue'

const isLoading = ref(true)
const cyclicTasks = ref([])
const showSuccessDialog = ref(false)
const showConfirmDialog = ref(false)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const taskToComplete = ref(null)
const selectedTask = ref(null)

// Add state for expanded groups with localStorage persistence
const expandedGroups = ref(new Set<string>())

// Load expanded groups from localStorage
const loadExpandedGroups = () => {
  try {
    const savedGroups = localStorage.getItem('cyclicTasksExpandedGroups')
    if (savedGroups) {
      expandedGroups.value = new Set(JSON.parse(savedGroups))
    }
  } catch (error) {
    console.error('Error loading expanded groups from localStorage:', error)
  }
}

// Save expanded groups to localStorage
const saveExpandedGroups = () => {
  try {
    localStorage.setItem('cyclicTasksExpandedGroups', JSON.stringify([...expandedGroups.value]))
  } catch (error) {
    console.error('Error saving expanded groups to localStorage:', error)
  }
}

// Fetch cyclic tasks
const fetchTasks = async () => {
  try {
    const response = await fetch('/api/cyclic-tasks')
    if (!response.ok) throw new Error('Failed to fetch tasks')
    cyclicTasks.value = await response.json()
  } catch (error) {
    console.error('Error fetching tasks:', error)
  } finally {
    isLoading.value = false
  }
}

// Group tasks by groupName
const groupedTasks = computed(() => {
  const groups = {}
  cyclicTasks.value.forEach(task => {
    if (!groups[task.groupName]) {
      groups[task.groupName] = {
        name: task.groupName,
        tasks: []
      }
    }
    groups[task.groupName].tasks.push(task)
  })

  // Sort tasks within each group by lastCompletedDate
  Object.values(groups).forEach(group => {
    group.tasks.sort((a, b) => {
      // If both have lastCompletedDate, sort by that
      if (a.lastCompletedDate && b.lastCompletedDate) {
        return new Date(a.lastCompletedDate).getTime() - new Date(b.lastCompletedDate).getTime()
      }
      // If only one has lastCompletedDate, put the one without it first
      if (a.lastCompletedDate) return 1
      if (b.lastCompletedDate) return -1
      // If neither has lastCompletedDate, sort by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })

  // Sort groups alphabetically by name
  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name))
})

// Format date
const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy')
}

// Open create modal with group name
const openCreateModal = (groupName?: string) => {
  selectedTask.value = groupName ? { groupName } : {}
  showCreateModal.value = true
}

// View task details
const viewTask = (task) => {
  selectedTask.value = task
  showViewModal.value = true
}

// Edit task
const editTask = (task) => {
  selectedTask.value = { ...task } // Create a copy of the task
  showViewModal.value = false
  showEditModal.value = true
}

// Close task form modal
const closeTaskForm = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedTask.value = null
}

// Close view modal
const closeViewModal = () => {
  showViewModal.value = false
  selectedTask.value = null
}

// Handle task form submit
const handleTaskSubmit = async (task) => {
  try {
    if (showEditModal.value) {
      const response = await fetch(`/api/cyclic-tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })
      if (!response.ok) throw new Error('Failed to update task')
    } else {
      const response = await fetch('/api/cyclic-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
      })
      if (!response.ok) throw new Error('Failed to create task')
    }
    await fetchTasks()
    closeTaskForm()
  } catch (error) {
    console.error('Error saving task:', error)
    alert('Failed to save task. Please try again.')
  }
}

// Mark task as completed
const markAsCompleted = (task) => {
  taskToComplete.value = task
  showViewModal.value = false
  showConfirmDialog.value = true
}

// Confirm task completion
const confirmTaskCompletion = async () => {
  showConfirmDialog.value = false
  try {
    const response = await fetch(`/api/cyclic-tasks/${taskToComplete.value.id}/complete`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('Failed to mark task as completed')
    await fetchTasks() // Refresh the list
    showSuccessDialog.value = true // Show success dialog
  } catch (error) {
    console.error('Error marking task as completed:', error)
  }
}

// Delete task
const deleteTask = async (task) => {
  if (!confirm('Are you sure you want to delete this task?')) return
  
  try {
    const response = await fetch(`/api/cyclic-tasks/${task.id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete task')
    await fetchTasks() // Refresh the list
    showViewModal.value = false
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

// Toggle group expansion
const toggleGroup = (groupName: string) => {
  if (expandedGroups.value.has(groupName)) {
    expandedGroups.value.delete(groupName)
  } else {
    expandedGroups.value.add(groupName)
  }
  saveExpandedGroups()
}

// Check if group is expanded
const isGroupExpanded = (groupName: string) => {
  return expandedGroups.value.has(groupName)
}

// Fetch tasks on component mount
onMounted(() => {
  fetchTasks()
  loadExpandedGroups()
})
</script> 
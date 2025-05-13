<template>
  <div>
    <AppNavHeader />
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
      
      <!-- Filter controls -->
      <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div class="flex flex-wrap gap-4 items-end">
          <!-- Search by title/notes -->
          <div class="flex-1 min-w-[200px]">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              id="search"
              v-model="filters.search"
              type="text"
              placeholder="Search in title & notes"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>

          <!-- Status filter -->
          <div class="w-40">
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="status"
              v-model="filters.status"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            >
              <option value="">All Statuses</option>
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <!-- Due date filter -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <select
              id="dueDate"
              v-model="filters.dueDate"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            >
              <option value="">All</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due Today</option>
              <option value="week">Due This Week</option>
              <option value="month">Due This Month</option>
              <option value="none">No Due Date</option>
            </select>
          </div>

          <!-- Clear filters button -->
          <button
            @click="clearFilters"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div v-if="paginatedTasks.length === 0" class="p-6 text-gray-600">
          <p v-if="tasks.length === 0">Your tasks will appear here.</p>
          <p v-else>No tasks match your current filters.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th 
                @click="sortTasks('title')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Title
                <SortIndicator :active="sortColumn === 'title'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('status')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Status
                <SortIndicator :active="sortColumn === 'status'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('estimatedPomodoros')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Pomodoros
                <SortIndicator :active="sortColumn === 'estimatedPomodoros'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('createdAt')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Created
                <SortIndicator :active="sortColumn === 'createdAt'" :direction="sortDirection" />
              </th>
              <th 
                @click="sortTasks('dueDate')" 
                scope="col" 
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              >
                Due Date
                <SortIndicator :active="sortColumn === 'dueDate'" :direction="sortDirection" />
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">Notes</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[160px]">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="task in paginatedTasks" :key="task.id" class="hover:bg-gray-50">
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
                <div class="text-sm flex items-center">
                  <span 
                    :class="{
                      'text-green-600 font-medium': task.completedPomodoros && task.estimatedPomodoros && task.completedPomodoros >= task.estimatedPomodoros,
                      'text-orange-500': task.completedPomodoros && task.estimatedPomodoros && task.completedPomodoros < task.estimatedPomodoros,
                      'text-gray-500': !task.completedPomodoros || !task.estimatedPomodoros
                    }"
                  >
                    {{ task.completedPomodoros || 0 }}
                  </span>
                  <span class="text-gray-400 mx-0.5">/</span>
                  <span class="text-gray-500">{{ task.estimatedPomodoros || '-' }}</span>
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
                <div class="text-sm text-gray-500 max-w-[200px] min-w-0 truncate">
                  {{ task.notes || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-[160px]">
                <div class="flex justify-end space-x-2">
                  <button 
                    v-if="task.status === 'IN_PROGRESS' && (!task.estimatedPomodoros || task.completedPomodoros < task.estimatedPomodoros)"
                    @click="startPomodoro(task)"
                    class="text-gray-400 hover:text-[var(--primary)]"
                    title="Start Pomodoro Timer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    @click="viewTask(task)"
                    class="text-gray-400 hover:text-[var(--primary)]"
                    title="View Details"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    @click="editTask(task)"
                    class="text-gray-400 hover:text-[var(--primary)]"
                    title="Edit Task"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    @click="updateTaskStatus(task)"
                    class="text-gray-400 hover:text-[var(--primary)]"
                    :title="task.status === 'BACKLOG' ? 'Start Task' : task.status === 'IN_PROGRESS' ? 'Complete Task' : 'Reopen Task'"
                  >
                    <svg v-if="task.status === 'BACKLOG'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else-if="task.status === 'IN_PROGRESS'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    @click="confirmDelete(task)"
                    class="text-gray-400 hover:text-red-600"
                    title="Delete Task"
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

      <!-- Pagination Controls -->
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">Show</span>
          <select
            v-model="pageSize"
            class="rounded-md border-gray-300 text-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
          <span class="text-sm text-gray-700">items per page</span>
        </div>

        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700">
            Showing {{ paginationStart }} to {{ paginationEnd }} of {{ paginatedTasks.length }} items
          </span>
          <div class="flex space-x-1">
            <button
              @click="currentPage = 1"
              :disabled="currentPage === 1"
              class="px-2 py-1 text-sm rounded-md border"
              :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
              title="First Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-2 py-1 text-sm rounded-md border"
              :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
              title="Previous Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-1 text-sm rounded-md border"
              :class="currentPage === page ? 'bg-[var(--primary)] text-white' : 'text-gray-700 hover:bg-gray-50'"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-2 py-1 text-sm rounded-md border"
              :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
              title="Next Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              @click="currentPage = totalPages"
              :disabled="currentPage === totalPages"
              class="px-2 py-1 text-sm rounded-md border"
              :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'"
              title="Last Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L14.586 10l-4.293 4.293a1 1 0 000 1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Edit Task Modal -->
    <div v-if="showEditModal" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white/95 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-medium text-gray-900">Edit Task</h3>
          <button 
            @click="closeEditModal" 
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveTask" class="space-y-4">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
              id="title"
              v-model="editingTask.title"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>

          <!-- Status -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="editingTask.status"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            >
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <!-- Notes -->
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes"
              v-model="editingTask.notes"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            ></textarea>
          </div>

          <!-- Estimated Pomodoros -->
          <div>
            <label for="estimatedPomodoros" class="block text-sm font-medium text-gray-700">Estimated Pomodoros</label>
            <input
              id="estimatedPomodoros"
              v-model.number="editingTask.estimatedPomodoros"
              type="number"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>

          <!-- Due Date -->
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              id="dueDate"
              v-model="editingTask.dueDate"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- View Task Modal -->
    <div v-if="showViewModal" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white/95 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-medium text-gray-900">{{ selectedTask?.title }}</h3>
          <button 
            @click="closeViewModal" 
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- Status -->
          <div>
            <h4 class="text-sm font-medium text-gray-500">Status</h4>
            <span 
              class="mt-1 inline-block px-2 py-1 text-sm rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-800': selectedTask?.status === 'BACKLOG',
                'bg-blue-100 text-blue-800': selectedTask?.status === 'IN_PROGRESS',
                'bg-green-100 text-green-800': selectedTask?.status === 'DONE'
              }"
            >
              {{ selectedTask?.status.replace('_', ' ') }}
            </span>
          </div>

          <!-- Notes -->
          <div>
            <h4 class="text-sm font-medium text-gray-500">Notes</h4>
            <p class="mt-1 text-gray-900 whitespace-pre-wrap">{{ selectedTask?.notes || 'No notes' }}</p>
          </div>

          <!-- Details -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Created</h4>
              <p class="mt-1 text-gray-900">{{ selectedTask?.createdAt ? new Date(selectedTask.createdAt).toLocaleDateString() : '-' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Due Date</h4>
              <p class="mt-1 text-gray-900">{{ selectedTask?.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Estimated Pomodoros</h4>
              <p class="mt-1 text-gray-900">{{ selectedTask?.estimatedPomodoros || '-' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Completed Pomodoros</h4>
              <p class="mt-1 flex items-center">
                <span 
                  :class="{
                    'text-green-600 font-medium': selectedTask?.completedPomodoros && selectedTask?.estimatedPomodoros && selectedTask?.completedPomodoros >= selectedTask?.estimatedPomodoros,
                    'text-orange-500': selectedTask?.completedPomodoros && selectedTask?.estimatedPomodoros && selectedTask?.completedPomodoros < selectedTask?.estimatedPomodoros,
                    'text-gray-900': !selectedTask?.completedPomodoros || !selectedTask?.estimatedPomodoros
                  }"
                >
                  {{ selectedTask?.completedPomodoros || 0 }}
                </span>
                <span v-if="selectedTask?.estimatedPomodoros" class="text-gray-400 mx-1">/</span>
                <span v-if="selectedTask?.estimatedPomodoros" class="text-gray-900">{{ selectedTask?.estimatedPomodoros }}</span>
                <span 
                  v-if="selectedTask?.completedPomodoros && selectedTask?.estimatedPomodoros && selectedTask?.completedPomodoros >= selectedTask?.estimatedPomodoros" 
                  class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
                >
                  Completed
                </span>
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Completed</h4>
              <p class="mt-1 text-gray-900">{{ selectedTask?.completedAt ? new Date(selectedTask.completedAt).toLocaleDateString() : 'Not completed' }}</p>
            </div>
          </div>

          <!-- Sessions -->
          <div v-if="selectedTask?.sessions?.length">
            <h4 class="text-sm font-medium text-gray-500 mb-2">Pomodoro Sessions</h4>
            <div class="space-y-2">
              <div 
                v-for="session in selectedTask.sessions" 
                :key="session.id"
                class="bg-gray-50 p-3 rounded-lg"
              >
                <div class="flex justify-between text-sm">
                  <span class="font-medium">{{ session.type.replace('_', ' ') }}</span>
                  <span class="text-gray-500">{{ session.durationMinutes }} minutes</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ new Date(session.startTime).toLocaleString() }}
                </div>
                <p v-if="session.notes" class="text-sm text-gray-600 mt-1">{{ session.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white/95 rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Delete Task</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete the task "{{ taskToDelete?.title }}"?</p>
        <div class="flex justify-end space-x-4">
          <button 
            @click="cancelDelete" 
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            No, Cancel
          </button>
          <button 
            @click="confirmDeleteTask" 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Pomodoro Timer Modal -->
    <PomodoroTimer
      v-if="showPomodoroTimer"
      :total-rounds="selectedTask?.estimatedPomodoros || 1"
      :focus-duration="userSettings?.focusDuration || 25"
      :short-break-duration="userSettings?.shortBreakDuration || 5"
      :long-break-duration="userSettings?.longBreakDuration || 15"
      :long-break-interval="userSettings?.longBreakInterval || 4"
      :completed-pomodoros="selectedTask?.completedPomodoros || 0"
      @close="closePomodoroTimer"
      @update:completed-pomodoros="updateCompletedPomodoros"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import SortIndicator from '~/components/SortIndicator.vue'
import { useAuth } from '~/composables/useAuth'
import PomodoroTimer from '~/components/PomodoroTimer.vue'

definePageMeta({
  middleware: ['auth']
})

interface PomodoroTemplate {
  id: string;
  userId: string;
  name: string;
  description: string;
  focusDuration: number;
  shortBreakDuration: number;
  rounds: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const { user, isLoading } = useAuth()
const templates = ref<PomodoroTemplate[]>([])
const currentTemplate = ref<Partial<PomodoroTemplate>>({
  focusDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  rounds: 4
})

// Storage key for template selection
const TEMPLATE_STORAGE_KEY = 'pomodoro-selected-template'

// Default templates if we can't fetch from the API yet
const defaultTemplates: PomodoroTemplate[] = [
  {
    id: 'classic',
    userId: '',
    name: 'Classic Pomodoro',
    description: 'Traditional 25/5 pomodoro technique',
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    rounds: 4,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'long-focus',
    userId: '',
    name: 'Long Focus',
    description: 'Extended focus periods with longer breaks',
    focusDuration: 50 * 60,
    shortBreakDuration: 10 * 60,
    rounds: 3,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'short-sessions',
    userId: '',
    name: 'Short Sessions',
    description: 'Quick focus bursts with minimal breaks',
    focusDuration: 15 * 60,
    shortBreakDuration: 3 * 60,
    rounds: 7,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Initialize templates with defaults
templates.value = defaultTemplates

type TaskStatus = 'BACKLOG' | 'IN_PROGRESS' | 'DONE'

type Task = {
  id: string;
  userId: string;
  title: string;
  notes: string | null;
  estimatedPomodoros: number | null;
  completedPomodoros: number;
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
}

const tasks = ref<Task[]>([])

// Sorting state
const sortColumn = ref<string>('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Filtering state
const filters = ref({
  search: '',
  status: '',
  dueDate: ''
})

// Pagination state
const currentPage = ref(1)
const pageSize = ref(20)

// Computed property for filtered tasks
const filteredTasks = computed(() => {
  if (!tasks.value.length) return []
  
  // Apply filters
  return tasks.value.filter(task => {
    // Filter by search text (title and notes)
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      const titleMatch = task.title.toLowerCase().includes(searchTerm)
      const notesMatch = task.notes ? task.notes.toLowerCase().includes(searchTerm) : false
      if (!titleMatch && !notesMatch) return false
    }
    
    // Filter by status
    if (filters.value.status && task.status !== filters.value.status) {
      return false
    }
    
    // Filter by due date
    if (filters.value.dueDate) {
      var today = new Date()
      today.setHours(0, 0, 0, 0)
      today = new Date(today.getTime() + 1000 * 60 * 60 * 24)
      
      const oneWeekFromNow = new Date(today)
      oneWeekFromNow.setDate(today.getDate() + 7)
      
      const oneMonthFromNow = new Date(today)
      oneMonthFromNow.setMonth(today.getMonth() + 1)
      
      // Handle no due date case first
      if (filters.value.dueDate === 'none') {
        if (task.dueDate !== null) return false
      } else if (task.dueDate === null) {
        return false
      } else {
        // Fix date comparison by using the date part only
        const taskDueDate = new Date(task.dueDate)
        const dueDateStr = taskDueDate.toISOString().split('T')[0]
        const todayStr = today.toISOString().split('T')[0]
        
        switch (filters.value.dueDate) {
          case 'overdue':
            if (dueDateStr >= todayStr) return false
            break
          case 'today':
            if (dueDateStr !== todayStr) return false
            break
          case 'week':
            if (taskDueDate < today || taskDueDate > oneWeekFromNow) return false
            break
          case 'month':
            if (taskDueDate < today || taskDueDate > oneMonthFromNow) return false
            break
        }
      }
    }
    
    return true
  })
})

// Computed property for sorted tasks
const sortedTasks = computed(() => {
  if (!filteredTasks.value.length) return []
  
  const sorted = [...filteredTasks.value].sort((a, b) => {
    let valA, valB
    
    // Handle different data types for sorting
    switch(sortColumn.value) {
      case 'title':
        valA = a.title?.toLowerCase() || ''
        valB = b.title?.toLowerCase() || ''
        break
      case 'status':
        // Custom order for status: BACKLOG, IN_PROGRESS, DONE
        const statusOrder = { 'BACKLOG': 1, 'IN_PROGRESS': 2, 'DONE': 3 }
        valA = statusOrder[a.status] || 0
        valB = statusOrder[b.status] || 0
        break
      case 'estimatedPomodoros':
        valA = a.estimatedPomodoros || 0
        valB = b.estimatedPomodoros || 0
        break
      case 'createdAt':
        valA = new Date(a.createdAt).getTime()
        valB = new Date(b.createdAt).getTime()
        break
      case 'dueDate':
        // Handle null due dates (sort them at the end)
        valA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        valB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER
        break
      default:
        valA = a[sortColumn.value as keyof typeof a] || ''
        valB = b[sortColumn.value as keyof typeof b] || ''
    }
    
    // Compare based on direction
    if (sortDirection.value === 'asc') {
      return valA > valB ? 1 : valA < valB ? -1 : 0
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0
    }
  })
  
  return sorted
})

// Computed property for paginated tasks
const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedTasks.value.slice(start, end)
})

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(filteredTasks.value.length / pageSize.value))

const paginationStart = computed(() => {
  if (filteredTasks.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredTasks.value.length)
})

const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)
  
  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Watch for changes that should reset pagination
watch([filters, sortColumn, sortDirection, pageSize], () => {
  currentPage.value = 1
})

// Variables for delete confirmation
const showDeleteConfirm = ref(false)
const taskToDelete = ref<typeof tasks.value[0] | null>(null)

// View task modal state
const showViewModal = ref(false)
const selectedTask = ref<Task | null>(null)

// Edit task modal state
const showEditModal = ref(false)
const editingTask = ref<Partial<Task>>({})

// Pomodoro timer state
const showPomodoroTimer = ref(false)
const userSettings = ref<{
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  userId?: string;
  theme?: string;
} | null>(null)

// Sort tasks by column
function sortTasks(column: string) {
  // If clicking the same column, toggle direction
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Otherwise switch to the new column with default desc direction
    sortColumn.value = column
    sortDirection.value = 'desc'
  }
}

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

// Open delete confirmation dialog
function confirmDelete(task: typeof tasks.value[0]) {
  taskToDelete.value = task
  showDeleteConfirm.value = true
}

// Close delete confirmation dialog
function cancelDelete() {
  showDeleteConfirm.value = false
  taskToDelete.value = null
}

// Confirm and execute task deletion
async function confirmDeleteTask() {
  if (!user.value || !taskToDelete.value) return
  
  try {
    await $fetch('/api/tasks', {
      method: 'DELETE',
      query: {
        id: taskToDelete.value.id
      }
    })
    
    tasks.value = tasks.value.filter(t => t.id !== taskToDelete.value?.id)
    
    // Close the dialog
    showDeleteConfirm.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Failed to delete task:', error)
  }
}

// Fetch tasks
async function fetchTasks() {
  if (!user.value) return
  
  try {
    const response = await $fetch<Task[]>(`/api/tasks?userId=${user.value.id}`)
    tasks.value = response
  } catch (error) {
    console.error('Failed to fetch tasks:', error)
  }
}

// Fetch tasks when component mounts and when user changes
watch([isLoading, user], ([loading, currentUser]) => {
  if (!loading && !currentUser) {
    navigateTo('/login')
  } else if (!loading && currentUser) {
    fetchTasks()
  }
})

function viewTask(task: Task) {
  selectedTask.value = task
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  selectedTask.value = null
}

function editTask(task: Task) {
  // Format the date for the input field (YYYY-MM-DD)
  const formattedTask = {
    ...task,
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : null
  }
  editingTask.value = formattedTask
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingTask.value = {}
}

async function saveTask() {
  if (!user.value || !editingTask.value.id) return

  try {
    // Format the date for the API (ISO string)
    const taskToUpdate = {
      ...editingTask.value,
      dueDate: editingTask.value.dueDate ? new Date(editingTask.value.dueDate).toISOString() : null
    }

    const updatedTask = await $fetch<Task>('/api/tasks', {
      method: 'PATCH',
      body: {
        id: taskToUpdate.id,
        title: taskToUpdate.title,
        notes: taskToUpdate.notes,
        status: taskToUpdate.status,
        estimatedPomodoros: taskToUpdate.estimatedPomodoros,
        dueDate: taskToUpdate.dueDate,
        completedAt: taskToUpdate.status === 'DONE' ? new Date().toISOString() : null
      }
    })

    // Update the task in the local state
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }

    closeEditModal()
  } catch (error) {
    console.error('Failed to update task:', error)
  }
}

// Clear all filters
function clearFilters() {
  filters.value = {
    search: '',
    status: '',
    dueDate: ''
  }
}

// Fetch user settings
async function fetchUserSettings() {
  if (!user.value) return
  
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
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = updatedTask
    }
    selectedTask.value = updatedTask
  } catch (error) {
    console.error('Failed to update completed pomodoros:', error)
  }
}

// Fetch user settings when component mounts
onMounted(() => {
  fetchUserSettings()
})
</script> 
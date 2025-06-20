<template>
  <div>
    <AppNavHeader />
    <main class="container mx-auto px-4 py-8">
      <!-- Subscription Section -->
      <div v-if="userSession?.blocked">
        <h2 class="text-xl font-semibold mb-4">Subscription no longer active, please update your payment method</h2>
        <div class="bg-white p-6 rounded-lg shadow-sm">
          <p class="text-gray-600 mb-4">Manage your subscription and view your current plan details.</p>
          <NuxtLink to="/app/subscription"
            class="inline-block px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--button-hover)]">
            My Subscription
          </NuxtLink>
        </div>
      </div>

      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">Projects</h1>
          <button
            @click="showCreateModal = true"
            class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors">
            New Project
          </button>
        </div>

        <!-- Filter controls -->
        <ProjectFilters :filters="filters" @update:filters="(newFilters) => filters = newFilters" />

        <!-- Sort controls -->
        <ProjectSortControls 
          :sort-column="sortColumn"
          :sort-direction="sortDirection"
          @sort="sortProjects"
        />

        <!-- Project cards -->
        <div v-if="filteredProjects.length === 0" class="bg-white rounded-lg shadow-sm p-6 text-gray-600">
          <p v-if="projects.length === 0">Your projects will appear here.</p>
          <p v-else>No projects match your search criteria.</p>
        </div>
        <div v-else class="space-y-4">
          <ProjectCard
            v-for="project in paginatedProjects"
            :key="project.id"
            :project="project"
            @view="viewProject"
            @edit="editProject"
            @delete="confirmDelete"
          />
        </div>

        <!-- Project Stats -->
        <ProjectStats :projects="filteredProjects" />

        <!-- Pagination -->
        <ProjectPagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="filteredProjects.length" />

        <!-- Create Project Modal -->
        <ProjectCreateModal
          :show="showCreateModal"
          @close="showCreateModal = false"
          @created="handleProjectCreated"
        />

        <!-- Edit Project Modal -->
        <ProjectEditModal v-if="showEditModal" :show="showEditModal" :project="editingProject as Project" @close="closeEditModal"
          @save="saveProject" />

        <!-- View Project Modal -->
        <ProjectViewModal v-if="showViewModal" :show="showViewModal" :project="selectedProject" @close="closeViewModal" />

        <!-- Delete Confirmation Modal -->
        <ProjectDeleteModal v-if="showDeleteConfirm" :show="showDeleteConfirm" :project="projectToDelete" @cancel="cancelDelete"
          @confirm="confirmDeleteProject" />

        <!-- Success Dialog -->
        <div v-if="showSuccessDialog" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-white/90 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Success</h3>
            <p class="text-gray-600 mb-4">{{ successMessage }}</p>
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ProjectFilters from '~/components/projects/ProjectFilters.vue'
import ProjectCard from '~/components/projects/ProjectCard.vue'
import ProjectSortControls from '~/components/projects/ProjectSortControls.vue'
import ProjectPagination from '~/components/projects/ProjectPagination.vue'
import ProjectEditModal from '~/components/projects/ProjectEditModal.vue'
import ProjectViewModal from '~/components/projects/ProjectViewModal.vue'
import ProjectDeleteModal from '~/components/projects/ProjectDeleteModal.vue'
import ProjectStats from '~/components/projects/ProjectStats.vue'
import ProjectCreateModal from '~/components/projects/ProjectCreateModal.vue'
import { filterProjects, type ProjectFilters as ProjectFiltersType, getProjectState } from '~/utils/projectFilters'

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

interface ExtendedSession {
  user?: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
  blocked?: boolean;
}

interface ExtendedUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

const userSession = await getSession() as ExtendedSession
const user = userSession?.user as ExtendedUser | undefined
const router = useRouter()

import type { Project } from '~/types/project'

const projects = ref<Project[]>([])

// Sorting state
const sortColumn = ref<string>('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Filtering state
const filters = ref<ProjectFiltersType>({
  search: '',
  state: ''
})

// Pagination state
const currentPage = ref(1)
const pageSize = ref(10) // Default to 10

// Load page size and sort state from localStorage on mount
onMounted(() => {
  try {
    // Load page size
    const savedPageSize = localStorage.getItem('projectPageSize')
    if (savedPageSize) {
      const parsed = parseInt(savedPageSize, 10)
      if (!isNaN(parsed)) {
        pageSize.value = parsed
      }
    }

    // Load sort state
    const savedSortColumn = localStorage.getItem('projectSortColumn')
    if (savedSortColumn) {
      sortColumn.value = savedSortColumn
    }

    const savedSortDirection = localStorage.getItem('projectSortDirection')
    if (savedSortDirection === 'asc' || savedSortDirection === 'desc') {
      sortDirection.value = savedSortDirection
    }
  } catch (error) {
    console.error('Error loading state from localStorage:', error)
  }
})

// Watch for changes that should reset pagination
watch([filters, sortColumn, sortDirection], () => {
  currentPage.value = 1
})

// Watch for page size changes to save to localStorage
watch(pageSize, (newSize) => {
  try {
    localStorage.setItem('projectPageSize', newSize.toString())
  } catch (error) {
    console.error('Error saving page size to localStorage:', error)
  }
})

// Watch for sort state changes to save to localStorage
watch([sortColumn, sortDirection], ([newColumn, newDirection]) => {
  try {
    localStorage.setItem('projectSortColumn', newColumn)
    localStorage.setItem('projectSortDirection', newDirection)
  } catch (error) {
    console.error('Error saving sort state to localStorage:', error)
  }
})

// Computed property for filtered projects
const filteredProjects = computed(() => {
  return filterProjects(projects.value, filters.value)
})

// Computed property for sorted projects
const sortedProjects = computed(() => {
  if (!filteredProjects.value.length) return []

  const sorted = [...filteredProjects.value].sort((a, b) => {
    let valA, valB

    // Handle different data types for sorting
    switch (sortColumn.value) {
      case 'name':
        valA = a.name?.toLowerCase() || ''
        valB = b.name?.toLowerCase() || ''
        break
      case 'createdAt':
        valA = new Date(a.createdAt).getTime()
        valB = new Date(b.createdAt).getTime()
        break
      case 'updatedAt':
        valA = new Date(a.updatedAt).getTime()
        valB = new Date(b.updatedAt).getTime()
        break
      case 'taskCount':
        valA = a._count?.tasks || 0
        valB = b._count?.tasks || 0
        break
      case 'state':
        valA = getProjectState(a)
        valB = getProjectState(b)
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

// Computed property for paginated projects
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  const paginated = sortedProjects.value.slice(start, end)
  
  return paginated
})

// Variables for delete confirmation
const showDeleteConfirm = ref(false)
const projectToDelete = ref<Project | null>(null)

// View project modal state
const showViewModal = ref(false)
const selectedProject = ref<Project | null>(null)

// Edit project modal state
const showEditModal = ref(false)
const editingProject = ref<Partial<Project>>({})

// Success dialog state
const showSuccessDialog = ref(false)
const successMessage = ref('')

// Create project modal state
const showCreateModal = ref(false)

// Sort projects by column
function sortProjects(column: string) {
  // If clicking the same column, toggle direction
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // Otherwise switch to the new column with default desc direction
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

// Open delete confirmation dialog
function confirmDelete(project: Project) {
  projectToDelete.value = project
  showDeleteConfirm.value = true
}

// Close delete confirmation dialog
function cancelDelete() {
  showDeleteConfirm.value = false
  projectToDelete.value = null
}

// Confirm and execute project deletion
async function confirmDeleteProject() {
  if (!user || !projectToDelete.value) return

  try {
    const projectName = projectToDelete.value.name
    
    await $fetch('/api/projects', {
      method: 'DELETE',
      query: {
        id: projectToDelete.value.id
      }
    })

    projects.value = projects.value.filter(p => p.id !== projectToDelete.value?.id)

    // Close the dialog
    showDeleteConfirm.value = false
    projectToDelete.value = null

    // Show success message
    successMessage.value = `Project "${projectName}" deleted successfully`
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Failed to delete project:', error)
  }
}

// Fetch projects
async function fetchProjects() {
  if (!user) return

  try {
    const response = await $fetch<Project[]>(`/api/projects?userId=${user.id}`)
    projects.value = response
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}

function viewProject(project: Project) {
  selectedProject.value = project
  showViewModal.value = true
}

function closeViewModal() {
  showViewModal.value = false
  selectedProject.value = null
}

function editProject(project: Project) {
  editingProject.value = project
  showEditModal.value = true
}

function closeEditModal() {
  showEditModal.value = false
  editingProject.value = {}
}

async function saveProject(project: Partial<Project>) {
  if (!user || !project.id) return

  try {
    const updatedProject = await $fetch<Project>('/api/projects', {
      method: 'PATCH',
      body: project
    })

    // Update the project in the local state
    const index = projects.value.findIndex(p => p.id === updatedProject.id)
    if (index !== -1) {
      projects.value[index] = updatedProject
    }

    closeEditModal()
    
    // Show success message
    successMessage.value = `Project "${updatedProject.name}" updated successfully`
    showSuccessDialog.value = true
  } catch (error) {
    console.error('Failed to update project:', error)
  }
}

function handleProjectCreated() {
  fetchProjects()
  
  // Show success message
  successMessage.value = 'Project created successfully'
  showSuccessDialog.value = true
}

// Fetch projects when component mounts
onMounted(async () => {
  await fetchProjects()
})
</script> 
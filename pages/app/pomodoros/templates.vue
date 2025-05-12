<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Timer Templates</h1>
        <div class="flex space-x-4">
          <NuxtLink
            to="/app/pomodoros"
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Timer
          </NuxtLink>
          <button
            @click="openCreateModal"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Template
          </button>
        </div>
      </div>

      <!-- Default Templates Section -->
      <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 class="text-xl font-semibold mb-4">Default Templates</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="template in defaultTemplates"
            :key="template.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            :class="{ 'border-blue-500 bg-blue-50': template.isDefault }"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium">{{ template.name }}</h3>
                <p class="text-gray-600 text-sm mt-1">{{ template.description }}</p>
              </div>
              <div v-if="template.isDefault" class="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Default
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">Focus:</span>
                <span>{{ formatMinutes(template.focusDuration) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Break:</span>
                <span>{{ formatMinutes(template.shortBreakDuration) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Rounds:</span>
                <span>{{ template.rounds }}</span>
              </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button 
                @click="setAsDefault(template)"
                class="text-xs px-2 py-1 rounded"
                :class="template.isDefault ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                :disabled="template.isDefault"
              >
                Set as Default
              </button>
              <button 
                @click="editTemplate(template)"
                class="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Templates Section -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Your Custom Templates</h2>
        <div v-if="customTemplates.length === 0" class="text-center py-8 text-gray-500">
          You haven't created any custom templates yet. 
          <button @click="openCreateModal" class="text-blue-500 hover:underline">Create one now</button>.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="template in customTemplates"
            :key="template.id"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow"
            :class="{ 'border-blue-500 bg-blue-50': template.isDefault }"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-medium">{{ template.name }}</h3>
                <p class="text-gray-600 text-sm mt-1">{{ template.description }}</p>
              </div>
              <div v-if="template.isDefault" class="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Default
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-500">Focus:</span>
                <span>{{ formatMinutes(template.focusDuration) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Break:</span>
                <span>{{ formatMinutes(template.shortBreakDuration) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Rounds:</span>
                <span>{{ template.rounds }}</span>
              </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button 
                @click="setAsDefault(template)"
                class="text-xs px-2 py-1 rounded"
                :class="template.isDefault ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                :disabled="template.isDefault"
              >
                Set as Default
              </button>
              <button 
                @click="editTemplate(template)"
                class="text-xs px-2 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
              >
                Edit
              </button>
              <button 
                @click="deleteTemplate(template)"
                class="text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Template Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Template' : 'Create New Template' }}</h2>
        
        <div class="space-y-4">
          <div>
            <label for="templateName" class="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
            <input
              id="templateName"
              v-model="currentTemplate.name"
              type="text"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="e.g., My Custom Timer"
            />
          </div>
          
          <div>
            <label for="templateDescription" class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea
              id="templateDescription"
              v-model="currentTemplate.description"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Describe your template"
              rows="2"
            ></textarea>
          </div>
          
          <div>
            <label for="focusDuration" class="block text-sm font-medium text-gray-700 mb-1">Focus Duration (minutes)</label>
            <input
              id="focusDuration"
              v-model.number="focusMinutes"
              type="number"
              class="w-full px-3 py-2 border rounded-md"
              min="1"
              max="120"
            />
          </div>
          
          <div>
            <label for="breakDuration" class="block text-sm font-medium text-gray-700 mb-1">Break Duration (minutes)</label>
            <input
              id="breakDuration"
              v-model.number="breakMinutes"
              type="number"
              class="w-full px-3 py-2 border rounded-md"
              min="1"
              max="60"
            />
          </div>
          
          <div>
            <label for="rounds" class="block text-sm font-medium text-gray-700 mb-1">Number of Rounds</label>
            <input
              id="rounds"
              v-model.number="currentTemplate.rounds"
              type="number"
              class="w-full px-3 py-2 border rounded-md"
              min="1"
              max="10"
            />
          </div>
          
          <div class="flex items-center">
            <input
              id="isDefault"
              v-model="currentTemplate.isDefault"
              type="checkbox"
              class="h-4 w-4 text-blue-600"
            />
            <label for="isDefault" class="ml-2 text-sm text-gray-700">Set as default template</label>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveTemplate"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            :disabled="!isFormValid"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">Delete Template</h2>
        <p>Are you sure you want to delete the template "{{ templateToDelete?.name }}"? This action cannot be undone.</p>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserSubscription } from '~/server/types'

definePageMeta({
  middleware: ['auth']
})

interface UserWithSubscription extends Omit<User, 'subscription'> {
  subscription: {
    type: 'MONTHLY' | 'YEARLY' | null
    status: 'FREE_TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'
    freeTrialExpiresAt: string
    currentPeriodStart: string | null
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
  } | null
}

interface PomodoroTemplate {
  id: string
  userId: string
  name: string
  description?: string
  focusDuration: number // seconds
  shortBreakDuration: number // seconds
  longBreakDuration?: number // seconds
  rounds: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const user = ref<UserWithSubscription | null>(null)
const templates = ref<PomodoroTemplate[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const focusMinutes = ref(25)
const breakMinutes = ref(5)
const currentTemplate = ref<Partial<PomodoroTemplate>>({
  name: '',
  description: '',
  rounds: 4,
  isDefault: false
})
const showDeleteConfirm = ref(false)
const templateToDelete = ref<PomodoroTemplate | null>(null)

const defaultTemplates = computed(() => {
  return [
    {
      id: 'classic',
      userId: user.value?.id || '',
      name: 'Classic Pomodoro',
      description: 'Traditional 25/5 pomodoro technique',
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      rounds: 4,
      isDefault: templates.value.length === 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'long-focus',
      userId: user.value?.id || '',
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
      userId: user.value?.id || '',
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
})

const customTemplates = computed(() => {
  return templates.value
})

const isFormValid = computed(() => {
  return (
    currentTemplate.value.name?.trim() !== '' && 
    focusMinutes.value > 0 && 
    breakMinutes.value > 0 && 
    currentTemplate.value.rounds && 
    currentTemplate.value.rounds > 0
  )
})

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await $fetch<UserWithSubscription>('/api/auth/me')
    user.value = response
    
    // Fetch templates
    fetchTemplates()
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

async function fetchTemplates() {
  try {
    const response = await $fetch<PomodoroTemplate[]>('/api/pomodoro/templates')
    templates.value = response
  } catch (error) {
    console.error('Failed to fetch templates:', error)
  }
}

function formatMinutes(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes} min`
}

function openCreateModal() {
  isEditing.value = false
  currentTemplate.value = {
    name: '',
    description: '',
    rounds: 4,
    isDefault: false
  }
  focusMinutes.value = 25
  breakMinutes.value = 5
  showModal.value = true
}

function editTemplate(template: PomodoroTemplate) {
  isEditing.value = true
  currentTemplate.value = { ...template }
  focusMinutes.value = Math.floor(template.focusDuration / 60)
  breakMinutes.value = Math.floor(template.shortBreakDuration / 60)
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveTemplate() {
  if (!isFormValid.value) return
  
  // Convert minutes to seconds
  const templateToSave = {
    ...currentTemplate.value,
    focusDuration: focusMinutes.value * 60,
    shortBreakDuration: breakMinutes.value * 60
  }
  
  try {
    if (isEditing.value && currentTemplate.value.id) {
      // Update existing template
      await $fetch(`/api/pomodoro/templates/${currentTemplate.value.id}`, {
        method: 'PUT',
        body: templateToSave
      })
    } else {
      // Create new template
      await $fetch('/api/pomodoro/templates', {
        method: 'POST',
        body: templateToSave
      })
    }
    
    // Refresh the templates list
    await fetchTemplates()
    closeModal()
  } catch (error) {
    console.error('Failed to save template:', error)
  }
}

async function setAsDefault(template: PomodoroTemplate) {
  if (template.isDefault) return
  
  try {
    await $fetch(`/api/pomodoro/templates/${template.id}`, {
      method: 'PUT',
      body: {
        ...template,
        isDefault: true
      }
    })
    
    // Refresh the templates list
    await fetchTemplates()
  } catch (error) {
    console.error('Failed to set template as default:', error)
  }
}

function deleteTemplate(template: PomodoroTemplate) {
  templateToDelete.value = template
  showDeleteConfirm.value = true
}

async function confirmDelete() {
  if (!templateToDelete.value) return
  
  try {
    await $fetch(`/api/pomodoro/templates/${templateToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    // Refresh the templates list
    await fetchTemplates()
    showDeleteConfirm.value = false
    templateToDelete.value = null
  } catch (error) {
    console.error('Failed to delete template:', error)
  }
}
</script> 
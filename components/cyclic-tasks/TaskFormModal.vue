<template>
  <div v-if="show" class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white/90 rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">{{ isEditing ? 'Edit Task' : 'New Task' }}</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="groupName" class="block text-sm font-medium text-gray-700">Group Name</label>
          <input
            id="groupName"
            v-model="task.groupName"
            type="text"
            list="groupNames"
            maxlength="200"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          />
          <datalist id="groupNames">
            <option v-for="group in groupNames" :key="group" :value="group" />
          </datalist>
        </div>

        <div>
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            v-model="task.title"
            type="text"
            maxlength="200"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="task.description"
            rows="3"
            maxlength="2000"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)]"
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Task') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  show: boolean;
  isEditing?: boolean;
  initialTask?: {
    id?: string;
    groupName: string;
    title: string;
    description?: string;
  };
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', task: any): void;
}>()

const task = ref({
  groupName: '',
  title: '',
  description: ''
})

// Watch for changes to initialTask and update the form
watch(() => props.initialTask, (newTask) => {
  if (newTask) {
    task.value = {
      groupName: newTask.groupName || '',
      title: newTask.title || '',
      description: newTask.description || ''
    }
  } else {
    task.value = {
      groupName: '',
      title: '',
      description: ''
    }
  }
}, { immediate: true })

const isSubmitting = ref(false)
const groupNames = ref<string[]>([])

// Fetch existing group names
const fetchGroupNames = async () => {
  try {
    const response = await fetch('/api/cyclic-tasks/groups')
    if (!response.ok) throw new Error('Failed to fetch group names')
    groupNames.value = await response.json()
  } catch (error) {
    console.error('Error fetching group names:', error)
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    emit('submit', {
      ...task.value,
      id: props.initialTask?.id
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchGroupNames()
})
</script> 
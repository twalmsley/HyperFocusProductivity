<template>
  <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h2 class="text-lg font-semibold mb-3">Quick Actions</h2>
    <div class="flex flex-wrap gap-3">
      <button
        @click="showCreateModal = true"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors">
        New Task
      </button>
      
      <button
        @click="showCyclicTaskModal = true"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors">
        New Cyclic Task
      </button>
      <button
        @click="$emit('open-journal-dialog')"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors"
      >
        New Journal Entry
      </button>
    </div>

    <TaskCreateModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleTaskCreated"
    />

    <!-- Cyclic Task Form Modal -->
    <TaskFormModal
      :show="showCyclicTaskModal"
      :is-editing="false"
      @close="showCyclicTaskModal = false"
      @submit="handleCyclicTaskSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import TaskCreateModal from '~/components/tasks/TaskCreateModal.vue'
import TaskFormModal from '~/components/cyclic-tasks/TaskFormModal.vue'

const showCreateModal = ref(false)
const showCyclicTaskModal = ref(false)
const router = useRouter()

function handleTaskCreated() {
  router.push('/app/tasks')
}

async function handleCyclicTaskSubmit(task: any) {
  try {
    const response = await fetch('/api/cyclic-tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    if (!response.ok) throw new Error('Failed to create cyclic task')
    
    showCyclicTaskModal.value = false
    // Optionally navigate to cyclic tasks page or emit an event to refresh
    router.push('/app/cyclic-tasks')
  } catch (error) {
    console.error('Error creating cyclic task:', error)
    alert('Failed to create cyclic task. Please try again.')
  }
}
</script> 
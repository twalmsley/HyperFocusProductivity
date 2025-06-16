<template>
  <div class="bg-white p-4 rounded-lg shadow-sm mb-6">
    <h2 class="text-lg font-semibold mb-3">Quick Actions</h2>
    <div class="flex flex-wrap gap-3">
      <button
        @click="showCreateModal = true"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors">
        New Task
      </button>
      
      <NuxtLink to="/app/cyclic-tasks/new"
        class="flex-1 min-w-[120px] bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg text-center transition-colors">
        New Cyclic Task
      </NuxtLink>
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
  </div>
</template>

<script setup lang="ts">
import TaskCreateModal from '~/components/tasks/TaskCreateModal.vue'

const showCreateModal = ref(false)
const router = useRouter()

function handleTaskCreated() {
  router.push('/app/tasks')
}
</script> 
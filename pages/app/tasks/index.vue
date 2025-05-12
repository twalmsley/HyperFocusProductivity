<template>
  <div>
    <AppNavHeader v-if="user" />
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
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-600">Your tasks will appear here.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const user = ref(null)

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/me')
    user.value = response
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})
</script> 
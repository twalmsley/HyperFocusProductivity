<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Pomodoros</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-600">Your pomodoro timer and sessions will appear here.</p>
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
<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Pomodoro</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <PomodoroTimer
          :focus-duration="25 * 60"
          :break-duration="5 * 60"
          :rounds="4"
        />
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
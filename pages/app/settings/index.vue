<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Settings</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-4">Profile Settings</h2>
            <p class="text-gray-600">Your profile settings will appear here.</p>
          </div>
          <div>
            <h2 class="text-xl font-semibold mb-4">Notification Settings</h2>
            <p class="text-gray-600">Your notification preferences will appear here.</p>
          </div>
          <div>
            <h2 class="text-xl font-semibold mb-4">Pomodoro Settings</h2>
            <p class="text-gray-600">Your pomodoro timer settings will appear here.</p>
          </div>
        </div>
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
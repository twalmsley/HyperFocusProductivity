<template>
  <div>
    <AppNavHeader />
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
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  middleware: ['auth']
})

const { user, isLoading } = useAuth()

// Redirect to login if not authenticated
watch([isLoading, user], ([loading, currentUser]) => {
  if (!loading && !currentUser) {
    navigateTo('/login')
  }
})
</script> 
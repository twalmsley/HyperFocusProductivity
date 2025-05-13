<template>
  <nav class="bg-white border-b">
    <div class="container mx-auto px-4">
      <div class="flex space-x-8 py-3">
        <NuxtLink 
          to="/app" 
          class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
          :class="{ 'text-[var(--primary)]': route.path === '/app' }"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink 
          to="/app/pomodoros" 
          class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
          :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/pomodoros') }"
        >
          Pomodoro
        </NuxtLink>
        <NuxtLink 
          to="/app/tasks" 
          class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
          :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/tasks') }"
        >
          Tasks
        </NuxtLink>
        <NuxtLink 
          to="/app/settings" 
          class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
          :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/settings') }"
        >
          Settings
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { isLoading } = useAuth()

// Only render when auth state is loaded
if (process.client) {
  watch(isLoading, (loading) => {
    if (!loading) {
      // Auth state is loaded, we can now render
    }
  })
}
</script> 
<template>
  <nav class="bg-white border-b">
    <div class="container mx-auto px-4">
      <div class="flex space-x-8 py-3">
        <NuxtLink 
          to="/app/dashboard" 
          class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
          :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/dashboard') }"
        >
          Dashboard
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
const route = useRoute()
</script> 
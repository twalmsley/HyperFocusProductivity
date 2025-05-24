<template>
  <header class="bg-white border-b">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center space-x-8">
          <NuxtLink 
            to="/app" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path === '/app' }"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/app/tasks" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/tasks') }"
          >
            Tasks
          </NuxtLink>
          <NuxtLink 
            to="/app/settings" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/settings') }"
          >
            Settings
          </NuxtLink>
        </div>
        
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">

const route = useRoute()
</script> 
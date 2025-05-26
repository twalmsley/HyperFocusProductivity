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
        <div class="flex items-center space-x-4">
          <h1>Subscription</h1>
          <p v-if="subscriptionState === 'FREE_TRIAL'" class="bg-yellow-500 text-black px-2 py-1 rounded-md">Free Trial</p>
          <p v-else-if="subscriptionState === 'ACTIVE'" class="bg-green-500 text-black px-2 py-1 rounded-md">Active</p>
          <p v-else-if="subscriptionState === 'CANCELED'" class="bg-red-500 text-black px-2 py-1 rounded-md">Cancelled</p>
          <p v-else-if="subscriptionState === 'EXPIRED'" class="bg-red-500 text-black px-2 py-1 rounded-md">Expired</p>
          <p v-else="subscriptionState === 'PAST_DUE'" class="bg-red-500 text-black px-2 py-1 rounded-md">Past Due</p>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const {
  status,
  data,
  lastRefreshedAt,
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
  signOut
} = useAuth()
const route = useRoute()
const session = await getSession()
const subscriptionState = session?.subscriptionState
</script> 
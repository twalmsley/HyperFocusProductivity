<template>
  <header class="bg-white border-b">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/app" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path === '/app' }"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/app/projects" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/projects') }"
          >
            Projects
          </NuxtLink>
          <NuxtLink 
            to="/app/tasks" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/tasks') }"
          >
            Tasks
          </NuxtLink>
          <NuxtLink 
            to="/app/cyclic-tasks" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/cyclic-tasks') }"
          >
            Cyclic Tasks
          </NuxtLink>
          <NuxtLink 
            to="/app/journal" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/journal') }"
          >
            Journal
          </NuxtLink>
          <NuxtLink 
            to="/app/trackers" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/trackers') }"
          >
            Trackers
          </NuxtLink>
          <NuxtLink 
            to="/app/settings" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/settings') }"
          >
            Settings
          </NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-md text-gray-900 hover:text-[var(--primary)] hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Desktop Right Side -->
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink 
            to="/app/subscription" 
            class="text-gray-900 hover:text-[var(--primary)] transition-colors"
            :class="{ 'text-[var(--primary)]': route.path.startsWith('/app/subscription') }"
          >
            Subscription
          </NuxtLink>
          <p v-if="subscriptionState === 'FREE_TRIAL'" class="bg-yellow-500 text-black px-2 py-1 rounded-md text-sm">
            Free Trial ({{ remainingDays }} days left)
          </p>
          <p v-else-if="subscriptionState === 'ACTIVE'" class="bg-green-500 text-black px-2 py-1 rounded-md text-sm">Active</p>
          <p v-else-if="subscriptionState === 'CANCELED'" class="bg-red-500 text-black px-2 py-1 rounded-md text-sm">Cancelled</p>
          <p v-else-if="subscriptionState === 'EXPIRED'" class="bg-red-500 text-black px-2 py-1 rounded-md text-sm">Expired</p>
          <p v-else="subscriptionState === 'PAST_DUE'" class="bg-red-500 text-black px-2 py-1 rounded-md text-sm">Past Due</p>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden border-t border-gray-200"
      >
        <div class="py-4 space-y-2">
          <NuxtLink 
            to="/app" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path === '/app' }"
            @click="isMobileMenuOpen = false"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink 
            to="/app/projects" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path.startsWith('/app/projects') }"
            @click="isMobileMenuOpen = false"
          >
            Projects
          </NuxtLink>
          <NuxtLink 
            to="/app/tasks" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path.startsWith('/app/tasks') }"
            @click="isMobileMenuOpen = false"
          >
            Tasks
          </NuxtLink>
          <NuxtLink 
            to="/app/cyclic-tasks" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path.startsWith('/app/cyclic-tasks') }"
            @click="isMobileMenuOpen = false"
          >
            Cyclic Tasks
          </NuxtLink>
          <NuxtLink 
            to="/app/journal" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path.startsWith('/app/journal') }"
            @click="isMobileMenuOpen = false"
          >
            Journal
          </NuxtLink>
          <NuxtLink 
            to="/app/trackers" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path.startsWith('/app/trackers') }"
            @click="isMobileMenuOpen = false"
          >
            Trackers
          </NuxtLink>
          <NuxtLink 
            to="/app/settings" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path.startsWith('/app/settings') }"
            @click="isMobileMenuOpen = false"
          >
            Settings
          </NuxtLink>
          <NuxtLink 
            to="/app/subscription" 
            class="block px-4 py-2 text-gray-900 hover:text-[var(--primary)] hover:bg-gray-50 transition-colors rounded-md"
            :class="{ 'text-[var(--primary)] bg-gray-50': route.path.startsWith('/app/subscription') }"
            @click="isMobileMenuOpen = false"
          >
            Subscription
          </NuxtLink>
          
          <!-- Mobile Subscription Status -->
          <div class="px-4 py-2">
            <p v-if="subscriptionState === 'FREE_TRIAL'" class="bg-yellow-500 text-black px-2 py-1 rounded-md text-sm inline-block">
              Free Trial ({{ remainingDays }} days left)
            </p>
            <p v-else-if="subscriptionState === 'ACTIVE'" class="bg-green-500 text-black px-2 py-1 rounded-md text-sm inline-block">Active</p>
            <p v-else-if="subscriptionState === 'CANCELED'" class="bg-red-500 text-black px-2 py-1 rounded-md text-sm inline-block">Cancelled</p>
            <p v-else-if="subscriptionState === 'EXPIRED'" class="bg-red-500 text-black px-2 py-1 rounded-md text-sm inline-block">Expired</p>
            <p v-else="subscriptionState === 'PAST_DUE'" class="bg-red-500 text-black px-2 py-1 rounded-md text-sm inline-block">Past Due</p>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Calculate remaining days for free trial
const remainingDays = computed(() => {
  if (subscriptionState === 'FREE_TRIAL' && session?.freeTrialExpiresAt) {
    const today = new Date()
    const trialEnd = new Date(session.freeTrialExpiresAt)
    const diffTime = trialEnd.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }
  return 0
})
</script> 
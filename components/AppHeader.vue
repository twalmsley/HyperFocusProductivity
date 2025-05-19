<template>
  <header class="bg-[var(--primary)] shadow-sm">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-white">HyperFocusProductivity</NuxtLink>
        </div>

        <!-- Navigation -->
        <div class="hidden md:flex space-x-8">
          <NuxtLink to="/features" class="text-white hover:text-[var(--primary-light)] transition-colors">Features</NuxtLink>
          <NuxtLink to="/blog" class="text-white hover:text-[var(--primary-light)] transition-colors">Blog</NuxtLink>
          <NuxtLink to="/pricing" class="text-white hover:text-[var(--primary-light)] transition-colors">Pricing</NuxtLink>
          <NuxtLink to="/about" class="text-white hover:text-[var(--primary-light)] transition-colors">About</NuxtLink>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="user">
            <div class="flex items-center space-x-4">
              <span class="text-white">Welcome, {{ user.name }}</span>
              
              <!-- Subscription Status -->
              <NuxtLink 
                v-if="showSubscriptionAlert"
                to="/app/subscription" 
                class="text-yellow-300 hover:text-yellow-200 transition-colors flex items-center"
              >
                <span class="mr-1">⚠️</span>
                <span v-if="user.subscription?.status === 'FREE_TRIAL'">
                  Trial expires in {{ trialDaysLeft }} days
                </span>
                <span v-else>
                  Subscription needed
                </span>
              </NuxtLink>
              
              <button 
                @click="handleLogout" 
                class="text-white hover:text-[var(--primary-light)] transition-colors"
              >
                Logout
              </button>
            </div>
          </template>
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="text-white hover:text-[var(--primary-light)] transition-colors"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/signup" 
              class="bg-white hover:bg-[var(--primary-light)] text-[var(--primary)] hover:text-[var(--primary)] px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </NuxtLink>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const user = useState('user')
const router = useRouter()
const { csrfToken, fetchCsrfToken } = useCsrf()

const showSubscriptionAlert = computed(() => {
  if (!user.value?.subscription) return false
  
  const status = user.value.subscription.status
  if (status === 'EXPIRED' || status === 'CANCELED' || status === 'PAST_DUE') {
    return true
  }
  
  if (status === 'FREE_TRIAL') {
    const trialEnd = new Date(user.value.subscription.freeTrialExpiresAt)
    const now = new Date()
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysLeft <= 3 // Show alert when 3 or fewer days remain
  }
  
  return false
})

const trialDaysLeft = computed(() => {
  if (!user.value?.subscription || user.value.subscription.status !== 'FREE_TRIAL') return 0
  
  const trialEnd = new Date(user.value.subscription.freeTrialExpiresAt)
  const now = new Date()
  return Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
})

// Fetch user data on component mount
onMounted(async () => {
  await fetchCsrfToken()
  
  try {
    const response = await fetch('/api/auth/me', {
      headers: {
        'X-CSRF-Token': csrfToken.value || ''
      }
    })
    if (response.ok) {
      user.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { 
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken.value || ''
      }
    })
    user.value = null
    router.push('/')
  } catch (error) {
    console.error('Failed to logout:', error)
  }
}
</script> 
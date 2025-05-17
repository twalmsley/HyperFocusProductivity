<template>
  <div class="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Subscription Status -->
      <div v-if="subscription" class="mb-12 bg-white rounded-lg shadow p-6">
        <h2 class="text-2xl font-bold mb-4">Your Subscription</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-gray-600">Status</p>
            <p class="font-semibold" :class="{
              'text-green-600': subscription.status === 'ACTIVE',
              'text-yellow-600': subscription.status === 'FREE_TRIAL',
              'text-red-600': ['EXPIRED', 'CANCELED', 'PAST_DUE'].includes(subscription.status)
            }">
              {{ formatStatus(subscription.status) }}
            </p>
          </div>
          <div v-if="subscription.status === 'FREE_TRIAL'">
            <p class="text-gray-600">Free Trial Expires</p>
            <p class="font-semibold">{{ formatDate(subscription.freeTrialExpiresAt) }}</p>
          </div>
          <div v-if="subscription.status === 'ACTIVE'">
            <p class="text-gray-600">Current Period Ends</p>
            <p class="font-semibold">{{ formatDate(subscription.currentPeriodEnd) }}</p>
          </div>
        </div>
      </div>

      <!-- Subscription Plans -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <!-- Basic Plan -->
        <div class="bg-white p-8 rounded-lg shadow-md border-t-4 border-[var(--primary)] relative">
          <div class="absolute -top-4 right-8 bg-[var(--primary)] text-white text-sm font-bold px-3 py-1 rounded-full">Popular</div>
          <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">Basic Plan</h2>
          <p class="text-[var(--text-secondary)] mb-6">Perfect for individual users</p>
          <p class="text-4xl font-bold text-[var(--text-primary)] mb-6">
            £10<span class="text-lg text-[var(--text-secondary)]">/month</span>
          </p>
          <ul class="space-y-3 text-[var(--text-secondary)] mb-8">
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Unlimited Pomodoro sessions</span>
            </li>
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Advanced task management</span>
            </li>
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Basic productivity analytics</span>
            </li>
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Email support</span>
            </li>
          </ul>
          <button
            @click="subscribe('MONTHLY')"
            class="w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors"
            :disabled="isLoading"
          >
            {{ subscription?.status === 'ACTIVE' ? 'Change Plan' : 'Subscribe Now' }}
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="bg-white p-8 rounded-lg shadow-md border-t-4 border-[var(--primary-dark)]">
          <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">Premium Plan</h2>
          <p class="text-[var(--text-secondary)] mb-6">For power users who want it all</p>
          <p class="text-4xl font-bold text-[var(--text-primary)] mb-6">
            £20<span class="text-lg text-[var(--text-secondary)]">/month</span>
          </p>
          <ul class="space-y-3 text-[var(--text-secondary)] mb-8">
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Everything in Basic</span>
            </li>
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Advanced analytics and insights</span>
            </li>
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Team collaboration features</span>
            </li>
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Priority support</span>
            </li>
            <li class="flex items-start">
              <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
              <span>Early access to new features</span>
            </li>
          </ul>
          <button
            @click="subscribe('YEARLY')"
            class="w-full bg-[var(--primary-dark)] hover:bg-[var(--primary)] text-white font-bold py-3 px-4 rounded-lg transition-colors"
            :disabled="isLoading"
          >
            {{ subscription?.status === 'ACTIVE' ? 'Change Plan' : 'Subscribe Now' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCsrf } from '~/composables/useCsrf'
import { useRoute } from 'vue-router'

const subscription = ref(null)
const isLoading = ref(false)

// Get csrf token
const { csrfToken, fetchCsrfToken } = useCsrf()

// Get query params
const route = useRoute()
const expired = computed(() => route.query.expired === 'true')

// Fetch user data with CSRF token
const fetchUserData = async () => {
  await fetchCsrfToken()
  
  const { data: session } = await useFetch('/api/auth/me', {
    headers: {
      'X-CSRF-Token': csrfToken.value || ''
    }
  })
  
  return session
}

// Fetch current user's subscription
onMounted(async () => {
  isLoading.value = true
  try {
    const session = await fetchUserData()
    subscription.value = session.value?.subscription || null
  } catch (error) {
    console.error('Failed to fetch subscription:', error)
  } finally {
    isLoading.value = false
  }
})

// Format subscription status for display
const formatStatus = (status: string) => {
  const statusMap = {
    'FREE_TRIAL': 'Free Trial',
    'ACTIVE': 'Active',
    'PAST_DUE': 'Past Due',
    'CANCELED': 'Canceled',
    'EXPIRED': 'Expired'
  }
  return statusMap[status] || status
}

// Format date for display
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Handle subscription
const subscribe = async (type: 'MONTHLY' | 'YEARLY') => {
  isLoading.value = true
  try {
    // This will be implemented later when Stripe is integrated
    console.log('Subscribing to', type, 'plan')
    // For now, just show an alert
    alert('Stripe integration coming soon! This will redirect to Stripe checkout.')
  } catch (error) {
    console.error('Subscription error:', error)
  } finally {
    isLoading.value = false
  }
}
</script> 
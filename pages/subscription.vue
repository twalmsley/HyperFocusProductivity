<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
      <div class="space-y-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
        <!-- Monthly Plan -->
        <div class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
          <div class="p-6">
            <h2 class="text-xl leading-6 font-bold text-gray-900">Monthly</h2>
            <p class="mt-4 text-sm text-gray-500">Perfect for individuals who want flexibility.</p>
            <p class="mt-8">
              <span class="text-4xl font-bold text-gray-900">$9.99</span>
              <span class="text-base font-medium text-gray-500">/mo</span>
            </p>
            <button
              @click="subscribe('MONTHLY')"
              class="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
              :disabled="isLoading"
            >
              {{ subscription?.status === 'ACTIVE' ? 'Change Plan' : 'Subscribe Now' }}
            </button>
          </div>
        </div>

        <!-- Annual Plan -->
        <div class="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
          <div class="p-6">
            <h2 class="text-xl leading-6 font-bold text-gray-900">Annual</h2>
            <p class="mt-4 text-sm text-gray-500">Save 20% with our annual plan.</p>
            <p class="mt-8">
              <span class="text-4xl font-bold text-gray-900">$95.88</span>
              <span class="text-base font-medium text-gray-500">/year</span>
            </p>
            <button
              @click="subscribe('YEARLY')"
              class="mt-8 block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
              :disabled="isLoading"
            >
              {{ subscription?.status === 'ACTIVE' ? 'Change Plan' : 'Subscribe Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const subscription = ref(null)
const isLoading = ref(false)

// Fetch current user's subscription
const fetchSubscription = async () => {
  const { data: session } = await useFetch('/api/auth/me')
  if (session.value) {
    subscription.value = session.value.subscription
  }
}

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

// Fetch subscription on component mount
onMounted(fetchSubscription)
</script> 
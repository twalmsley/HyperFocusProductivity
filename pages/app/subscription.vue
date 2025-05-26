<template>
  <div>
    <AppNavHeader v-if="status === 'authenticated'" />
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
            <div>
              <p class="text-gray-600">Type</p>
              <p class="font-semibold">
                {{ subscription.type }}
              </p>
            </div>
            <div>
              <p class="text-gray-600">Level</p>
              <p class="font-semibold">
                {{ subscription.level }}
              </p>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>

        <!-- Subscription Plans -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="bg-white p-8 rounded-lg shadow-md border-t-4"
            :class="plan.isPopular ? 'border-[var(--primary)]' : 'border-[var(--primary-dark)]'"
          >
            <div
              v-if="plan.isPopular"
              class="absolute -top-4 right-8 bg-[var(--primary)] text-white text-sm font-bold px-3 py-1 rounded-full"
            >
            </div>
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-2">{{ plan.name }}</h2>
            <p class="text-[var(--text-secondary)] mb-6">{{ plan.description }}</p>
            <p class="text-4xl font-bold text-[var(--text-primary)] mb-6">
              £{{ plan.price }}<span class="text-lg text-[var(--text-secondary)]">/month</span>
            </p>
            <ul class="space-y-3 text-[var(--text-secondary)] mb-8">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-start"
              >
                <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            
          </div>
        </div>
      </div>
    </div>
  </div>
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
const session = await getSession()

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  type: 'MONTHLY' | 'YEARLY'
  features: string[]
  isPopular?: boolean
}

interface Subscription {
  id: string
  name: string
  status: string
  description: string
  price: number
  type: 'MONTHLY' | 'YEARLY'
  level: 'BASIC' | 'PREMIUM'
}

const subscription = ref<Subscription | null>(null)
const plans = ref<SubscriptionPlan[]>([])
const isLoading = ref(false)

// Fetch current user's subscription and plans
onMounted(async () => {
  isLoading.value = true
  try {
    
    // Fetch user subscription
    const { data: sub }= await useFetch<Subscription>('/api/subscription/current')
    
    subscription.value = sub.value

    // Fetch subscription plans
    const { data: plansData } = await useFetch<SubscriptionPlan[]>('/api/subscription/plans')
    plans.value = plansData.value || []
  } catch (error) {
    console.error('Failed to fetch subscription data:', error)
  } finally {
    isLoading.value = false
  }
})

// Format subscription status for display
const formatStatus = (status: string):string => {
  const statusMap = {
    'FREE_TRIAL': 'Free Trial',
    'ACTIVE': 'Active',
    'PAST_DUE': 'Past Due',
    'CANCELED': 'Cancelled',
    'EXPIRED': 'Expired'
  }
  return statusMap[status] || status
}

</script> 
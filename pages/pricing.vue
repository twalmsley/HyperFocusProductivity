<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Main pricing section -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Simple, Transparent Pricing
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Choose the plan that works best for you with our 14-day free trial. No credit card required to start.
        </p>
        <!-- Billing toggle -->
        <div class="flex items-center justify-center mt-8 space-x-4">
          <span :class="{'text-[var(--text-primary)]': billingCycle === 'MONTHLY', 'text-[var(--text-secondary)]': billingCycle === 'YEARLY'}">Monthly</span>
          <button 
            @click="toggleBillingCycle"
            class="relative inline-flex h-6 w-11 items-center rounded-full bg-[var(--primary)]"
          >
            <span 
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition',
                billingCycle === 'YEARLY' ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
          <span :class="{'text-[var(--text-primary)]': billingCycle === 'YEARLY', 'text-[var(--text-secondary)]': billingCycle === 'MONTHLY'}">Yearly</span>
          <span class="text-sm text-[var(--primary)] font-semibold">Save 20%</span>
        </div>
      </div>
    </section>

    <!-- Pricing plans -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Free Trial -->
          <div class="bg-white p-8 rounded-lg shadow-md border-t-4 border-gray-200">
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-2">Free Trial</h3>
            <p class="text-[var(--text-secondary)] mb-6">Try all features for 14 days</p>
            <div class="text-4xl font-bold text-[var(--text-primary)] mb-6">£0</div>
            <ul class="space-y-3 text-[var(--text-secondary)] mb-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
                <span>Full access to all features</span>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
                <span>No credit card required</span>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
                <span>14 days of unlimited usage</span>
              </li>
            </ul>
            <NuxtLink v-if="status === 'unauthenticated'" to="/login">
              <button class="w-full bg-gray-100 hover:bg-gray-200 text-[var(--text-primary)] font-bold py-3 px-4 rounded-lg transition-colors">
                Start Free Trial
              </button>
            </NuxtLink>
          </div>

          <!-- Basic Plan -->
          <div v-if="basicPlan" class="bg-white p-8 rounded-lg shadow-md border-t-4 border-[var(--primary)] transform md:scale-105 z-10">
            <div v-if="basicPlan.isPopular" class="absolute -top-4 right-8 bg-[var(--primary)] text-white text-sm font-bold px-3 py-1 rounded-full">Popular</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-2">{{ basicPlan.name }}</h3>
            <p class="text-[var(--text-secondary)] mb-6">{{ basicPlan.description }}</p>
            <div class="text-4xl font-bold text-[var(--text-primary)] mb-6">
              £{{ basicPlan.price }}<span class="text-lg text-[var(--text-secondary)]">/{{ billingCycle === 'MONTHLY' ? 'month' : 'year' }}</span>
            </div>
            <ul class="space-y-3 text-[var(--text-secondary)] mb-8">
              <li v-for="feature in basicPlan.features" :key="feature" class="flex items-start">
                <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <NuxtLink v-if="status === 'unauthenticated'" to="/login">
              <button class="w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-4 rounded-lg transition-colors">
                Choose Basic
              </button>
            </NuxtLink>
          </div>

          <!-- Advanced Plan -->
          <div v-if="advancedPlan" class="bg-white p-8 rounded-lg shadow-md border-t-4 border-[var(--primary-dark)]">
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-2">{{ advancedPlan.name }}</h3>
            <p class="text-[var(--text-secondary)] mb-6">{{ advancedPlan.description }}</p>
            <div class="text-4xl font-bold text-[var(--text-primary)] mb-6">
              £{{ advancedPlan.price }}<span class="text-lg text-[var(--text-secondary)]">/{{ billingCycle === 'MONTHLY' ? 'month' : 'year' }}</span>
            </div>
            <ul class="space-y-3 text-[var(--text-secondary)] mb-8">
              <li v-for="feature in advancedPlan.features" :key="feature" class="flex items-start">
                <span class="text-[var(--primary)] mr-2 mt-1">✓</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-2">Coming Soon!</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 bg-[var(--primary-light)]">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div class="max-w-3xl mx-auto space-y-6">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">Do I need a credit card for the free trial?</h3>
            <p class="text-[var(--text-secondary)]">No, you can start your 14-day free trial without providing any payment information.</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">Can I switch plans later?</h3>
            <p class="text-[var(--text-secondary)]">Yes, you can upgrade or downgrade your plan at any time. Changes will take effect in your next billing cycle.</p>
          </div>
          
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-2">What happens when my free trial ends?</h3>
            <p class="text-[var(--text-secondary)]">At the end of your free trial, you'll need to choose a paid plan to continue using HyperFocusProductivity. We'll send you a reminder before your trial expires.</p>
          </div>
        </div>
      </div>
    </section>
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

definePageMeta({
  auth: false
})

// Get user state
const user = useState('user')

// Billing cycle state
const billingCycle = ref<'MONTHLY' | 'YEARLY'>('MONTHLY')

// Fetch subscription plans
const { data: plans } = await useFetch('/api/subscription/plans')

// Computed properties for current plans based on billing cycle
const basicPlan = computed(() => {
  return plans.value?.find(plan => plan.type === billingCycle.value && plan.name === 'Basic Plan')
})

const advancedPlan = computed(() => {
  return plans.value?.find(plan => plan.type === billingCycle.value && plan.name === 'Advanced Plan - Coming Soon!')
})

// Toggle billing cycle
const toggleBillingCycle = () => {
  billingCycle.value = billingCycle.value === 'MONTHLY' ? 'YEARLY' : 'MONTHLY'
}
</script> 
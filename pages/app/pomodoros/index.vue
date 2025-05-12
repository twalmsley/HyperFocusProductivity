<template>
  <div>
    <AppNavHeader v-if="user" />
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Pomodoro</h1>
      <div class="bg-white p-6 rounded-lg shadow-sm mb-8">
        <PomodoroTimer
          :focus-duration="25 * 60"
          :break-duration="5 * 60"
          :rounds="4"
        />
      </div>
      <div class="bg-white rounded-lg shadow-sm">
        <PomodoroStats />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { User, UserSubscription } from '~/server/types'

definePageMeta({
  middleware: ['auth']
})

interface UserWithSubscription extends Omit<User, 'subscription'> {
  subscription: {
    type: 'MONTHLY' | 'YEARLY' | null
    status: 'FREE_TRIAL' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'EXPIRED'
    freeTrialExpiresAt: string
    currentPeriodStart: string | null
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
  } | null
}

const user = ref<UserWithSubscription | null>(null)

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await $fetch<UserWithSubscription>('/api/auth/me')
    user.value = response
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})
</script> 
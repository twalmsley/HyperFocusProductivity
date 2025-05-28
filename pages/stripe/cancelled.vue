<template>
  <div class="min-h-screen bg-[var(--background)]">
    <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Cancelled Section -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <div class="text-[var(--primary)] text-6xl mb-6">❌</div>
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Payment Cancelled
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Your payment process was cancelled. No charges were made to your account.
        </p>
      </div>
    </section>

    <!-- Action Buttons -->
    <section class="py-12">
      <div class="container mx-auto px-4 text-center">
        <div class="flex flex-col md:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <NuxtLink to="/app/subscription">
            <button class="w-full md:w-auto bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
              Try Again
            </button>
          </NuxtLink>
          <NuxtLink to="/app">
            <button class="w-full md:w-auto bg-white hover:bg-gray-100 text-[var(--text-primary)] font-bold py-4 px-8 rounded-lg transition-colors text-lg border border-[var(--primary)]">
              Return to Dashboard
            </button>
          </NuxtLink>
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
  auth: true
})
</script> 
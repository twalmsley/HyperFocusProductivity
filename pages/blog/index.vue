<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Hero Section -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Productivity Blog
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Insights, tips, and research about productivity, focus, and achieving your goals.
        </p>
      </div>
    </section>

    <!-- Blog Posts -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Welcome Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">🎯</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Welcome to HyperFocusProductivity</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              Understanding productivity challenges and how we can help you overcome them.
            </p>
            <NuxtLink 
              to="/blog/welcome" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>

          <!-- Task Planning Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">⏱️</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">The Power of Task Planning and Pomodoro Timers</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              How structured time management can transform your productivity and well-being.
            </p>
            <NuxtLink 
              to="/blog/task-planning-pomodoro" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section v-if="status === 'unauthenticated'" class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Ready to boost your productivity?
        </h2>
        <p class="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          Join thousands of users who have transformed their work habits with HyperFocusProductivity.
        </p>
        <NuxtLink to="/login">
          <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
            Start Your Free Trial
          </button>
        </NuxtLink>
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
</script> 
<template>
  <div class="bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20 text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
        Boost Your Productivity
      </h1>
      <p class="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
        Your personal productivity companion. Stay focused, track progress, and achieve more.
      </p>
      <NuxtLink to="/signup">
        <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
          Get Started Free
        </button>
      </NuxtLink>
    </section>

    <!-- Features Grid -->
    <section class="container mx-auto px-4 py-20">
      <h2 class="text-3xl font-bold text-[var(--text-primary)] text-center mb-12">
        Everything you need to stay focused
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Pomodoro Timer</h3>
          <p class="text-[var(--text-secondary)]">
            Stay focused with customizable work and break sessions.
          </p>
        </div>
        <div class="p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Task Management</h3>
          <p class="text-[var(--text-secondary)]">
            Organize your work with an intuitive task system.
          </p>
        </div>
        <div class="p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Progress Tracking</h3>
          <p class="text-[var(--text-secondary)]">
            Monitor your productivity with detailed session logs.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Ready to boost your productivity?
        </h2>
        <p class="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          Join thousands of users who have transformed their work habits with FocusHub.
        </p>
        <NuxtLink to="/signup">
          <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
            Start Your Free Trial
          </button>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Get user state
const user = useState('user')
</script>

<style>
/* Any custom styles can be added here */
</style> 
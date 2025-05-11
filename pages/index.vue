<template>
  <div class="bg-bg dark:bg-bg-dark">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-20 text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-text dark:text-white mb-6">
        Boost Your Productivity
      </h1>
      <p class="text-xl text-muted dark:text-gray-300 max-w-2xl mx-auto mb-8">
        Your personal productivity companion. Stay focused, track progress, and achieve more.
      </p>
      <button class="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
        Get Started Free
      </button>
    </section>

    <!-- Features Grid -->
    <section class="container mx-auto px-4 py-20">
      <h2 class="text-3xl font-bold text-text dark:text-white text-center mb-12">
        Everything you need to stay focused
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-xl font-bold text-text dark:text-white mb-4">Pomodoro Timer</h3>
          <p class="text-muted dark:text-gray-300">
            Stay focused with customizable work and break sessions.
          </p>
        </div>
        <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-xl font-bold text-text dark:text-white mb-4">Task Management</h3>
          <p class="text-muted dark:text-gray-300">
            Organize your work with an intuitive task system.
          </p>
        </div>
        <div class="p-8 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
          <h3 class="text-xl font-bold text-text dark:text-white mb-4">Progress Tracking</h3>
          <p class="text-muted dark:text-gray-300">
            Monitor your productivity with detailed session logs.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary/5 dark:bg-primary/10 py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-text dark:text-white mb-6">
          Ready to boost your productivity?
        </h2>
        <p class="text-xl text-muted dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of users who have transformed their work habits with FocusHub.
        </p>
        <button class="bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg">
          Start Your Free Trial
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here
</script>

<style>
/* Any custom styles can be added here */
</style> 
<template>
  <!-- AppNavHeader when user is logged in -->
  <AppNavHeader v-if="user" />
  <div class="min-h-screen bg-bg">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-text mb-6">
            Master Your Focus,<br />
            <span class="text-primary">Achieve More</span>
          </h1>
          <p class="text-xl text-muted max-w-2xl mx-auto mb-8">
            Break free from procrastination and overwhelm.
          </p>
          <p class="text-xl text-muted max-w-2xl mx-auto mb-8">
            HyperFocus helps you stay productive with smart time management and tools to help you stay focused.
          </p>
          <div class="flex justify-center gap-4">
            <NuxtLink to="/signup" class="inline-block">
              <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-8 rounded-lg transition-colors">
                Start Free Trial
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
      <!-- Hero Illustration Placeholder -->
      <div class="max-w-6xl mx-auto px-4 mb-12 py-8 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 bg-bg-dark rounded-xl p-6 flex items-center justify-center">
            <img src="/tasks.png" alt="Task Management" class="w-full h-auto object-contain">
          </div>
          <div class="md:w-2/5 bg-bg-dark rounded-xl p-6 flex items-center justify-center">
            <img src="/pomodoro.png" alt="Pomodoro Timer" class="w-4/5 mx-auto h-auto object-contain">
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-bg-dark">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-text mb-16">Powerful Features for Peak Productivity</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-bg p-6 rounded-xl">
            <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <span class="text-primary text-2xl">⏱️</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Smart Pomodoro Timer</h3>
            <p class="text-muted">Customizable work and break intervals with notifications to keep you on track.</p>
          </div>
          <div class="bg-bg p-6 rounded-xl">
            <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <span class="text-primary text-2xl">📝</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Task Management</h3>
            <p class="text-muted">Create, edit, and delete tasks to help you stay on track.</p>
          </div>
          <div class="bg-bg p-6 rounded-xl">
            <div class="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
              <span class="text-primary text-2xl">📊</span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Detailed Analytics</h3>
            <p class="text-muted">Coming soon: Track your productivity patterns and get insights to improve your workflow.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-text mb-16">How It Works</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-48 h-48 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span><img src="/set_goals.png" alt="Task Management" class="w-full h-auto object-contain"></span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Set Your Goals</h3>
            <p class="text-muted">Break down your tasks into manageable chunks and set your focus duration.</p>
          </div>
          <div class="text-center">
            <div class="w-48 h-48 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span><img src="/work_on_task.png" alt="Task Management" class="w-full h-auto object-contain"></span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Start Your Session</h3>
            <p class="text-muted">Begin your focused work period with our smart timer.</p>
          </div>
          <div class="text-center">
            <div class="w-48 h-48 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span><img src="/review_tasks.png" alt="Task Management" class="w-full h-auto object-contain"></span>
            </div>
            <h3 class="text-xl font-semibold mb-2">Track Progress</h3>
            <p class="text-muted">Review your productivity metrics and improve your workflow over time.</p>
          </div>
        </div>
      </div>
    </section>


    <!-- FAQ Section -->
    <section class="py-24">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-text mb-16">Frequently Asked Questions</h2>
        <div class="space-y-6">
          <div class="border-b border-muted pb-6">
            <h3 class="text-xl font-semibold mb-2">How does HyperFocus help with procrastination?</h3>
            <p class="text-muted">Our app breaks down overwhelming tasks into manageable chunks and uses the Pomodoro technique to help you maintain focus and momentum.</p>
          </div>
          <div class="border-b border-muted pb-6">
            <h3 class="text-xl font-semibold mb-2">Can I customize the timer settings?</h3>
            <p class="text-muted">Yes, you can fully customize work and break durations to match your personal productivity rhythm.</p>
          </div>
          <div class="border-b border-muted pb-6">
            <h3 class="text-xl font-semibold mb-2">Is there a free trial available?</h3>
            <p class="text-muted">Yes, we offer a 14-day free trial with full access to all features so you can experience the benefits firsthand.</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import AppNavHeader from '~/components/AppNavHeader.vue';

// Get user state
const user = useState('user')
</script>

<style>
/* Any custom styles can be added here */
</style> 
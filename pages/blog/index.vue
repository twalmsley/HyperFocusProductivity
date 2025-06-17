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

          <!-- Cyclic Tasks Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">🔄</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Mastering Cyclic Tasks: The Key to Sustainable Productivity</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              How to leverage recurring tasks to build consistent habits and achieve long-term goals.
            </p>
            <NuxtLink 
              to="/blog/cyclic-tasks" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>

          <!-- Journal Entries Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">📝</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">The Transformative Power of Journal Entries</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              How daily journaling can enhance your productivity, clarity, and personal growth.
            </p>
            <NuxtLink 
              to="/blog/journal-entries" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>

          <!-- Trackers Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">📊</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Mastering Progress with Trackers</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              How to use trackers to monitor habits, goals, and daily metrics for continuous improvement.
            </p>
            <NuxtLink 
              to="/blog/trackers" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>

          <!-- Declutter Mind Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">🧠</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Declutter Your Mind to Reduce Overwhelm</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              How trying to keep tasks in your head leads to stress, missed deadlines, and constant overwhelm - and how to fix it.
            </p>
            <NuxtLink 
              to="/blog/declutter-mind" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>

          <!-- Task Planning Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">📅</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Task Planning: The 30-7-1 Method</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              How to use strategic time windows to plan your tasks effectively and achieve your goals consistently.
            </p>
            <NuxtLink 
              to="/blog/task-planning" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>

          <!-- Maintaining Focus Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">🎯</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Maintaining Focus: Your Complete Guide</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              Master the art of deep focus with proven strategies for eliminating distractions and optimizing your environment.
            </p>
            <NuxtLink 
              to="/blog/maintaining-focus" 
              class="inline-block text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors"
            >
              Read More →
            </NuxtLink>
          </div>

          <!-- Be Flexible Post -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">🌱</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Be Flexible: No Need to Be 100% Productive</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              Why self-compassion and flexibility are more important than perfect productivity, and how to build a sustainable approach.
            </p>
            <NuxtLink 
              to="/blog/be-flexible" 
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
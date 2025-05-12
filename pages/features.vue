<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Hero Section -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Powerful Features for Peak Productivity
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Everything you need to stay focused, organized, and achieve your goals. Plus, exciting new features coming soon.
        </p>
      </div>
    </section>

    <!-- Current Features -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
          Current Features
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Pomodoro Timer -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">⏱️</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Pomodoro Timer</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              Our intelligent Pomodoro timer helps you maintain focus and prevent burnout through scientifically-proven work intervals.
            </p>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Customizable work/break intervals
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Smart break reminders
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Session statistics
              </li>
            </ul>
          </div>

          <!-- Task Management -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">📋</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Task Management</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              Organize your work with our intuitive task management system that helps you stay on top of your priorities.
            </p>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Drag-and-drop organization
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Due date tracking
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Project categorization
              </li>
            </ul>
          </div>

          <!-- Progress Tracking -->
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-[var(--primary)] text-4xl mb-4">📊</div>
            <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Progress Tracking</h3>
            <p class="text-[var(--text-secondary)] mb-4">
              Monitor your productivity with detailed analytics and insights to help you optimize your workflow.
            </p>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Daily/weekly reports
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Productivity trends
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Goal tracking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Upcoming Features -->
    <section class="py-20 bg-[var(--primary-light)]">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] text-center mb-16">
          Coming Soon
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Task Management with Anti-Procrastination UX -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Task Management with Anti-Procrastination UX</h3>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Visual "just one next step" tools
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Priority sorting based on deadlines and difficulty
              </li>
            </ul>
          </div>

          <!-- Focus Companion Tools -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Focus Companion Tools</h3>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Ambient noise generators, "deep work" playlists
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Site blocker integrations (like Cold Turkey, but smarter)
              </li>
            </ul>
          </div>

          <!-- Progress Visualisers -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Progress Visualisers</h3>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Daily "work streaks," calendar heatmaps
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Show how many Pomodoros were done per project per day
              </li>
            </ul>
          </div>

          <!-- Self-Accountability Tools -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Self-Accountability Tools</h3>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Lightweight digital coworking
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Commit-to-start buttons with soft consequences
              </li>
            </ul>
          </div>

          <!-- Mood/Energy Tracking -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Mood/Energy Tracking</h3>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Tie productivity cycles to energy/mood tracking
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Schedule optimization based on energy patterns
              </li>
            </ul>
          </div>

          <!-- Habit Stackers -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Habit Stackers</h3>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Link Pomodoros to habits
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Custom habit chains and routines
              </li>
            </ul>
          </div>

          <!-- AI Task Breakdown -->
          <div class="bg-white p-6 rounded-lg shadow-md md:col-span-2">
            <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">AI Task Breakdown</h3>
            <ul class="space-y-2 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                User types vague goal → AI breaks into Pomodoro-sized steps
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">→</span>
                Smart task estimation and scheduling
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Ready to boost your productivity?
        </h2>
        <p class="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
          Join thousands of users who have transformed their work habits with HyperFocusProductivity.
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
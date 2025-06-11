<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Mastering Progress with Trackers
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          How to use trackers to monitor habits, goals, and daily metrics for continuous improvement
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              In the journey of self-improvement and productivity, tracking your progress is essential. Our Trackers feature provides a powerful yet simple way to monitor various aspects of your life, from work productivity to personal habits, giving you valuable insights into your daily patterns and progress.
            </p>

            <div class="my-12">
              <img src="/trackers.png" alt="Trackers Interface" class="max-w-2xl mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our intuitive tracker interface helps you visualize your progress over time</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Understanding Trackers</h2>
            
            <p>
              Trackers are flexible tools that allow you to monitor any metric on a scale of 0-100%. They're perfect for:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Habit Formation:</strong> Track daily habits like exercise, meditation, or reading
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Productivity Metrics:</strong> Monitor your focus levels, work efficiency, or task completion rates
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Personal Goals:</strong> Keep track of progress towards specific objectives
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Well-being:</strong> Monitor energy levels, mood, or stress management
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Features of Our Tracker System</h2>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Key Capabilities</h3>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Visual Progress:</strong> Color-coded grid showing 30 days of data at a glance
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Flexible Scoring:</strong> Rate your progress from 0-100% with an intuitive slider
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Historical Data:</strong> Navigate through past entries to identify patterns
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Custom Trackers:</strong> Create and manage multiple trackers for different aspects of your life
                  </div>
                </li>
              </ul>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Getting Started with Trackers</h2>

            <p>
              Here's how to make the most of our tracking system:
            </p>

            <ol class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                <div>
                  <strong>Create a Tracker:</strong> Click the "Create Tracker" button and give it a meaningful name
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                <div>
                  <strong>Daily Updates:</strong> Click on any day in the grid to record your progress
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                <div>
                  <strong>Review Progress:</strong> Use the date navigation to view past periods and identify trends
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">4.</span>
                <div>
                  <strong>Adjust as Needed:</strong> Edit or delete trackers to keep them relevant to your goals
                </div>
              </li>
            </ol>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Best Practices for Effective Tracking</h2>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Be Consistent:</strong> Update your trackers at the same time each day
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Be Honest:</strong> Record accurate values to maintain meaningful data
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Start Small:</strong> Begin with 2-3 trackers and add more as needed
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Review Regularly:</strong> Analyze your patterns weekly or monthly
                </div>
              </li>
            </ul>

            <div v-if="status === 'unauthenticated'" class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Start Tracking Your Progress?</h3>
              <p class="mb-6">
                Try HyperFocusProductivity's tracking features with our 14-day free trial. No credit card required.
              </p>
              <NuxtLink to="/login">
                <button class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  Start Free Trial
                </button>
              </NuxtLink>
            </div>
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
</script> 
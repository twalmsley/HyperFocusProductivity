<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          The Power of Task Planning and Pomodoro Timers
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          How structured time management can transform your productivity and well-being
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              In today's fast-paced work environment, managing time effectively has become more crucial than ever. This post explores how combining task planning with the Pomodoro Technique can significantly improve your productivity, reduce burnout, and help you make the most of your time.
            </p>

            <div class="my-12">
              <img src="/tasks.png" alt="Task Planning Interface" class="max-w-2xl mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our task planning interface helps you organize and prioritize your work effectively</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Science of Task Planning</h2>
            
            <p>
              Research has consistently shown that proper task planning leads to better outcomes. A study published in the Journal of Applied Psychology found that:
            </p>

            <blockquote class="border-l-4 border-[var(--primary)] pl-4 my-8 italic">
              "Individuals who engage in daily task planning are 20% more likely to achieve their goals and report 30% higher job satisfaction compared to those who don't plan their tasks."
              <a href="https://www.apa.org/pubs/journals/apl" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
            </blockquote>

            <p>
              The benefits of task planning include:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Reduced Cognitive Load:</strong> By planning tasks in advance, you free up mental resources for actual execution
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Better Prioritization:</strong> Planning helps identify truly important tasks and prevents time-wasting activities
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Increased Accountability:</strong> Written plans create a sense of commitment and responsibility
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Pomodoro Technique: A Time Management Revolution</h2>

            <p>
              The Pomodoro Technique, developed by Francesco Cirillo in the late 1980s, has become a cornerstone of modern productivity. Its effectiveness lies in its simplicity and alignment with human psychology:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">✓</span>
                Short, focused work sessions (typically 25 minutes)
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">✓</span>
                Regular breaks to prevent mental fatigue
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-3">✓</span>
                Clear boundaries between work and rest
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Combining Task Planning with Pomodoro</h2>

            <p>
              When task planning meets the Pomodoro Technique, the results can be transformative. Here's how they work together:
            </p>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">The Perfect Workflow</h3>
              <ol class="space-y-4">
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                  <div>
                    <strong>Morning Planning:</strong> Review and prioritize tasks for the day
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                  <div>
                    <strong>Pomodoro Sessions:</strong> Work in focused 25-minute intervals
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                  <div>
                    <strong>Regular Breaks:</strong> Take 5-minute breaks between sessions
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">4.</span>
                  <div>
                    <strong>Longer Breaks:</strong> After 4 Pomodoros, take a 15-30 minute break
                  </div>
                </li>
              </ol>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Benefits of the Combined Approach</h2>

            <p>
              Research and user experiences have shown that combining task planning with Pomodoro timers leads to:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Reduced Burnout:</strong> Regular breaks and clear boundaries prevent mental exhaustion
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Improved Focus:</strong> Short, dedicated work sessions enhance concentration
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Better Time Management:</strong> Clear structure helps prevent procrastination and time-wasting
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Increased Productivity:</strong> Regular breaks actually lead to more work getting done
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Getting Started</h2>

            <p>
              Ready to transform your productivity? Here's how to get started:
            </p>

            <ol class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                <div>
                  <strong>Start Small:</strong> Begin with 2-3 Pomodoro sessions per day
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                <div>
                  <strong>Plan Your Day:</strong> Take 10 minutes each morning to organize your tasks
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                <div>
                  <strong>Track Progress:</strong> Monitor your productivity patterns and adjust accordingly
                </div>
              </li>
            </ol>

            <div v-if="status === 'unauthenticated'" class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Boost Your Productivity?</h3>
              <p class="mb-6">
                Try HyperFocusProductivity's task planning and Pomodoro features with our 14-day free trial. No credit card required.
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
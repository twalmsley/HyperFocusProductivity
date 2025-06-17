<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Declutter Your Mind to Reduce Overwhelm
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          How trying to keep tasks in your head leads to stress, missed deadlines, and constant overwhelm - and how to fix it.
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              Have you ever felt like your brain is a cluttered desk with papers scattered everywhere? You know you have important tasks to do, but they're buried under mental clutter, causing constant stress and the feeling that you're always behind. This is what happens when we try to keep everything in our heads instead of using proper systems to organize our thoughts and tasks.
            </p>

            <div class="my-12">
              <img src="/tasks.png" alt="Task Management Interface" class="w-full rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our task management system helps you get everything out of your head and into an organized system</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Problem: Mental Clutter and Cognitive Overload</h2>
            
            <p>
              Research in cognitive psychology has shown that the human brain has limited working memory capacity. According to psychologist George Miller's famous research, we can only hold about 7±2 items in our working memory at any given time. When we try to keep track of dozens of tasks, appointments, and ideas in our heads, we're essentially fighting against our brain's natural limitations.
            </p>

            <blockquote class="border-l-4 border-[var(--primary)] pl-4 my-8 italic">
              "The human brain is not designed to be a storage device. It's designed to be a processing device. When we use it for storage, we're using it inefficiently and causing ourselves unnecessary stress."
              <a href="https://www.psychologytoday.com/us/basics/memory" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
            </blockquote>

            <p>
              The consequences of mental clutter are far-reaching:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Constant Stress:</strong> The nagging feeling that you're forgetting something important creates a persistent state of anxiety
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Missed Tasks:</strong> Important deadlines and commitments slip through the cracks when they're not properly tracked
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Reduced Focus:</strong> Mental energy is wasted on trying to remember what needs to be done instead of actually doing it
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Feeling of Being in a Rush:</strong> When tasks aren't planned, everything feels urgent and important
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Solution: Externalize Your Mental Load</h2>

            <p>
              The key to reducing overwhelm is to get everything out of your head and into a reliable external system. This is where HyperFocusProductivity's features come into play, creating a comprehensive solution for mental decluttering.
            </p>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">The Mental Decluttering System</h3>
              <ol class="space-y-4">
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                  <div>
                    <strong>Capture Everything:</strong> Use Tasks to record every single thing that needs your attention
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                  <div>
                    <strong>Organize Regularly:</strong> Use Cyclic Tasks to establish routines and reduce decision fatigue
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                  <div>
                    <strong>Process and Reflect:</strong> Use Journal Entries to clear your mind and gain clarity
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">4.</span>
                  <div>
                    <strong>Track Progress:</strong> Use Trackers to monitor your habits and celebrate small wins
                  </div>
                </li>
              </ol>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">1. Tasks: Your External Brain</h2>

            <p>
              The foundation of mental decluttering is a reliable task management system. Instead of trying to remember everything, you can trust that your tasks are safely recorded and organized.
            </p>

            <p>
              Learn more about effective task management in our comprehensive guide: 
              <NuxtLink to="/blog/task-planning-pomodoro" class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors">
                The Power of Task Planning and Pomodoro Timers
              </NuxtLink>
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Capture Everything:</strong> Write down every task, no matter how small, to free up mental space
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Prioritize Effectively:</strong> Use our system to identify what's truly important vs. what's just urgent
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Break Down Complex Tasks:</strong> Large projects become manageable when broken into smaller, actionable steps
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">2. Cyclic Tasks: Reduce Decision Fatigue</h2>

            <p>
              One of the biggest sources of mental clutter is having to constantly decide what to do next. Cyclic tasks eliminate this problem by establishing predictable routines.
            </p>

            <p>
              Discover how to master recurring tasks: 
              <NuxtLink to="/blog/cyclic-tasks" class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors">
                Mastering Cyclic Tasks: The Key to Sustainable Productivity
              </NuxtLink>
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Automate Regular Activities:</strong> Set up recurring tasks for daily, weekly, and monthly activities
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Build Consistent Habits:</strong> Use cyclic tasks to establish positive routines that become automatic
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Reduce Mental Load:</strong> When routines are established, you don't need to think about them anymore
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">3. Journal Entries: Clear Your Mental Cache</h2>

            <p>
              Just like a computer needs to clear its cache to run efficiently, your brain benefits from regular mental clearing through journaling.
            </p>

            <p>
              Learn about the transformative power of journaling: 
              <NuxtLink to="/blog/journal-entries" class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors">
                The Transformative Power of Journal Entries
              </NuxtLink>
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Process Thoughts:</strong> Writing helps you work through complex thoughts and emotions
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Gain Clarity:</strong> Journaling helps you identify patterns and understand what's causing overwhelm
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Release Mental Tension:</strong> Getting thoughts out of your head reduces cognitive load
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">4. Trackers: Monitor Your Progress</h2>

            <p>
              Tracking your habits and progress provides valuable feedback and helps you stay motivated while reducing the mental effort of remembering what you've accomplished.
            </p>

            <p>
              Master the art of progress tracking: 
              <NuxtLink to="/blog/trackers" class="text-[var(--primary)] hover:text-[var(--button-hover)] transition-colors">
                Mastering Progress with Trackers
              </NuxtLink>
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Visual Progress:</strong> See your accomplishments at a glance, reducing the need to remember everything
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Identify Patterns:</strong> Trackers help you understand what's working and what needs adjustment
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Stay Motivated:</strong> Seeing progress reduces overwhelm and increases confidence
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Benefits of Mental Decluttering</h2>

            <p>
              When you implement this comprehensive system, you'll experience:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Reduced Stress:</strong> No more worrying about forgetting important tasks or deadlines
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Improved Focus:</strong> Mental energy is freed up for actual work instead of trying to remember what to do
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Better Sleep:</strong> A clear mind leads to better rest and reduced nighttime anxiety
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Increased Productivity:</strong> When you're not overwhelmed, you can work more efficiently and effectively
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Getting Started with Mental Decluttering</h2>

            <p>
              Ready to declutter your mind and reduce overwhelm? Here's your action plan:
            </p>

            <ol class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                <div>
                  <strong>Brain Dump:</strong> Take 15 minutes to write down every single task, idea, and commitment that's in your head
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                <div>
                  <strong>Set Up Your System:</strong> Use HyperFocusProductivity to organize everything you captured
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                <div>
                  <strong>Establish Daily Routines:</strong> Create cyclic tasks for your most important daily activities
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">4.</span>
                <div>
                  <strong>Start Journaling:</strong> Begin with 5 minutes of daily journaling to clear your mental cache
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">5.</span>
                <div>
                  <strong>Track Your Progress:</strong> Set up trackers to monitor your decluttering journey
                </div>
              </li>
            </ol>

            <div v-if="status === 'unauthenticated'" class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Declutter Your Mind?</h3>
              <p class="mb-6">
                Start your journey to mental clarity with HyperFocusProductivity's comprehensive decluttering system. Try our 14-day free trial today.
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
<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Task Planning: The 30-7-1 Method
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          How to use strategic time windows to plan your tasks effectively and achieve your goals consistently.
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              Effective task planning is the foundation of productivity. But planning isn't just about making to-do lists—it's about creating a strategic system that helps you see the big picture while managing the details. The 30-7-1 method provides a structured approach to planning that ensures nothing falls through the cracks while keeping you focused on what matters most.
            </p>

            <div class="my-12">
              <img src="/tasks.png" alt="Task Planning Interface" class="w-full rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our task planning interface supports multiple time windows for comprehensive planning</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Problem with Traditional Task Planning</h2>
            
            <p>
              Most people approach task planning in a reactive way—they create lists of things to do without considering the bigger picture. This leads to:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Short-term thinking:</strong> Focusing only on today's tasks without considering long-term goals
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Overwhelm:</strong> Trying to tackle everything at once without proper prioritization
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Missed opportunities:</strong> Failing to see how daily actions connect to larger objectives
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Inconsistent progress:</strong> Working hard but not necessarily working on the right things
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The 30-7-1 Method: A Strategic Approach</h2>

            <p>
              The 30-7-1 method is a hierarchical planning system that helps you maintain perspective across different time horizons. Each window serves a specific purpose and builds upon the others to create a comprehensive planning strategy.
            </p>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">The Three Planning Windows</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="text-[var(--primary)] text-3xl mb-2">📅</div>
                  <h4 class="font-bold text-[var(--text-primary)] mb-2">30-Day Window</h4>
                  <p class="text-sm">Strategic planning and goal setting</p>
                </div>
                <div class="text-center">
                  <div class="text-[var(--primary)] text-3xl mb-2">📋</div>
                  <h4 class="font-bold text-[var(--text-primary)] mb-2">7-Day Window</h4>
                  <p class="text-sm">Weekly organization and preparation</p>
                </div>
                <div class="text-center">
                  <div class="text-[var(--primary)] text-3xl mb-2">🎯</div>
                  <h4 class="font-bold text-[var(--text-primary)] mb-2">1-Day Window</h4>
                  <p class="text-sm">Daily execution and focus</p>
                </div>
              </div>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">1. The 30-Day Window: Strategic Planning</h2>

            <p>
              The 30-day window is your strategic planning horizon. This is where you set the direction and ensure your daily actions align with your larger goals.
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">When to Use: Weekly Review</h3>
            
            <p>
              Set aside time every week (ideally on the same day) to review and plan your 30-day window. This is your opportunity to:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Review monthly goals:</strong> Check progress on your key objectives for the month
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Plan major projects:</strong> Break down large initiatives into manageable weekly milestones
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Identify potential conflicts:</strong> Spot scheduling issues before they become problems
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Adjust priorities:</strong> Shift focus based on changing circumstances or new information
                </div>
              </li>
            </ul>

            <div class="bg-[var(--primary-light)] p-6 rounded-lg my-8">
              <h4 class="font-bold text-[var(--text-primary)] mb-3">30-Day Planning Questions:</h4>
              <ul class="space-y-2 text-sm">
                <li>• What are my top 3 priorities for this month?</li>
                <li>• What major projects need to be completed?</li>
                <li>• Are there any deadlines or important events coming up?</li>
                <li>• What habits do I want to establish or improve?</li>
                <li>• How will I measure success this month?</li>
              </ul>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">2. The 7-Day Window: Weekly Organization</h2>

            <p>
              The 7-day window bridges the gap between strategic planning and daily execution. This is where you translate monthly goals into weekly action plans.
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">When to Use: Every Morning</h3>
            
            <p>
              Start each day with a 10-minute "warm-up" period to review your 7-day window. This morning ritual helps you:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Review the coming week:</strong> See what's ahead and prepare mentally for upcoming challenges
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Assess weekly progress:</strong> Check how you're tracking against your weekly goals
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Plan today's priorities:</strong> Identify the most important tasks for the current day
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Adjust as needed:</strong> Make changes based on new information or changing priorities
                </div>
              </li>
            </ul>

            <div class="bg-[var(--primary-light)] p-6 rounded-lg my-8">
              <h4 class="font-bold text-[var(--text-primary)] mb-3">7-Day Planning Questions:</h4>
              <ul class="space-y-2 text-sm">
                <li>• What are my top priorities for this week?</li>
                <li>• What deadlines are coming up in the next 7 days?</li>
                <li>• What meetings or appointments do I need to prepare for?</li>
                <li>• What progress do I need to make on ongoing projects?</li>
                <li>• What can I delegate or eliminate this week?</li>
              </ul>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">3. The 1-Day Window: Daily Execution</h2>

            <p>
              The 1-day window is where the rubber meets the road. This is your focused execution time where you turn plans into reality.
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">The 10-Minute Warm-Up</h3>
            
            <p>
              Begin each day with a dedicated 10-minute planning session. This is your most important daily habit—it sets the tone for everything that follows.
            </p>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h4 class="text-xl font-bold text-[var(--text-primary)] mb-4">Your 10-Minute Morning Routine</h4>
              <ol class="space-y-3">
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                  <div>
                    <strong>Review yesterday (2 minutes):</strong> What went well? What could be improved?
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                  <div>
                    <strong>Check today's schedule (2 minutes):</strong> Review meetings, appointments, and time blocks
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                  <div>
                    <strong>Identify top 3 priorities (3 minutes):</strong> What must get done today?
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">4.</span>
                  <div>
                    <strong>Plan your energy (3 minutes):</strong> Match tasks to your energy levels throughout the day
                  </div>
                </li>
              </ol>
            </div>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">The Tomorrow Window: End-of-Day Review</h3>
            
            <p>
              At the end of each day, take 5 minutes to review your day and prepare for tomorrow. This creates a smooth transition and sets you up for success the next morning.
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Review today's accomplishments:</strong> Celebrate wins and note what was completed
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Check tomorrow's tasks:</strong> Review what's coming up and mentally prepare
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Note any carryover:</strong> Move incomplete tasks to the next day if necessary
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Set intentions:</strong> Decide on your mindset and approach for tomorrow
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Integrating the Windows with HyperFocusProductivity</h2>

            <p>
              HyperFocusProductivity's task management system is designed to support this multi-window approach seamlessly:
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h4 class="font-bold text-[var(--text-primary)] mb-3">30-Day Planning</h4>
                <ul class="space-y-2 text-sm">
                  <li>• Use project views for major initiatives</li>
                  <li>• Set monthly goals and track progress</li>
                  <li>• Create recurring review tasks</li>
                  <li>• Use tags for different time horizons</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h4 class="font-bold text-[var(--text-primary)] mb-3">7-Day Planning</h4>
                <ul class="space-y-2 text-sm">
                  <li>• Use weekly views and filters</li>
                  <li>• Set weekly priorities and deadlines</li>
                  <li>• Create daily planning routines</li>
                  <li>• Use the calendar integration</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h4 class="font-bold text-[var(--text-primary)] mb-3">1-Day Planning</h4>
                <ul class="space-y-2 text-sm">
                  <li>• Use the daily task view</li>
                  <li>• Set priority levels for tasks</li>
                  <li>• Use time blocking features</li>
                  <li>• Track daily progress</li>
                </ul>
              </div>
              <div class="bg-white p-6 rounded-lg shadow-md">
                <h4 class="font-bold text-[var(--text-primary)] mb-3">Review & Reflection</h4>
                <ul class="space-y-2 text-sm">
                  <li>• Use journal entries for reflection</li>
                  <li>• Track completion rates</li>
                  <li>• Review weekly and monthly reports</li>
                  <li>• Adjust strategies based on data</li>
                </ul>
              </div>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Benefits of the 30-7-1 Method</h2>

            <p>
              When you implement this systematic approach to task planning, you'll experience:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Better perspective:</strong> You'll see how daily actions connect to larger goals
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Reduced overwhelm:</strong> Breaking planning into manageable windows prevents cognitive overload
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Improved focus:</strong> Clear priorities help you stay on track throughout the day
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Greater consistency:</strong> Regular review cycles help you maintain momentum
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Better decision-making:</strong> Multiple planning windows provide context for better choices
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Getting Started with the 30-7-1 Method</h2>

            <p>
              Ready to transform your task planning? Here's your implementation roadmap:
            </p>

            <ol class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                <div>
                  <strong>Start with the 1-day window:</strong> Implement the 10-minute morning routine first
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                <div>
                  <strong>Add the 7-day window:</strong> Once daily planning is a habit, add weekly reviews
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                <div>
                  <strong>Implement the 30-day window:</strong> Finally, add monthly strategic planning
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">4.</span>
                <div>
                  <strong>Refine and adjust:</strong> Customize the method to fit your specific needs and preferences
                </div>
              </li>
            </ol>

            <div v-if="status === 'unauthenticated'" class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Master Task Planning?</h3>
              <p class="mb-6">
                Start implementing the 30-7-1 method with HyperFocusProductivity's comprehensive task management system. Try our 14-day free trial today.
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
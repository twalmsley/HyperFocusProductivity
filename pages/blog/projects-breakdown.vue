<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="status === 'authenticated'" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Breaking Down Big Tasks: How Projects Help You Get Started
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          Transform overwhelming tasks into manageable chunks and build momentum with our Projects feature.
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              Have you ever stared at a massive task and felt completely paralyzed? That overwhelming feeling of "where do I even start?" is one of the biggest productivity killers. The good news is that our Projects feature is specifically designed to help you break down these intimidating tasks into bite-sized pieces that feel achievable and build momentum.
            </p>

            <div class="my-12">
              <img src="/set_goals.png" alt="Projects Interface" class="w-full rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our Projects feature helps you visualize progress and break down complex tasks</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Psychology of Task Inertia</h2>
            
            <p>
              When we face a large, complex task, our brain often responds with resistance. This isn't laziness—it's a natural psychological response to perceived overwhelm. Research in behavioral psychology shows that:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Large tasks trigger avoidance:</strong> When something feels too big, our brain defaults to procrastination as a protective mechanism
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Progress creates momentum:</strong> Once we start making progress, even small wins, our motivation and confidence increase significantly
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Visual progress is motivating:</strong> Seeing tangible evidence of work completed activates our reward system and encourages continued effort
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Small steps reduce anxiety:</strong> Breaking tasks into smaller pieces reduces the cognitive load and makes starting feel less intimidating
                </div>
              </li>
            </ul>

            <div class="bg-[var(--primary-light)] p-6 rounded-lg my-8">
              <h4 class="font-bold text-[var(--text-primary)] mb-3">The Science Behind It:</h4>
              <p class="text-sm">
                Studies in the Journal of Applied Psychology show that people who break down large goals into smaller, specific tasks are 2.5 times more likely to achieve their objectives compared to those who set only large, vague goals.
                <a href="https://www.apa.org/pubs/journals/apl" target="_blank" rel="noopener noreferrer" class="text-[var(--primary)] hover:underline ml-2">[Source]</a>
              </p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">How Projects Transform Overwhelming Tasks</h2>

            <p>
              Our Projects feature is built on the principle that every large task is just a collection of smaller, manageable pieces. By creating a project, you're essentially creating a roadmap that turns "I need to write a book" into "I need to write 250 words today."
            </p>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">The Project Breakdown Process</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="text-center">
                  <div class="text-[var(--primary)] text-3xl mb-2">🎯</div>
                  <h4 class="font-bold text-[var(--text-primary)] mb-2">Define the Goal</h4>
                  <p class="text-sm">What exactly do you want to accomplish?</p>
                </div>
                <div class="text-center">
                  <div class="text-[var(--primary)] text-3xl mb-2">✂️</div>
                  <h4 class="font-bold text-[var(--text-primary)] mb-2">Break It Down</h4>
                  <p class="text-sm">Split into smaller, actionable tasks</p>
                </div>
                <div class="text-center">
                  <div class="text-[var(--primary)] text-3xl mb-2">📊</div>
                  <h4 class="font-bold text-[var(--text-primary)] mb-2">Track Progress</h4>
                  <p class="text-sm">Visualize your momentum and success</p>
                </div>
              </div>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Art of Task Chunking</h2>

            <p>
              The key to effective task breakdown is finding the sweet spot between "too small to matter" and "too big to start." Each chunk should be:
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Small Enough to Start</h3>
            
            <p>
              The ideal task size is one that you can complete in 15-45 minutes. This timeframe is perfect because:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>It feels achievable:</strong> You can see the finish line from the start, reducing mental resistance
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>It fits into busy schedules:</strong> Even on hectic days, you can find 15-45 minutes
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>It builds momentum:</strong> Completing one chunk makes starting the next one easier
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>It provides quick wins:</strong> Regular completion creates a sense of progress and achievement
                </div>
              </li>
            </ul>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Significant Enough to Matter</h3>
            
            <p>
              While tasks should be small, they also need to feel meaningful. Each chunk should:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Move you closer to your goal:</strong> Each completed task should represent real progress
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Be specific and measurable:</strong> You should know exactly when it's done
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Feel satisfying to complete:</strong> There should be a sense of accomplishment
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Build on previous work:</strong> Each chunk should prepare you for the next one
                </div>
              </li>
            </ul>

            <div class="my-12">
              <img src="/tasks.png" alt="Task Breakdown Example" class="w-full rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Break down large projects into manageable, trackable tasks</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Power of Visual Progress</h2>

            <p>
              One of the most powerful features of our Projects system is the progress bar. This simple visual element serves as a constant reminder of your momentum and can be incredibly motivating.
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">How Progress Bars Motivate</h3>
            
            <p>
              The progress bar works on multiple psychological levels:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Visual confirmation:</strong> You can literally see your progress, making abstract goals concrete
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Momentum tracking:</strong> Each completed task moves the bar forward, creating a sense of forward motion
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Goal proximity:</strong> As the bar fills, you feel closer to completion, increasing motivation
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Commitment reinforcement:</strong> Seeing partial progress makes you more likely to continue
                </div>
              </li>
            </ul>

            <div class="bg-[var(--primary-light)] p-6 rounded-lg my-8">
              <h4 class="font-bold text-[var(--text-primary)] mb-3">Progress Bar Psychology:</h4>
              <p class="text-sm">
                Research shows that people are 15% more likely to complete tasks when they can see visual progress indicators. The simple act of seeing a progress bar increases completion rates by making abstract goals feel more tangible and achievable.
              </p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Real-World Examples: From Overwhelm to Action</h2>

            <p>
              Let's look at how this works in practice with some common scenarios:
            </p>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Example 1: Writing a Book</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-[var(--primary)] pl-4">
                  <strong class="text-[var(--text-primary)]">Overwhelming Goal:</strong> "Write a 50,000-word book"
                </div>
                <div class="border-l-4 border-green-500 pl-4">
                  <strong class="text-[var(--text-primary)]">Project Breakdown:</strong>
                  <ul class="mt-2 space-y-1 text-sm">
                    <li>• Research phase (5 tasks)</li>
                    <li>• Outline creation (3 tasks)</li>
                    <li>• Chapter 1 draft (4 tasks)</li>
                    <li>• Chapter 2 draft (4 tasks)</li>
                    <li>• Continue for all chapters...</li>
                    <li>• Editing and revision (8 tasks)</li>
                    <li>• Final polish (3 tasks)</li>
                  </ul>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                  <strong class="text-[var(--text-primary)]">Daily Task:</strong> "Write 500 words for Chapter 3"
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Example 2: Home Renovation</h3>
              <div class="space-y-4">
                <div class="border-l-4 border-[var(--primary)] pl-4">
                  <strong class="text-[var(--text-primary)]">Overwhelming Goal:</strong> "Renovate the entire kitchen"
                </div>
                <div class="border-l-4 border-green-500 pl-4">
                  <strong class="text-[var(--text-primary)]">Project Breakdown:</strong>
                  <ul class="mt-2 space-y-1 text-sm">
                    <li>• Research and planning (4 tasks)</li>
                    <li>• Demolition (3 tasks)</li>
                    <li>• Electrical work (2 tasks)</li>
                    <li>• Plumbing (2 tasks)</li>
                    <li>• Cabinets installation (3 tasks)</li>
                    <li>• Countertop installation (2 tasks)</li>
                    <li>• Appliances (2 tasks)</li>
                    <li>• Finishing touches (3 tasks)</li>
                  </ul>
                </div>
                <div class="border-l-4 border-blue-500 pl-4">
                  <strong class="text-[var(--text-primary)]">Daily Task:</strong> "Remove old cabinet doors and hardware"
                </div>
              </div>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Building Momentum Through Small Wins</h2>

            <p>
              The secret to overcoming task inertia isn't just breaking things down—it's creating a system of small wins that build confidence and momentum. Each completed task should feel like a victory, no matter how small.
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">The Momentum Cycle</h3>
            
            <p>
              When you complete a small task, several positive things happen:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Confidence increases:</strong> You prove to yourself that you can make progress
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Motivation builds:</strong> Success breeds the desire for more success
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Resistance decreases:</strong> Starting the next task feels easier
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Progress becomes visible:</strong> The progress bar moves, reinforcing your efforts
                </div>
              </li>
            </ul>

            <div class="my-12">
              <img src="/work_on_task.png" alt="Task Completion" class="w-full rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Each completed task builds momentum and confidence for the next one</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Getting Started: Your Action Plan</h2>

            <p>
              Ready to transform your overwhelming tasks into manageable projects? Here's how to get started:
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Step 1: Identify Your Overwhelming Task</h3>
            
            <p>
              Think about the task that's been sitting in your mind, causing stress and avoidance. It might be:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>A work project</strong> that feels too complex to tackle
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>A personal goal</strong> that seems too big to start
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>A home improvement project</strong> that feels overwhelming
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>A learning objective</strong> that seems too vast
                </div>
              </li>
            </ul>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Step 2: Create Your Project</h3>
            
            <p>
              In our Projects feature, create a new project and give it a clear, specific name. Then break it down into phases or major components.
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Step 3: Break Down Each Phase</h3>
            
            <p>
              For each phase, create individual tasks that are:
            </p>

            <div class="bg-[var(--primary-light)] p-6 rounded-lg my-8">
              <h4 class="font-bold text-[var(--text-primary)] mb-3">Task Breakdown Checklist:</h4>
              <ul class="space-y-2 text-sm">
                <li>✓ Specific and measurable</li>
                <li>✓ Achievable in 15-45 minutes</li>
                <li>✓ Meaningful progress toward the goal</li>
                <li>✓ Clear completion criteria</li>
                <li>✓ Something you can start immediately</li>
              </ul>
            </div>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Step 4: Start with the Easiest Task</h3>
            
            <p>
              Choose the task that feels the least intimidating. The goal is to get a quick win and build momentum. Once you complete that first task, the next one will feel easier.
            </p>

            <h3 class="text-2xl font-bold text-[var(--text-primary)] mt-8 mb-4">Step 5: Celebrate Progress</h3>
            
            <p>
              Each time you complete a task, take a moment to acknowledge your progress. Watch the progress bar move forward and let that visual confirmation motivate you to continue.
            </p>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Transformative Power of Small Steps</h2>

            <p>
              When you break down overwhelming tasks into manageable chunks, something magical happens. Tasks that once felt impossible become achievable. Projects that seemed endless start to show clear progress. And most importantly, you build the confidence and momentum to tackle even bigger challenges.
            </p>

            <p class="mt-6">
              The key insight is that productivity isn't about doing everything at once—it's about making consistent, meaningful progress. By using our Projects feature to break down your goals, you're not just organizing your work; you're creating a system that builds momentum, reduces overwhelm, and increases your chances of success.
            </p>

            <div v-if="status === 'unauthenticated'" class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Break Down Your Big Tasks?</h3>
              <p class="mb-6">
                Start using our Projects feature today to transform overwhelming goals into manageable, achievable steps. Join thousands of users who have discovered the power of breaking down big tasks.
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
<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          Mastering Cyclic Tasks: The Key to Sustainable Productivity
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          How to leverage recurring tasks to build consistent habits and achieve long-term goals
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              In the pursuit of productivity, we often focus on one-time tasks while overlooking the power of cyclic tasks. These recurring activities form the backbone of our daily routines and long-term success. Let's explore how to effectively implement and manage cyclic tasks to create lasting positive habits.
            </p>

            <div class="my-12">
              <img src="/cyclic-tasks.png" alt="Cyclic Tasks Interface" class="max-w-2xl mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our cyclic tasks interface helps you maintain consistent routines and build lasting habits</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Understanding Cyclic Tasks</h2>
            
            <p class="lead text-xl">
              Cyclic tasks are activities that repeat at irregular intervals. These are groups of tasks that you work through one at a time, usually in the same order, but not necessarily so. Some examples of cyclic tasks are:
            </p>

            <ol class="list-decimal list-inside my-4 text-xl">
                <li>Cleaning your home</li>
                <li>Exercising</li>
                <li>Seeing your friends</li>
            </ol>
            <p class="my-4 text-xl">Your home cleaning tasks can be broken down by rooms, and you can work through them one at a time to spread the workload over several days rather than spending most of a day cleaning the whole home. Each time you complete a task it jumps to the bottom of the list so that it comes back round to the top eventually, once the other tasks in the cycle are completed.
            </p>
            <p class="my-4 text-xl">
                Having a list of exercises, and perhaps yoga or stretching routines, can be easier to work through cyclically rather than allocating them to specific days of the week. Just do whatever exercise is at the top of the list and mark it as complete - it will come back around once the other exercises are completed.
            </p>
            <p class="my-4 text-xl">
                Sometimes we forget to meet up with certain friends, and we don't want to forget about them. So we add them to a list of friends to see, and we work through the list one at a time. Friends we haven't seen in a while get bumped to the top of the list, which helps us remember to see them.
            </p>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Combining Cyclic Tasks with Other Tasks</h2>
            <p class="my-4 text-xl">
                Use ordinary repeating tasks such as "Clean Something" daily, "Do Exercise" daily, "See a Friend" weekly, etc. to help you work through your cyclic tasks.
            </p>
            <p class="my-4 text-xl">
                Each time you complete a cycling task, it will appear as a completed task in the "Tasks" section. This helps you track your progress and see how you are doing.
            </p>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">More Examples</h2>
            <p class="my-4 text-xl">
                Here are some more examples of cyclic tasks that can benefit from this approach:
            </p>
            <ol class="list-decimal list-inside my-4 text-xl">
                <li>Garden maintenance</li>
                <li>House maintenance</li>
                <li>Car maintenance</li>
            </ol>
            
            <div v-if="status === 'unauthenticated'" class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Master Your Cyclic Tasks?</h3>
              <p class="mb-6">
                Try HyperFocusProductivity's cyclic task management features with our 14-day free trial. No credit card required.
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
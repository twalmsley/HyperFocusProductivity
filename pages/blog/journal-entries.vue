<template>
  <div class="min-h-screen bg-[var(--background)]">
    <!-- AppNavHeader when user is logged in -->
    <AppNavHeader v-if="user" />
    <!-- Blog Post Header -->
    <section class="bg-[var(--primary-light)] py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
          The Transformative Power of Journal Entries
        </h1>
        <p class="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
          How daily journaling can enhance your productivity, clarity, and personal growth
        </p>
      </div>
    </section>

    <!-- Blog Post Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p class="lead text-xl">
              In our fast-paced digital world, taking time to reflect through journaling might seem like a luxury. However, research shows that regular journaling can significantly improve productivity, mental clarity, and personal development. Let's explore how incorporating journal entries into your daily routine can transform your approach to work and life.
            </p>

            <div class="my-12">
              <img src="/journal.png" alt="Journal Interface" class="max-w-2xl mx-auto rounded-lg shadow-lg">
              <p class="text-sm text-gray-500 mt-2 text-center">Our journal interface helps you capture thoughts, track progress, and reflect on your journey</p>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">The Science Behind Journaling</h2>
            
            <p>
              Studies have shown that regular journaling can lead to remarkable benefits:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Enhanced Problem-Solving:</strong> Writing helps organize thoughts and identify solutions
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Stress Reduction:</strong> Journaling can lower cortisol levels and improve emotional well-being
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Improved Memory:</strong> Writing helps consolidate learning and experiences
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Types of Journal Entries</h2>

            <p>
              Different types of journal entries serve different purposes in your productivity journey:
            </p>

            <div class="bg-white p-6 rounded-lg shadow-md my-8">
              <h3 class="text-xl font-bold text-[var(--text-primary)] mb-4">Common Journal Types</h3>
              <ul class="space-y-4">
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Morning Pages:</strong> Stream-of-consciousness writing to clear your mind
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Gratitude Journal:</strong> Focusing on positive aspects of your day
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Progress Log:</strong> Tracking goals and achievements
                  </div>
                </li>
                <li class="flex items-start">
                  <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                  <div>
                    <strong>Reflection Journal:</strong> Analyzing experiences and lessons learned
                  </div>
                </li>
              </ul>
            </div>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Best Practices for Effective Journaling</h2>

            <p>
              To make the most of your journaling practice, consider these strategies:
            </p>

            <ul class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Consistency is Key:</strong> Set aside a regular time for journaling
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Be Honest:</strong> Write authentically without self-censorship
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Use Prompts:</strong> Start with guided questions when inspiration is low
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">•</span>
                <div>
                  <strong>Review Regularly:</strong> Look back on entries to track growth and patterns
                </div>
              </li>
            </ul>

            <h2 class="text-3xl font-bold text-[var(--text-primary)] mt-12 mb-6">Getting Started with Journaling</h2>

            <p>
              Ready to begin your journaling journey? Here's how to start:
            </p>

            <ol class="space-y-4 my-8">
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">1.</span>
                <div>
                  <strong>Choose Your Format:</strong> Digital or paper, find what works for you
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">2.</span>
                <div>
                  <strong>Start Small:</strong> Begin with 5-10 minutes of writing
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">3.</span>
                <div>
                  <strong>Create a Routine:</strong> Pick a consistent time and place
                </div>
              </li>
              <li class="flex items-start">
                <span class="text-[var(--primary)] mr-3 mt-1">4.</span>
                <div>
                  <strong>Use Templates:</strong> Start with structured formats if needed
                </div>
              </li>
            </ol>

            <div v-if="status === 'unauthenticated'" class="bg-[var(--primary-light)] p-8 rounded-lg mt-12">
              <h3 class="text-2xl font-bold text-[var(--text-primary)] mb-4">Ready to Start Your Journaling Journey?</h3>
              <p class="mb-6">
                Try HyperFocusProductivity's journaling features with our 14-day free trial. No credit card required.
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
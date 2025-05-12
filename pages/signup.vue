<template>
  <div class="min-h-screen bg-[var(--background)] py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Motivational Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
            Start Your Productivity Journey Today
          </h1>
          <p class="text-xl text-[var(--text-secondary)] mb-8">
            Join thousands of successful professionals who have transformed their work habits with FocusHub. Your future self will thank you.
          </p>
          <div class="bg-[var(--primary-light)] p-6 rounded-lg mb-8">
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Why Choose FocusHub?
            </h2>
            <ul class="text-left space-y-3 text-[var(--text-secondary)]">
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Boost your productivity by up to 40%
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Join a community of focused achievers
              </li>
              <li class="flex items-center">
                <span class="text-[var(--primary)] mr-2">✓</span>
                Start with a 14-day free trial
              </li>
            </ul>
          </div>
        </div>

        <!-- Signup Form -->
        <form class="bg-white p-8 rounded-lg shadow-md">
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-[var(--text-primary)] mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-[var(--text-primary)] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-[var(--text-primary)] mb-2">Password</label>
              <input
                type="password"
                id="password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Create a password"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create Your Free Account
            </button>
          </div>
          <p class="mt-4 text-center text-sm text-[var(--text-secondary)]">
            Already have an account? 
            <NuxtLink to="/login" class="text-[var(--primary)] hover:underline">Log in</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Form handling logic can be added here
</script> 
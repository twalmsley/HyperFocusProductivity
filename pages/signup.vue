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
            Join thousands of successful professionals who have transformed their work habits with HyperFocusProductivity. Your future self will thank you.
          </p>
          <div class="bg-[var(--primary-light)] p-6 rounded-lg mb-8">
            <h2 class="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Why Choose HyperFocusProductivity?
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
        <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-lg shadow-md">
          <div class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-[var(--text-primary)] mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="form.username"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-[var(--text-primary)] mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-[var(--text-primary)] mb-2">Password</label>
              <input
                type="password"
                id="password"
                v-model="form.password"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Create a password"
                required
              />
            </div>
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-[var(--text-primary)] mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="form.confirmPassword"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <div v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</div>
            
            <button
              type="submit"
              class="w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-bold py-3 px-6 rounded-lg transition-colors"
              :disabled="loading"
            >
              {{ loading ? 'Creating account...' : 'Create Your Free Account' }}
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
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const loading = ref(false)

// Add user state
const user = useState('user')

// Check if user is already logged in
onMounted(async () => {
  try {
    const response = await $fetch('/api/auth/me')
    if (response) {
      user.value = response
      await navigateTo('/app', { replace: true })
    }
  } catch (error) {
    // User is not logged in, stay on signup page
  }
})

async function handleSubmit() {
  error.value = ''
  
  // Validate all fields are filled
  if (!form.value.username.trim()) {
    error.value = 'Name is required'
    return
  }
  if (!form.value.email.trim()) {
    error.value = 'Email is required'
    return
  }
  if (!form.value.password) {
    error.value = 'Password is required'
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    const response = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      }
    })

    // Update user state
    user.value = response.user

    // Wait a moment for the cookie to be set
    await new Promise(resolve => setTimeout(resolve, 100))

    // Navigate to the app page
    await navigateTo('/app', { replace: true })
  } catch (e: any) {
    // Handle errors gracefully
    if (e.response) {
      if (e.response.status === 400 && e.response._data.message === 'Username or email already exists') {
        error.value = 'An account with this email already exists'
      } else {
        error.value = e.response._data.message || 'An error occurred during signup'
      }
    } else {
      error.value = 'An error occurred during signup. Please try again.'
    }
    console.error('Signup error:', e)
  } finally {
    loading.value = false
  }
}
</script> 
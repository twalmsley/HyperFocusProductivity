<template>
  <div class="min-h-screen bg-[var(--background)]">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto bg-[var(--card-background)] rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Login to Your Account</h1>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--input-background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-[var(--text-primary)] mb-1">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--input-background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>

          <button
            type="submit"
            class="w-full bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white font-medium py-2 px-4 rounded-lg transition-colors"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <p class="text-center text-sm text-[var(--text-secondary)]">
            Don't have an account?
            <NuxtLink to="/signup" class="text-[var(--primary)] hover:underline">Sign up</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const form = ref({
  email: '',
  password: ''
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
      const route = useRoute()
      const redirectPath = route.query.redirect as string || '/app'
      await navigateTo(redirectPath, { replace: true })
    }
  } catch (error) {
    // User is not logged in, stay on login page
  }
})

async function handleSubmit() {
  error.value = ''
  
  // Validate all fields are filled
  if (!form.value.email.trim()) {
    error.value = 'Email is required'
    return
  }
  if (!form.value.password) {
    error.value = 'Password is required'
    return
  }

  loading.value = true

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.value.email,
        password: form.value.password
      }
    })

    // Update user state
    user.value = response.user

    // Wait a moment for the cookie to be set
    await new Promise(resolve => setTimeout(resolve, 100))

    // Get the redirect URL from the query parameters, default to /app
    const route = useRoute()
    const redirectPath = route.query.redirect as string || '/app'

    // Navigate to the redirect path or default to app page
    await navigateTo(redirectPath, { replace: true })
  } catch (e: any) {
    // Handle authentication errors more gracefully
    if (e.response) {
      if (e.response.status === 401) {
        error.value = 'Invalid email or password'
      } else if (e.response.status === 403 && e.response._data.message === 'Please verify your email address before logging in') {
        error.value = 'Please check your email for a verification link. A new verification email has been sent.'
      } else {
        error.value = e.response._data.message || 'An error occurred while logging in. Please try again.'
      }
    } else {
      error.value = 'An error occurred while logging in. Please try again.'
    }
    console.error('Login error:', e)
  } finally {
    loading.value = false
  }
}
</script> 
<template>
  <div class="min-h-screen bg-[var(--background)]">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-md mx-auto bg-[var(--card-background)] rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-6">Create an Account</h1>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-[var(--text-primary)] mb-1">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--input-background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

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

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-[var(--text-primary)] mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
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
            {{ loading ? 'Creating Account...' : 'Sign Up' }}
          </button>

          <p class="text-center text-sm text-[var(--text-secondary)]">
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
const router = useRouter()

async function handleSubmit() {
  error.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create account')
    }

    // Navigate to the app page after successful signup
    router.push('/app')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script> 
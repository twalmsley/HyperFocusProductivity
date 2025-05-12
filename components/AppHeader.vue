<template>
  <header class="bg-[var(--nav-background)] shadow-sm">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-2xl font-bold text-[var(--primary)]">FocusHub</NuxtLink>
        </div>

        <!-- Navigation -->
        <div class="hidden md:flex space-x-8">
          <NuxtLink to="/features" class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">Features</NuxtLink>
          <NuxtLink to="/pricing" class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">Pricing</NuxtLink>
          <NuxtLink to="/about" class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors">About</NuxtLink>
        </div>

        <!-- Auth Buttons -->
        <div class="flex items-center space-x-4">
          <template v-if="user">
            <span class="text-[var(--text-primary)]">Welcome, {{ user.name }}</span>
            <button 
              @click="handleLogout" 
              class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
            >
              Logout
            </button>
          </template>
          <template v-else>
            <NuxtLink 
              to="/login" 
              class="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors"
            >
              Login
            </NuxtLink>
            <NuxtLink 
              to="/signup" 
              class="bg-[var(--primary)] hover:bg-[var(--button-hover)] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </NuxtLink>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const user = useState('user')
const router = useRouter()

// Fetch user data on component mount
onMounted(async () => {
  try {
    const response = await fetch('/api/auth/me')
    if (response.ok) {
      user.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    router.push('/')
  } catch (error) {
    console.error('Failed to logout:', error)
  }
}
</script> 
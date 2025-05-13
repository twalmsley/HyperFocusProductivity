import { ref } from 'vue'
import type { User } from '~/server/types'

export function useAuth() {
  const user = useState<User | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(true)

  async function fetchUser() {
    try {
      const response = await $fetch<User>('/api/auth/me')
      user.value = response
    } catch (error) {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch user data on initial load
  if (process.client) {
    fetchUser()
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    fetchUser
  }
} 
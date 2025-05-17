import { ref } from 'vue'
import type { User } from '~/server/types'

interface AuthResponse {
  success: boolean
  user: User
}

export function useAuth() {
  const user = useState<User | null>('user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(true)
  const { withCsrf } = useCsrf()

  async function fetchUser() {
    try {
      const response = await $fetch<User>('/api/auth/me', withCsrf())
      user.value = response
    } catch (error) {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  async function login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await $fetch<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        ...withCsrf()
      })
      user.value = response.user
      return response
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        ...withCsrf()
      })
      user.value = null
    } catch (error) {
      throw error
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
    fetchUser,
    login,
    logout
  }
} 
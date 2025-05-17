import { ref } from 'vue'

export function useCsrf() {
  const csrfToken = ref<string | null>(null)

  // Function to get CSRF token from cookie
  const getCsrfToken = () => {
    if (process.client) {
      const cookies = document.cookie.split(';')
      const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrf-token='))
      if (csrfCookie) {
        csrfToken.value = csrfCookie.split('=')[1].trim()
      }
    }
    return csrfToken.value
  }

  // Function to add CSRF token to fetch options
  const withCsrf = (options: RequestInit = {}) => {
    const token = getCsrfToken()
    if (token) {
      return {
        ...options,
        headers: {
          ...options.headers,
          'X-CSRF-Token': token
        }
      }
    }
    return options
  }

  return {
    csrfToken,
    getCsrfToken,
    withCsrf
  }
} 
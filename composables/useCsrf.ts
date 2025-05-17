import { ref } from 'vue'

export function useCsrf() {
  const csrfToken = ref<string | null>(null)

  // Function to fetch CSRF token by making a GET request to an API endpoint
  const fetchCsrfToken = async () => {
    if (process.client) {
      try {
        // Make a GET request to any API endpoint to get the CSRF token from response headers
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        })
        
        // Get the CSRF token from the response headers
        const token = response.headers.get('X-CSRF-Token')
        if (token) {
          csrfToken.value = token
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error)
      }
    }
    return csrfToken.value
  }

  // Function to add CSRF token to fetch options
  const withCsrf = (options: RequestInit = {}) => {
    if (csrfToken.value) {
      return {
        ...options,
        headers: {
          ...options.headers,
          'X-CSRF-Token': csrfToken.value
        }
      }
    }
    return options
  }

  // Initialize token if in client
  if (process.client) {
    fetchCsrfToken()
  }

  return {
    csrfToken,
    fetchCsrfToken,
    withCsrf
  }
} 
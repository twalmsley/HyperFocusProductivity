export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for login and signup pages
  if (to.path === '/login' || to.path === '/signup') {
    return
  }

  // Check if we're in the app section
  if (to.path.startsWith('/app')) {
    try {
      const response = await $fetch('/api/auth/me')
      if (!response) {
        return navigateTo('/login', { replace: true })
      }
    } catch (error) {
      return navigateTo('/login', { replace: true })
    }
  }
}) 
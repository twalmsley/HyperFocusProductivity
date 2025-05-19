export default defineNuxtRouteMiddleware(async (to) => {
  // Skip check for subscription page
  if (to.path === '/app/subscription') return

  // Skip check for main app page if it's the subscription page
  if (to.path === '/app' && to.query.page === 'subscription') return

  const { checkSubscription } = useSubscription()
  
  // If subscription check fails, it will redirect to subscription page
  const isValid = await checkSubscription()
  
  // If subscription is invalid, abort navigation
  if (!isValid) {
    return navigateTo('/app/subscription')
  }
}) 
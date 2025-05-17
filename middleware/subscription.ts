import { prisma } from '~/server/utils/db'
import { Prisma } from '@prisma/client'
import { useCsrf } from '~/composables/useCsrf'

type UserWithSubscription = Prisma.UserGetPayload<{
  select: { subscription: true }
}>

// Routes that require subscription check
const SUBSCRIPTION_ROUTES = [
  '/app/tasks',
  '/app/stats',
  '/app/settings'
]

export default defineNuxtRouteMiddleware(async (to) => {
  // Only check on client-side
  if (process.server) return
  
  // Only check subscription for specific routes
  if (!SUBSCRIPTION_ROUTES.some(route => to.path.startsWith(route))) return
  
  // Get CSRF token
  const { csrfToken, fetchCsrfToken } = useCsrf()
  await fetchCsrfToken()
  
  // Fetch user data
  const { data: session } = await useFetch('/api/auth/me', {
    headers: {
      'X-CSRF-Token': csrfToken.value || ''
    }
  })
  
  if (!session.value) {
    return navigateTo('/login')
  }
  
  const subscription = session.value.subscription
  
  // Handle expired free trial
  if (subscription?.status === 'FREE_TRIAL') {
    const trialExpiresAt = new Date(subscription.freeTrialExpiresAt)
    if (trialExpiresAt < new Date()) {
      return navigateTo('/subscription?expired=true')
    }
  }
  
  // Handle expired or canceled subscription
  if (['EXPIRED', 'CANCELED', 'PAST_DUE'].includes(subscription?.status)) {
    return navigateTo('/subscription?expired=true')
  }
}) 
import { prisma } from '../utils/db'
import { Prisma } from '@prisma/client'

// Routes that require subscription check
const SUBSCRIPTION_ROUTES = [
  '/app/tasks',
  '/app/stats',
  '/app/settings'
]

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  
  // Only check subscription for specific routes
  if (!SUBSCRIPTION_ROUTES.some(route => path.startsWith(route))) return
  
  // Get session from the event
  const session = event.context.session
  
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  const subscription = session.subscription
  
  // Handle expired free trial
  if (subscription?.status === 'FREE_TRIAL') {
    const trialExpiresAt = new Date(subscription.freeTrialExpiresAt)
    if (trialExpiresAt < new Date()) {
      throw createError({
        statusCode: 403,
        message: 'Free trial expired',
        data: { redirect: '/subscription?expired=true' }
      })
    }
  }
  
  // Handle expired or canceled subscription
  if (['EXPIRED', 'CANCELED', 'PAST_DUE'].includes(subscription?.status)) {
    throw createError({
      statusCode: 403,
      message: 'Subscription expired or canceled',
      data: { redirect: '/subscription?expired=true' }
    })
  }
}) 
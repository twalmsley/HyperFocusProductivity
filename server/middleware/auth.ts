import { Prisma } from '@prisma/client'
import { prisma } from '../utils/db'

type SessionWithUser = Prisma.SessionGetPayload<{
  include: { user: { include: { subscription: true } } }
}>

// Public routes that don't need authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/verify',
  '/about',
  '/features',
  '/pricing',
  '/contact',
  '/terms',
  '/privacy',
  '/cookies',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/verify',
  '/api/contact'
]

// Routes that don't require an active subscription
const SUBSCRIPTION_EXEMPT_ROUTES = [
  '/app/subscription',
  '/api/auth/me',
  '/api/subscription/plans',
  '/api/subscription/webhook'
]

export default defineEventHandler(async (event) => {
  // Get the path without query parameters
  const path = event.path.split('?')[0]
  
  // Skip auth check for public routes
  if (PUBLIC_ROUTES.includes(path)) {
    return
  }

  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        include: {
          subscription: true
        }
      }
    }
  }) as SessionWithUser | null

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } })
    }
    deleteCookie(event, 'session')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  // Check subscription status for app routes and dashboard
  if ((path.startsWith('/app/') || path === '/app') && !SUBSCRIPTION_EXEMPT_ROUTES.includes(path)) {
    const subscription = session.user.subscription
    const now = new Date()

    // Check if subscription has expired
    if (!subscription || 
        subscription.status === 'EXPIRED' || 
        subscription.status === 'CANCELED' || 
        subscription.status === 'PAST_DUE' ||
        (subscription.status === 'FREE_TRIAL' && subscription.freeTrialExpiresAt < now) ||
        (subscription.status === 'ACTIVE' && subscription.currentPeriodEnd && subscription.currentPeriodEnd < now)) {
      
      // Update subscription status if needed
      if (subscription) {
        let newStatus = subscription.status
        if (subscription.status === 'FREE_TRIAL' && subscription.freeTrialExpiresAt < now) {
          newStatus = 'EXPIRED'
        } else if (subscription.status === 'ACTIVE' && subscription.currentPeriodEnd && subscription.currentPeriodEnd < now) {
          newStatus = 'EXPIRED'
        }

        if (newStatus !== subscription.status) {
          await prisma.userSubscription.update({
            where: { id: subscription.id },
            data: { status: newStatus }
          })
        }
      }

      // Return 403 with redirect data
      setResponseStatus(event, 403)
      return {
        statusCode: 403,
        message: 'Subscription required',
        data: { redirect: '/app/subscription' }
      }
    }
  }

  // Attach user to event context
  event.context.user = session.user
}) 
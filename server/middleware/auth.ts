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
    // Fetch fresh subscription data
    const freshSubscription = await prisma.userSubscription.findUnique({
      where: { userId: session.user.id }
    })
    
    const now = new Date()

    // Check if subscription has expired
    if (!freshSubscription || 
        freshSubscription.status === 'EXPIRED' || 
        freshSubscription.status === 'CANCELED' || 
        freshSubscription.status === 'PAST_DUE' ||
        (freshSubscription.status === 'FREE_TRIAL' && freshSubscription.freeTrialExpiresAt < now) ||
        (freshSubscription.status === 'ACTIVE' && freshSubscription.currentPeriodEnd && freshSubscription.currentPeriodEnd < now)) {
      
      // Update subscription status if needed
      if (freshSubscription) {
        let newStatus = freshSubscription.status
        if (freshSubscription.status === 'FREE_TRIAL' && freshSubscription.freeTrialExpiresAt < now) {
          newStatus = 'EXPIRED'
        } else if (freshSubscription.status === 'ACTIVE' && freshSubscription.currentPeriodEnd && freshSubscription.currentPeriodEnd < now) {
          newStatus = 'EXPIRED'
        }

        if (newStatus !== freshSubscription.status) {
          await prisma.userSubscription.update({
            where: { id: freshSubscription.id },
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

    // Update the session's user object with fresh subscription data
    session.user.subscription = freshSubscription
  }

  // Attach user to event context
  event.context.user = session.user
}) 
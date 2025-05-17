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
  '/api/auth/verify'
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

  // Attach user to event context
  event.context.user = session.user
}) 
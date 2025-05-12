import { PrismaClient, Prisma } from '@prisma/client'
import type { User, UserSubscription, Session } from '~/server/types'

const prisma = new PrismaClient()

type SessionWithUser = Prisma.SessionGetPayload<{
  include: { user: { include: { subscription: true } } }
}>

export default defineEventHandler(async (event) => {
  try {
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

    // Check and update subscription status if needed
    const now = new Date()
    let subscriptionStatus = session.user.subscription?.status || 'FREE_TRIAL'

    if (session.user.subscription) {
      if (subscriptionStatus === 'FREE_TRIAL' && session.user.subscription.freeTrialExpiresAt < now) {
        // Update subscription status to EXPIRED if free trial has ended
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            subscription: {
              update: {
                status: 'EXPIRED'
              }
            }
          }
        })
        subscriptionStatus = 'EXPIRED'
      } else if (subscriptionStatus === 'ACTIVE' && session.user.subscription.currentPeriodEnd && session.user.subscription.currentPeriodEnd < now) {
        // Update subscription status to EXPIRED if paid subscription has ended
        await prisma.user.update({
          where: { id: session.user.id },
          data: {
            subscription: {
              update: {
                status: 'EXPIRED'
              }
            }
          }
        })
        subscriptionStatus = 'EXPIRED'
      }
    }

    // Return user data without sensitive information
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      subscription: session.user.subscription ? {
        status: subscriptionStatus,
        type: session.user.subscription.type,
        freeTrialExpiresAt: session.user.subscription.freeTrialExpiresAt,
        currentPeriodStart: session.user.subscription.currentPeriodStart,
        currentPeriodEnd: session.user.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: session.user.subscription.cancelAtPeriodEnd
      } : null
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
import { prisma } from '~/server/utils/db'
import { Prisma } from '@prisma/client'

type UserWithSubscription = Prisma.UserGetPayload<{
  select: { subscription: true }
}>

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for auth pages and public pages
  const publicRoutes = ['/login', '/signup', '/subscription', '/about', '/features', '/pricing', '/contact', '/terms', '/privacy', '/cookies']
  if (publicRoutes.includes(to.path)) {
    return
  }

  const { data: session } = await useFetch('/api/auth/me')
  
  if (!session.value) {
    return navigateTo('/login')
  }

  // Fetch user's subscription status
  const user = await prisma.user.findUnique({
    where: { id: session.value.id },
    select: {
      subscription: true
    }
  }) as UserWithSubscription | null

  const subscription = user?.subscription
  const now = new Date()

  // Check if subscription is expired or needs attention
  if (!subscription) {
    return navigateTo('/subscription')
  }

  if (subscription.status === 'FREE_TRIAL' && subscription.freeTrialExpiresAt < now) {
    // Free trial expired
    await prisma.user.update({
      where: { id: session.value.id },
      data: {
        subscription: {
          update: {
            status: 'EXPIRED'
          }
        }
      }
    })
    return navigateTo('/subscription?trial=expired')
  }

  if (subscription.status === 'ACTIVE' && subscription.currentPeriodEnd && subscription.currentPeriodEnd < now) {
    // Paid subscription expired
    await prisma.user.update({
      where: { id: session.value.id },
      data: {
        subscription: {
          update: {
            status: 'EXPIRED'
          }
        }
      }
    })
    return navigateTo('/subscription?subscription=expired')
  }

  if (['EXPIRED', 'CANCELED', 'PAST_DUE'].includes(subscription.status)) {
    return navigateTo('/subscription')
  }
}) 
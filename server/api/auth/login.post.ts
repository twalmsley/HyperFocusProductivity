import { H3Event } from 'h3'
import { prisma } from '~/server/utils/db'
import bcrypt from 'bcryptjs'
import { Prisma } from '@prisma/client'

type UserWithSubscription = Prisma.UserGetPayload<{
  include: { subscription: true }
}>

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body
    
    console.log('Login attempt received:', { email })

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true
      }
    }) as UserWithSubscription | null

    if (!user) {
      console.log('Login failed: User not found')
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      console.log('Login failed: Invalid password')
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Check subscription status
    let subscriptionStatus = user.subscription?.status || 'FREE_TRIAL'
    const now = new Date()

    if (user.subscription) {
      if (subscriptionStatus === 'FREE_TRIAL' && user.subscription.freeTrialExpiresAt < now) {
        // Update subscription status to EXPIRED if free trial has ended
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscription: {
              update: {
                status: 'EXPIRED'
              }
            }
          }
        })
        subscriptionStatus = 'EXPIRED'
      } else if (subscriptionStatus === 'ACTIVE' && user.subscription.currentPeriodEnd && user.subscription.currentPeriodEnd < now) {
        // Update subscription status to EXPIRED if paid subscription has ended
        await prisma.user.update({
          where: { id: user.id },
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

    console.log('Login successful for:', email)
    
    // Create session in database
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        duration: 7 * 24 * 60, // 10080 minutes
        type: 'auth'
      }
    })

    // Set the session cookie with just the session ID
    setCookie(event, 'session', session.id, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: {
          status: subscriptionStatus,
          freeTrialExpiresAt: user.subscription?.freeTrialExpiresAt,
          currentPeriodEnd: user.subscription?.currentPeriodEnd
        }
      }
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
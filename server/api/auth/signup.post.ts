import { Prisma } from '@prisma/client'
import { hash } from 'bcrypt'
import type { SubscriptionStatus } from '~/server/types'
import { prisma } from '~/server/utils/db'
import { generateVerificationToken } from '~/server/utils/emailVerification'
import { sendVerificationEmail } from '~/server/utils/emailService'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, email, password } = body

    // Validate input
    if (!username || !email || !password) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { name: username },
          { email: email }
        ]
      }
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Username or email already exists'
      })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Generate verification token
    const { token, expiresAt } = generateVerificationToken(email)

    // Calculate free trial expiry date (14 days from now)
    const freeTrialExpiresAt = new Date()
    freeTrialExpiresAt.setDate(freeTrialExpiresAt.getDate() + 14)

    // Create user with type-safe data
    const userData: Prisma.UserCreateInput = {
      name: username,
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationToken: token,
      verificationTokenExpires: expiresAt,
      settings: {
        create: {
          focusDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          longBreakInterval: 4
        }
      },
      subscription: {
        create: {
          status: 'FREE_TRIAL',
          freeTrialExpiresAt
        }
      }
    }

    const user = await prisma.user.create({
      data: userData
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, token)
    } catch (error) {
      console.error('Failed to send verification email:', error)
      // Don't throw error here, as the user is already created
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        duration: 7 * 24 * 60, // 10080 minutes
        type: 'auth'
      }
    })

    // Set session cookie
    setCookie(event, 'session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
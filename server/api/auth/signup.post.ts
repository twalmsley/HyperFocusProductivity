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

    // Validate username length (4-50 characters)
    if (username.trim().length < 4 || username.trim().length > 50) {
      throw createError({
        statusCode: 400,
        message: 'Username must be between 4 and 50 characters'
      })
    }

    // Validate password length and security
    if (password.length < 8 || password.length > 50) {
      throw createError({
        statusCode: 400,
        message: 'Password must be between 8 and 50 characters'
      })
    }

    // Password security validation
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      throw createError({
        statusCode: 400,
        message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
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

    return {
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
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
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

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

    // Create user
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        // Store hashed password in a separate field (you'll need to add this to your schema)
        password: hashedPassword,
        // Create default settings
        settings: {
          create: {
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            longBreakInterval: 4
          }
        }
      }
    })

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    })

    // Set session cookie
    setCookie(event, 'session', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
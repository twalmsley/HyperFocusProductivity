import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
      include: { user: true }
    })

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

    // Return user data without sensitive information
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
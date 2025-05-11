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

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
      throw createError({
        statusCode: 401,
        message: 'Session expired'
      })
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
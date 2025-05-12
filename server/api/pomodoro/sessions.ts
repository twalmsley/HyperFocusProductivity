import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
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
      user: true
    }
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

  const body = await readBody(event)
  const { type, startTime, endTime, durationMinutes } = body

  if (!type || !startTime || !endTime || !durationMinutes) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  try {
    const pomodoroSession = await prisma.pomodoroSession.create({
      data: {
        userId: session.user.id,
        type,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        durationMinutes
      }
    })

    return pomodoroSession
  } catch (error) {
    console.error('Failed to save pomodoro session:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to save session'
    })
  }
}) 
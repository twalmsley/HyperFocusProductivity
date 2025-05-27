import { getServerSession } from '#auth'
import { prisma } from '../utils/db'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const method = event.method
  const user = session.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Get client IP for rate limiting
  const ip = getRequestIP(event, { xForwardedFor: true })
  if (!ip) {
    throw createError({
      statusCode: 400,
      message: 'Could not determine client IP'
    })
  }

  switch (method) {
    case 'GET':
      // Get user settings or create default settings if they don't exist
      let settings = await prisma.userSettings.findUnique({
        where: { userId: user.id }
      })

      if (!settings) {
        
        settings = await prisma.userSettings.create({
          data: {
            userId: user.id,
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            longBreakInterval: 4
          }
        })
      }

      return settings

    case 'PATCH':
      const updateData = await readBody(event)
      
      return await prisma.userSettings.update({
        where: { userId: user.id },
        data: updateData
      })

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 
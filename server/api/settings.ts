import { prisma } from '../utils/db'
import { checkRateLimit } from '../utils/rateLimiter'

export default defineEventHandler(async (event) => {
  const method = event.method
  const user = event.context.user

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
        // Check rate limit for database operations
        await checkRateLimit(ip, 'dbUpdate')
        
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
      // Check rate limit for database operations
      await checkRateLimit(ip, 'dbUpdate')

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
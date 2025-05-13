import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const sessionId = getCookie(event, 'session')
    
    if (sessionId) {
      await prisma.session.delete({
        where: { id: sessionId }
      })
    }

    // Clear the session cookie
    deleteCookie(event, 'session')

    return { success: true }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event)
    if (!session) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    console.log(session.user)

    return session.user
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
import { getServerSession } from '#auth'
import { prisma } from '../../utils/db'

// Get current user's subscription
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const user = session.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const subscription = await prisma.userSubscription.findUnique({
    where: {
      userId: user.id
    }
  })

  return subscription
})
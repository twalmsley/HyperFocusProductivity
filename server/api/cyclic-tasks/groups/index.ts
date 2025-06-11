import { getServerSession } from '#auth'
import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const user = session.user as { id: string; email?: string; name?: string; image?: string }

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Get all unique group names for the user
  const groups = await prisma.cyclicTask.findMany({
    where: {
      userId: user.id
    },
    select: {
      groupName: true
    },
    distinct: ['groupName'],
    orderBy: {
      groupName: 'asc'
    }
  })

  return groups.map(group => group.groupName)
}) 
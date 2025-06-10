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

  const method = event.method

  switch (method) {
    case 'GET':
      return await prisma.cyclicTask.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          { lastCompletedDate: 'asc' },
          { createdAt: 'desc' }
        ]
      })

    case 'POST':
      const body = await readBody(event)
      const { groupName, title, description } = body

      if (!groupName || !title) {
        throw createError({
          statusCode: 400,
          message: 'Group name and title are required'
        })
      }

      return await prisma.cyclicTask.create({
        data: {
          userId: user.id,
          groupName,
          title,
          description
        }
      })

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 
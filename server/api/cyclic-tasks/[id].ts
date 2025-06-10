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

  const taskId = event.context.params?.id

  if (!taskId) {
    throw createError({
      statusCode: 400,
      message: 'Task ID is required'
    })
  }

  // Verify task belongs to user
  const task = await prisma.cyclicTask.findFirst({
    where: {
      id: taskId,
      userId: user.id
    }
  })

  if (!task) {
    throw createError({
      statusCode: 404,
      message: 'Task not found'
    })
  }

  const method = event.method

  switch (method) {
    case 'GET':
      return task

    case 'PUT':
      const body = await readBody(event)
      const { groupName, title, description } = body

      if (!groupName || !title) {
        throw createError({
          statusCode: 400,
          message: 'Group name and title are required'
        })
      }

      return await prisma.cyclicTask.update({
        where: {
          id: taskId
        },
        data: {
          groupName,
          title,
          description
        }
      })

    case 'DELETE':
      return await prisma.cyclicTask.delete({
        where: {
          id: taskId
        }
      })

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 
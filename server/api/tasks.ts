import { getServerSession } from '#auth'
import { prisma } from '../utils/db'
import { checkRateLimit } from '../utils/rateLimiter'

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
      return await prisma.task.findMany({
        where: {
          userId: user.id,
        },
        include: {
          user: true
        },
        orderBy: {
          position: 'asc'
        }
      })

    case 'POST':
      // Check rate limit for database operations
      await checkRateLimit(ip, 'dbUpdate')

      const body = await readBody(event)
      const { title, notes, estimatedPomodoros, status = 'BACKLOG', dueDate, priority = 'MEDIUM' } = body

      if (!title || !notes || !estimatedPomodoros || !status || !dueDate) {
        throw createError({
          statusCode: 400,
          message: 'All fields (title, notes, estimatedPomodoros, status, dueDate) are required'
        })
      }

      // Get the highest position value
      const lastTask = await prisma.task.findFirst({
        where: { userId: user.id },
        orderBy: { position: 'desc' }
      })

      const newPosition = (lastTask?.position ?? -1) + 1

      return await prisma.task.create({
        data: {
          userId: user.id,
          title: title.slice(0, 200),
          notes: notes.slice(0, 2000),
          estimatedPomodoros,
          status,
          priority,
          dueDate,
          position: newPosition
        },
        include: {
          user: true
        }
      })

    case 'PATCH':
      // Check rate limit for database operations
      await checkRateLimit(ip, 'dbUpdate')

      const { id, ...updateData } = await readBody(event)

      if (!id) {
        throw createError({
          statusCode: 400,
          message: 'Task id is required'
        })
      }

      // Verify task belongs to user
      const task = await prisma.task.findUnique({
        where: { id }
      })

      if (!task || task.userId !== user.id) {
        throw createError({
          statusCode: 403,
          message: 'Not authorized to update this task'
        })
      }

      // Truncate title and notes if they are being updated
      if (updateData.title) {
        updateData.title = updateData.title.slice(0, 200)
      }
      if (updateData.notes) {
        updateData.notes = updateData.notes.slice(0, 2000)
      }

      return await prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          user: true
        }
      })

    case 'DELETE':
      // Check rate limit for database operations
      await checkRateLimit(ip, 'dbUpdate')

      const taskId = getQuery(event).id as string

      if (!taskId) {
        throw createError({
          statusCode: 400,
          message: 'Task id is required'
        })
      }

      // Verify task belongs to user
      const taskToDelete = await prisma.task.findUnique({
        where: { id: taskId }
      })

      if (!taskToDelete || taskToDelete.userId !== user.id) {
        throw createError({
          statusCode: 403,
          message: 'Not authorized to delete this task'
        })
      }

      return await prisma.task.delete({
        where: { id: taskId },
        include: {
          user: true
        }
      })

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 
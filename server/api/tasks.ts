import { prisma } from '../utils/db'

export default defineEventHandler(async (event) => {
  const method = event.method
  const user = event.context.user

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
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
      const body = await readBody(event)
      const { title, notes, estimatedPomodoros, status = 'BACKLOG', dueDate } = body

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
          title,
          notes,
          estimatedPomodoros,
          status,
          dueDate,
          position: newPosition
        },
        include: {
          user: true
        }
      })
    
    case 'PATCH':
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

      return await prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          user: true
        }
      })

    case 'DELETE':
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
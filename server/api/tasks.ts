import { prisma } from '../utils/db'

export default defineEventHandler(async (event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      const query = getQuery(event)
      const userId = query.userId as string
      
      if (!userId) {
        throw createError({
          statusCode: 400,
          message: 'userId is required'
        })
      }

      return await prisma.task.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
          sessions: true
        },
        orderBy: {
          position: 'asc'
        }
      })
    
    case 'POST':
      const body = await readBody(event)
      const { userId: newTaskUserId, title, notes, estimatedPomodoros, status = 'BACKLOG' } = body

      if (!newTaskUserId || !title) {
        throw createError({
          statusCode: 400,
          message: 'userId and title are required'
        })
      }

      // Get the highest position value
      const lastTask = await prisma.task.findFirst({
        where: { userId: newTaskUserId },
        orderBy: { position: 'desc' }
      })

      const newPosition = (lastTask?.position ?? -1) + 1

      return await prisma.task.create({
        data: {
          userId: newTaskUserId,
          title,
          notes,
          estimatedPomodoros,
          status,
          position: newPosition
        },
        include: {
          user: true,
          sessions: true
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

      return await prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          user: true,
          sessions: true
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

      return await prisma.task.delete({
        where: { id: taskId },
        include: {
          user: true,
          sessions: true
        }
      })
    
    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 
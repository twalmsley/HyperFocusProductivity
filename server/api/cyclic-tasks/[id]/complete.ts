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
  const cyclicTask = await prisma.cyclicTask.findFirst({
    where: {
      id: taskId,
      userId: user.id
    }
  })

  if (!cyclicTask) {
    throw createError({
      statusCode: 404,
      message: 'Task not found'
    })
  }

  const today = new Date()

  // Update cyclic task with current date as last completed
  await prisma.cyclicTask.update({
    where: {
      id: taskId
    },
    data: {
      lastCompletedDate: today
    }
  })

  // Create a completed task in the Task table
  await prisma.task.create({
    data: {
      userId: user.id,
      title: cyclicTask.title,
      notes: cyclicTask.description,
      status: 'DONE',
      completedAt: today,
      dueDate: today
    }
  })

  return { success: true }
}) 
import { getServerSession } from '#auth'
import { prisma } from '../utils/db'
import { calculateNextRepeatDate } from '../utils/repeatSchedule'
import type { RepeatSchedule } from '../utils/repeatSchedule'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const method = event.method
  const user = session.user as { id: string; email?: string; name?: string; image?: string }

  if (!user || !user.id) {
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
      const { 
        title, 
        notes, 
        estimatedPomodoros, 
        status = 'BACKLOG', 
        dueDate, 
        priority = 'MEDIUM',
        repeatType,
        repeatInterval,
        repeatDays,
        repeatMonth,
        repeatDay,
        repeatWeekOfMonth,
        repeatDayOfWeek
      } = body

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

      // Validate repeat schedule if provided
      if (repeatType) {
          repeatType,
          repeatInterval,
          repeatDays,
          repeatMonth,
          repeatDay,
          repeatWeekOfMonth,
          repeatDayOfWeek
        })

        if (repeatType === 'WEEKLY' && (!repeatDays || !Array.isArray(repeatDays))) {
          throw createError({
            statusCode: 400,
            message: 'Weekly repeat schedule requires repeatDays array'
          })
        }
        if (repeatType === 'MONTHLY' && !repeatDay) {
          throw createError({
            statusCode: 400,
            message: 'Monthly repeat schedule requires repeatDay'
          })
        }
        if (repeatType === 'ANNUALLY' && (!repeatMonth || !repeatDay)) {
          throw createError({
            statusCode: 400,
            message: 'Annual repeat schedule requires repeatMonth and repeatDay'
          })
        }
        if (repeatType === 'MONTHLY_BY_WEEKDAY' && (!repeatWeekOfMonth || repeatDayOfWeek === undefined)) {
          throw createError({
            statusCode: 400,
            message: 'Monthly by weekday repeat schedule requires repeatWeekOfMonth and repeatDayOfWeek'
          })
        }
      }

      // Create the task
      const taskData = {
        userId: user.id,
        title: title.slice(0, 200),
        notes: notes.slice(0, 2000),
        estimatedPomodoros,
        status: status as 'BACKLOG' | 'IN_PROGRESS' | 'DONE',
        priority: priority as 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW',
        dueDate,
        position: newPosition,
        repeatType,
        repeatInterval,
        repeatDays: repeatDays ? JSON.stringify(repeatDays) : null,
        repeatMonth,
        repeatDay,
        repeatWeekOfMonth,
        repeatDayOfWeek,
        isTemplate: !!repeatType
      }

      const newTask = await prisma.task.create({
        data: taskData,
        include: {
          user: true
        }
      })

      return newTask

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

      // Truncate title and notes if they are being updated
      if (updateData.title) {
        updateData.title = updateData.title.slice(0, 200)
      }
      if (updateData.notes) {
        updateData.notes = updateData.notes.slice(0, 2000)
      }

      // Handle repeat schedule updates
      if (updateData.repeatType) {
        // Validate repeat schedule
        if (updateData.repeatType === 'WEEKLY' && (!updateData.repeatDays || !Array.isArray(updateData.repeatDays))) {
          throw createError({
            statusCode: 400,
            message: 'Weekly repeat schedule requires repeatDays array'
          })
        }
        if (updateData.repeatType === 'MONTHLY' && !updateData.repeatDay) {
          throw createError({
            statusCode: 400,
            message: 'Monthly repeat schedule requires repeatDay'
          })
        }
        if (updateData.repeatType === 'ANNUALLY' && (!updateData.repeatMonth || !updateData.repeatDay)) {
          throw createError({
            statusCode: 400,
            message: 'Annual repeat schedule requires repeatMonth and repeatDay'
          })
        }
        if (updateData.repeatType === 'MONTHLY_BY_WEEKDAY' && (!updateData.repeatWeekOfMonth || updateData.repeatDayOfWeek === undefined)) {
          throw createError({
            statusCode: 400,
            message: 'Monthly by weekday repeat schedule requires repeatWeekOfMonth and repeatDayOfWeek'
          })
        }

        // Stringify repeatDays if it's an array
        if (updateData.repeatDays && Array.isArray(updateData.repeatDays)) {
          updateData.repeatDays = JSON.stringify(updateData.repeatDays)
        }
      }

      // Check if task is being marked as completed and has a repeat schedule
      if (updateData.status === 'DONE' && task.repeatType && !task.completedAt) {
        const repeatSchedule: RepeatSchedule = {
          repeatType: task.repeatType as any,
          repeatInterval: task.repeatInterval || undefined,
          repeatDays: task.repeatDays ? JSON.parse(task.repeatDays) : undefined,
          repeatMonth: task.repeatMonth || undefined,
          repeatDay: task.repeatDay || undefined,
          repeatWeekOfMonth: task.repeatWeekOfMonth || undefined,
          repeatDayOfWeek: task.repeatDayOfWeek || undefined
        }

        const currentDueDate = task.dueDate ? new Date(task.dueDate) : new Date()
        const nextDueDate = calculateNextRepeatDate(currentDueDate, repeatSchedule)

        if (nextDueDate) {
          // Get the highest position value for new task
          const lastTask = await prisma.task.findFirst({
            where: { userId: user.id },
            orderBy: { position: 'desc' }
          })

          const newTaskPosition = (lastTask?.position ?? -1) + 1

          // Create a new task for the next occurrence
          await prisma.task.create({
            data: {
              userId: user.id,
              title: task.title,
              notes: task.notes,
              estimatedPomodoros: task.estimatedPomodoros,
              status: 'BACKLOG',
              priority: task.priority,
              dueDate: nextDueDate,
              position: newTaskPosition,
              repeatType: task.repeatType,
              repeatInterval: task.repeatInterval,
              repeatDays: task.repeatDays,
              repeatMonth: task.repeatMonth,
              repeatDay: task.repeatDay,
              repeatWeekOfMonth: task.repeatWeekOfMonth,
              repeatDayOfWeek: task.repeatDayOfWeek,
              isTemplate: task.isTemplate,
              templateTaskId: task.isTemplate ? task.id : task.templateTaskId
            }
          })
        }
      }

      return await prisma.task.update({
        where: { id },
        data: {
          ...updateData,
          completedAt: updateData.status === 'DONE' ? new Date() : updateData.status === 'BACKLOG' ? null : task.completedAt
        },
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
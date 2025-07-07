import { getServerSession } from '#auth'
import { prisma } from '../utils/db'
import type { UserData } from '~/utils/csvExport'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const user = session.user as any
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  try {
    // Fetch all user data in parallel
    const [
      userData,
      settings,
      projects,
      tasks,
      sessions,
      journalEntries,
      cyclicTasks,
      trackers
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          proStatus: true
        }
      }),
      prisma.userSettings.findUnique({
        where: { userId: user.id }
      }),
      prisma.project.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.findMany({
        where: { userId: user.id },
        include: {
          project: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.session.findMany({
        where: { userId: user.id },
        orderBy: { startTime: 'desc' }
      }),
      prisma.journalEntry.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' }
      }),
      prisma.cyclicTask.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tracker.findMany({
        where: { userId: user.id },
        include: {
          entries: {
            orderBy: { date: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ])

    if (!userData) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    // Transform tasks to include project names
    const transformedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      notes: task.notes,
      estimatedPomodoros: task.estimatedPomodoros,
      completedPomodoros: task.completedPomodoros,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
      completedAt: task.completedAt,
      dueDate: task.dueDate,
      projectName: task.project?.name || null
    }))

    const exportData: UserData = {
      user: userData,
      settings,
      projects,
      tasks: transformedTasks,
      sessions,
      journalEntries,
      cyclicTasks,
      trackers
    }

    return exportData

  } catch (error) {
    console.error('Error exporting user data:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to export data. Please try again.'
    })
  }
}) 
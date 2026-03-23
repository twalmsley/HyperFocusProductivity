import { getServerSession } from '#auth'
import { endOfDay, isAfter, isBefore, startOfDay, differenceInCalendarDays } from 'date-fns'
import { prisma } from '~/server/utils/db'
import { buildActivitySummaryReportMarkdown, buildDetailedProjectReportMarkdown } from '~/server/utils/reportGenerator'
import { createReport, listReports } from '~/server/utils/reportRepository'

const ACTIVITY_SUMMARY_REPORT = 'ACTIVITY_SUMMARY'
const DETAILED_PROJECT_REPORT = 'DETAILED_PROJECT'
const MAX_REPORT_DAYS = 31

function getSessionUserId(session: unknown): string {
  const user = (session as { user?: { id?: string } } | null)?.user
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }
  return user.id
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  const userId = getSessionUserId(session)

  if (event.method === 'GET') {
    return listReports(prisma, userId)
  }

  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed',
    })
  }

  const body = await readBody(event)
  const reportType = body?.reportType as string | undefined
  const startDateInput = body?.startDate as string | undefined
  const endDateInput = body?.endDate as string | undefined
  const projectId = body?.projectId as string | undefined

  if (!reportType || ![ACTIVITY_SUMMARY_REPORT, DETAILED_PROJECT_REPORT].includes(reportType)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid report type',
    })
  }

  const now = new Date()
  if (reportType === ACTIVITY_SUMMARY_REPORT) {
    if (!startDateInput || !endDateInput) {
      throw createError({
        statusCode: 400,
        message: 'Start date and end date are required',
      })
    }

    const startDate = startOfDay(new Date(startDateInput))
    const endDate = endOfDay(new Date(endDateInput))
    const maxEndDate = endOfDay(now)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      throw createError({
        statusCode: 400,
        message: 'Invalid date values',
      })
    }

    if (isBefore(endDate, startDate)) {
      throw createError({
        statusCode: 400,
        message: 'End date must be greater than or equal to start date',
      })
    }

    if (isAfter(endDate, maxEndDate)) {
      throw createError({
        statusCode: 400,
        message: 'End date cannot be in the future',
      })
    }

    const daySpan = differenceInCalendarDays(endDate, startDate) + 1
    if (daySpan > MAX_REPORT_DAYS) {
      throw createError({
        statusCode: 400,
        message: `Report period cannot exceed ${MAX_REPORT_DAYS} days`,
      })
    }

    const [projectTasksRaw, nonProjectTasksRaw, cyclicTasksRaw, journalEntriesRaw, trackersRaw] = await Promise.all([
      prisma.task.findMany({
        where: {
          userId,
          status: 'DONE',
          projectId: { not: null },
          completedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          project: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          completedAt: 'asc',
        },
      }),
      prisma.task.findMany({
        where: {
          userId,
          status: 'DONE',
          projectId: null,
          completedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          completedAt: 'asc',
        },
      }),
      prisma.cyclicTask.findMany({
        where: {
          userId,
          lastCompletedDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          lastCompletedDate: 'asc',
        },
      }),
      prisma.journalEntry.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
      }),
      prisma.tracker.findMany({
        where: {
          userId,
        },
        include: {
          entries: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
              value: {
                gt: 0,
              },
            },
            orderBy: {
              date: 'asc',
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
    ])

    const markdownContent = buildActivitySummaryReportMarkdown({
      startDate,
      endDate,
      generatedAt: now,
      projectTasks: projectTasksRaw.map((task) => ({
        projectName: task.project?.name || 'Uncategorised Project',
        title: task.title,
        completedAt: task.completedAt as Date,
      })),
      nonProjectTasks: nonProjectTasksRaw.map((task) => ({
        title: task.title,
        completedAt: task.completedAt as Date,
      })),
      cyclicTasks: cyclicTasksRaw
        .filter((task) => Boolean(task.lastCompletedDate))
        .map((task) => ({
          title: task.title,
          completedAt: task.lastCompletedDate as Date,
        })),
      journalEntries: journalEntriesRaw.map((entry) => ({
        title: entry.title,
        entryDate: entry.date,
      })),
      trackers: trackersRaw
        .filter((tracker) => tracker.entries.length > 0)
        .map((tracker) => ({
          trackerName: tracker.name,
          completionDates: tracker.entries.map((entry) => entry.date),
        })),
    })

    return createReport(prisma, {
      userId,
      reportType,
      title: 'Activity Summary Report',
      startDate,
      endDate,
      markdownContent,
    })
  }

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project is required for detailed project report',
    })
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  })

  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  const projectTasks = await prisma.task.findMany({
    where: {
      userId,
      projectId: project.id,
    },
    select: {
      title: true,
      notes: true,
      status: true,
      dueDate: true,
      completedAt: true,
      createdAt: true,
    },
  })

  const plannedTasks = projectTasks.filter((task) => task.status === 'BACKLOG')
  const inProgressTasks = projectTasks.filter((task) => task.status === 'IN_PROGRESS')
  const completedTasks = projectTasks.filter((task) => task.status === 'DONE')

  const markdownContent = buildDetailedProjectReportMarkdown({
    projectName: project.name,
    generatedAt: now,
    plannedTasks: plannedTasks.map((task) => ({
      title: task.title,
      description: task.notes || '',
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      status: 'BACKLOG',
    })),
    inProgressTasks: inProgressTasks.map((task) => ({
      title: task.title,
      description: task.notes || '',
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      status: 'IN_PROGRESS',
    })),
    completedTasks: completedTasks.map((task) => ({
      title: task.title,
      description: task.notes || '',
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      status: 'DONE',
    })),
  })

  const projectDates = projectTasks.flatMap((task) => {
    const dates: Date[] = [task.createdAt]
    if (task.dueDate) dates.push(task.dueDate)
    if (task.completedAt) dates.push(task.completedAt)
    return dates
  })

  const minDate = projectDates.length > 0
    ? new Date(Math.min(...projectDates.map((date) => date.getTime())))
    : now
  const maxDate = projectDates.length > 0
    ? new Date(Math.max(...projectDates.map((date) => date.getTime())))
    : now

  return createReport(prisma, {
    userId,
    reportType,
    title: `Detailed Project Report - ${project.name}`,
    startDate: startOfDay(minDate),
    endDate: endOfDay(maxDate),
    markdownContent,
  })
})

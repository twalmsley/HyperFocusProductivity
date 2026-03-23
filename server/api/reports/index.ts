import { getServerSession } from '#auth'
import { endOfDay, isAfter, isBefore, startOfDay, differenceInCalendarDays } from 'date-fns'
import { prisma } from '~/server/utils/db'
import { buildActivitySummaryReportMarkdown } from '~/server/utils/reportGenerator'
import { createReport, listReports } from '~/server/utils/reportRepository'

const ACTIVITY_SUMMARY_REPORT = 'ACTIVITY_SUMMARY'
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

  if (!reportType || reportType !== ACTIVITY_SUMMARY_REPORT) {
    throw createError({
      statusCode: 400,
      message: 'Invalid report type',
    })
  }

  if (!startDateInput || !endDateInput) {
    throw createError({
      statusCode: 400,
      message: 'Start date and end date are required',
    })
  }

  const startDate = startOfDay(new Date(startDateInput))
  const endDate = endOfDay(new Date(endDateInput))
  const now = new Date()
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

  const report = await createReport(prisma, {
    userId,
    reportType,
    title: 'Activity Summary Report',
    startDate,
    endDate,
    markdownContent,
  })

  return report
})

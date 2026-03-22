import { getServerSession } from '#auth'
import { prisma } from '~/server/utils/db'
import { startOfDay, endOfDay, differenceInDays, format } from 'date-fns'
import { generateActivityReport } from '~/server/utils/reportGenerator'
import type { ReportTask, ReportCyclicTask, ReportJournalEntry, ReportTrackerData } from '~/server/utils/reportGenerator'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const user = session.user as { id: string }
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const body = await readBody(event)
  const { reportType, startDate: startDateStr, endDate: endDateStr } = body

  if (!reportType || !startDateStr || !endDateStr) {
    throw createError({
      statusCode: 400,
      message: 'reportType, startDate, and endDate are required'
    })
  }

  if (reportType !== 'activity') {
    throw createError({ statusCode: 400, message: 'Invalid report type' })
  }

  const startDate = startOfDay(new Date(startDateStr))
  const endDate = endOfDay(new Date(endDateStr))

  if (endDate < startDate) {
    throw createError({
      statusCode: 400,
      message: 'End date must be on or after start date'
    })
  }

  const today = endOfDay(new Date())
  if (endDate > today) {
    throw createError({
      statusCode: 400,
      message: 'End date cannot be in the future'
    })
  }

  const daysDiff = differenceInDays(endDate, startDate)
  if (daysDiff > 31) {
    throw createError({
      statusCode: 400,
      message: 'Report period cannot exceed 31 days'
    })
  }

  // Fetch completed tasks in the period
  const tasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      status: 'DONE',
      completedAt: { gte: startDate, lte: endDate }
    },
    include: {
      project: { select: { name: true } }
    },
    orderBy: { completedAt: 'asc' }
  })

  const projectTasks: ReportTask[] = tasks
    .filter((t) => t.projectId)
    .map((t) => ({
      title: t.title,
      completedAt: t.completedAt!,
      projectName: t.project?.name
    }))

  const nonProjectTasks: ReportTask[] = tasks
    .filter((t) => !t.projectId)
    .map((t) => ({
      title: t.title,
      completedAt: t.completedAt!
    }))

  // Fetch cyclic task completions — these are tasks created by cyclic task completion
  // They have status DONE and were created from cyclic tasks (they won't have a projectId
  // and are created by the complete endpoint). We use the CyclicTask's lastCompletedDate
  // if it falls in range. But actually cyclic task completions create regular Task entries.
  // So cyclic task completions are already captured in nonProjectTasks above.
  // However, the requirement says to list them separately. We can identify cyclic completions
  // by looking at tasks that match cyclic task titles and have no project.
  // A better approach: query cyclic tasks that have lastCompletedDate in range.
  const cyclicTasks = await prisma.cyclicTask.findMany({
    where: {
      userId: user.id,
      lastCompletedDate: { gte: startDate, lte: endDate }
    },
    orderBy: { lastCompletedDate: 'asc' }
  })

  const cyclicTaskData: ReportCyclicTask[] = cyclicTasks.map((ct) => ({
    title: ct.title,
    completedAt: ct.lastCompletedDate!
  }))

  // Fetch journal entries in the period
  const journalEntries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate, lte: endDate }
    },
    orderBy: { date: 'asc' }
  })

  const journalData: ReportJournalEntry[] = journalEntries.map((je) => ({
    title: je.title,
    date: je.date
  }))

  // Fetch tracker entries in the period (value > 0 means completed)
  const trackers = await prisma.tracker.findMany({
    where: { userId: user.id },
    include: {
      entries: {
        where: {
          date: { gte: startDate, lte: endDate },
          value: { gt: 0 }
        },
        orderBy: { date: 'asc' }
      }
    }
  })

  const totalDays = daysDiff + 1
  const trackerData: ReportTrackerData[] = trackers
    .filter((t) => t.entries.length > 0)
    .map((t) => ({
      name: t.name,
      completionDates: t.entries.map((e) => e.date),
      totalDaysInPeriod: totalDays
    }))

  const markdown = generateActivityReport({
    startDate,
    endDate,
    projectTasks,
    nonProjectTasks,
    cyclicTasks: cyclicTaskData,
    journalEntries: journalData,
    trackers: trackerData
  })

  const title = `Activity Report: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`

  const report = await prisma.report.create({
    data: {
      userId: user.id,
      reportType,
      title,
      markdown,
      startDate,
      endDate
    }
  })

  return report
})

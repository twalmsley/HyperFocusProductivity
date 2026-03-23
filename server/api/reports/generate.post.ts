import { getServerSession } from '#auth'
import { prisma } from '~/server/utils/db'
import { startOfDay, endOfDay, differenceInDays, format } from 'date-fns'
import { generateActivityReport, generateDetailedProjectReport, generateDetailedAllTasksReport } from '~/server/utils/reportGenerator'
import type { ReportTask, ReportCyclicTask, ReportJournalEntry, ReportTrackerData, DetailedProjectTask, AllTasksDetailedTask } from '~/server/utils/reportGenerator'

interface ReportRequestBody {
  reportType: string
  startDate?: string
  endDate?: string
  projectId?: string
}

async function handleActivityReport(userId: string, body: ReportRequestBody) {
  const { startDate, endDate } = validateDateRange(body)
  const daysDiff = differenceInDays(endDate, startDate)

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: 'DONE',
      completedAt: { gte: startDate, lte: endDate }
    },
    include: { project: { select: { name: true } } },
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
    .map((t) => ({ title: t.title, completedAt: t.completedAt! }))

  const cyclicTasks = await prisma.cyclicTask.findMany({
    where: {
      userId,
      lastCompletedDate: { gte: startDate, lte: endDate }
    },
    orderBy: { lastCompletedDate: 'asc' }
  })

  const cyclicTaskData: ReportCyclicTask[] = cyclicTasks.map((ct) => ({
    title: ct.title,
    completedAt: ct.lastCompletedDate!
  }))

  const journalEntries = await prisma.journalEntry.findMany({
    where: { userId, date: { gte: startDate, lte: endDate } },
    orderBy: { date: 'asc' }
  })

  const journalData: ReportJournalEntry[] = journalEntries.map((je) => ({
    title: je.title,
    date: je.date
  }))

  const trackers = await prisma.tracker.findMany({
    where: { userId },
    include: {
      entries: {
        where: { date: { gte: startDate, lte: endDate }, value: { gt: 0 } },
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

  return prisma.report.create({
    data: {
      userId,
      reportType: 'activity',
      title,
      markdown,
      startDate,
      endDate
    }
  })
}

async function handleDetailedProjectReport(userId: string, body: ReportRequestBody) {
  const { projectId } = body

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'projectId is required for detailed project reports'
    })
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId }
  })

  if (!project) {
    throw createError({ statusCode: 404, message: 'Project not found' })
  }

  const tasks = await prisma.task.findMany({
    where: { projectId, userId },
    orderBy: { createdAt: 'asc' }
  })

  const taskData: DetailedProjectTask[] = tasks.map((t) => ({
    title: t.title,
    description: t.notes,
    status: t.status as 'BACKLOG' | 'IN_PROGRESS' | 'DONE',
    dueDate: t.dueDate,
    completedAt: t.completedAt
  }))

  const markdown = generateDetailedProjectReport({
    projectName: project.name,
    tasks: taskData
  })

  const now = new Date()
  const title = `Project Report: ${project.name} (${format(now, 'MMM d, yyyy')})`

  return prisma.report.create({
    data: {
      userId,
      reportType: 'detailed-project',
      title,
      markdown,
      startDate: now,
      endDate: now
    }
  })
}

function validateDateRange(body: ReportRequestBody) {
  const { startDate: startDateStr, endDate: endDateStr } = body

  if (!startDateStr || !endDateStr) {
    throw createError({
      statusCode: 400,
      message: 'startDate and endDate are required'
    })
  }

  const startDate = startOfDay(new Date(startDateStr))
  const endDate = endOfDay(new Date(endDateStr))

  if (endDate < startDate) {
    throw createError({ statusCode: 400, message: 'End date must be on or after start date' })
  }

  const today = endOfDay(new Date())
  if (endDate > today) {
    throw createError({ statusCode: 400, message: 'End date cannot be in the future' })
  }

  if (differenceInDays(endDate, startDate) > 31) {
    throw createError({ statusCode: 400, message: 'Report period cannot exceed 31 days' })
  }

  return { startDate, endDate }
}

async function handleDetailedAllTasksReport(userId: string, body: ReportRequestBody) {
  const { startDate, endDate } = validateDateRange(body)

  // Fetch tasks relevant to this period:
  // - Completed tasks with completedAt in range
  // - In-progress/planned tasks with dueDate in range or createdAt in range
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      OR: [
        { status: 'DONE', completedAt: { gte: startDate, lte: endDate } },
        { status: { in: ['BACKLOG', 'IN_PROGRESS'] }, dueDate: { gte: startDate, lte: endDate } },
        { status: { in: ['BACKLOG', 'IN_PROGRESS'] }, createdAt: { gte: startDate, lte: endDate } }
      ]
    },
    include: { project: { select: { name: true } } },
    orderBy: { createdAt: 'asc' }
  })

  const taskData: AllTasksDetailedTask[] = tasks.map((t) => ({
    title: t.title,
    description: t.notes,
    status: t.status as 'BACKLOG' | 'IN_PROGRESS' | 'DONE',
    dueDate: t.dueDate,
    completedAt: t.completedAt,
    projectName: t.project?.name || null
  }))

  const markdown = generateDetailedAllTasksReport({
    startDate,
    endDate,
    tasks: taskData
  })

  const title = `All Tasks Report: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`

  return prisma.report.create({
    data: {
      userId,
      reportType: 'detailed-all-tasks',
      title,
      markdown,
      startDate,
      endDate
    }
  })
}

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
  const { reportType } = body

  if (!reportType) {
    throw createError({ statusCode: 400, message: 'reportType is required' })
  }

  switch (reportType) {
    case 'activity':
      return handleActivityReport(user.id, body)
    case 'detailed-project':
      return handleDetailedProjectReport(user.id, body)
    case 'detailed-all-tasks':
      return handleDetailedAllTasksReport(user.id, body)
    default:
      throw createError({ statusCode: 400, message: 'Invalid report type' })
  }
})

import { format } from 'date-fns'

export interface ProjectTaskSummaryItem {
  projectName: string
  title: string
  completedAt: Date
}

export interface NonProjectTaskSummaryItem {
  title: string
  completedAt: Date
}

export interface CyclicTaskSummaryItem {
  title: string
  completedAt: Date
}

export interface JournalSummaryItem {
  title: string
  entryDate: Date
}

export interface TrackerSummaryItem {
  trackerName: string
  completionDates: Date[]
}

export interface ActivitySummaryReportInput {
  startDate: Date
  endDate: Date
  generatedAt: Date
  projectTasks: ProjectTaskSummaryItem[]
  nonProjectTasks: NonProjectTaskSummaryItem[]
  cyclicTasks: CyclicTaskSummaryItem[]
  journalEntries: JournalSummaryItem[]
  trackers: TrackerSummaryItem[]
}

export interface DetailedProjectTaskItem {
  title: string
  description: string
  dueDate: Date | null
  completedAt: Date | null
  status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE'
  projectName?: string
}

export interface DetailedProjectReportInput {
  projectName: string
  generatedAt: Date
  plannedTasks: DetailedProjectTaskItem[]
  inProgressTasks: DetailedProjectTaskItem[]
  completedTasks: DetailedProjectTaskItem[]
}

export interface DetailedAllProjectsReportInput {
  startDate: Date
  endDate: Date
  generatedAt: Date
  plannedTasks: DetailedProjectTaskItem[]
  inProgressTasks: DetailedProjectTaskItem[]
  completedTasks: DetailedProjectTaskItem[]
}

function formatDate(value: Date): string {
  return format(value, 'dd MMM yyyy')
}

export function buildActivitySummaryReportMarkdown(input: ActivitySummaryReportInput): string {
  const lines: string[] = []
  const daysInPeriod = Math.floor(
    (input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 * 24),
  ) + 1

  lines.push('# Activity Summary Report')
  lines.push('')
  lines.push(`- Period: ${formatDate(input.startDate)} to ${formatDate(input.endDate)}`)
  lines.push(`- Generated: ${format(input.generatedAt, 'dd MMM yyyy HH:mm')}`)
  lines.push('')

  lines.push('## Project Tasks Summary')
  lines.push('')
  const groupedByProject = input.projectTasks.reduce<Record<string, ProjectTaskSummaryItem[]>>((acc, task) => {
    if (!acc[task.projectName]) {
      acc[task.projectName] = []
    }
    acc[task.projectName].push(task)
    return acc
  }, {})

  const sortedProjectNames = Object.keys(groupedByProject).sort((a, b) => a.localeCompare(b))
  if (sortedProjectNames.length === 0) {
    lines.push('- No completed project tasks found in the selected period.')
  } else {
    for (const projectName of sortedProjectNames) {
      lines.push(`### ${projectName}`)
      lines.push('')
      const tasks = groupedByProject[projectName]
        .slice()
        .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime())

      for (const task of tasks) {
        lines.push(`- ${task.title} (${formatDate(task.completedAt)})`)
      }
      lines.push('')
    }
  }

  lines.push('## Non-project Tasks Summary')
  lines.push('')
  const sortedNonProjectTasks = input.nonProjectTasks
    .slice()
    .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime())

  if (sortedNonProjectTasks.length === 0) {
    lines.push('- No completed non-project tasks found in the selected period.')
  } else {
    for (const task of sortedNonProjectTasks) {
      lines.push(`- ${task.title} (${formatDate(task.completedAt)})`)
    }
  }
  lines.push('')

  lines.push('## Cyclic Tasks Summary')
  lines.push('')
  const sortedCyclicTasks = input.cyclicTasks
    .slice()
    .sort((a, b) => a.completedAt.getTime() - b.completedAt.getTime())

  if (sortedCyclicTasks.length === 0) {
    lines.push('- No cyclic task completions found in the selected period.')
  } else {
    for (const task of sortedCyclicTasks) {
      lines.push(`- ${task.title} (${formatDate(task.completedAt)})`)
    }
  }
  lines.push('')

  lines.push('## Journal Summary')
  lines.push('')
  const sortedJournalEntries = input.journalEntries
    .slice()
    .sort((a, b) => a.entryDate.getTime() - b.entryDate.getTime())

  if (sortedJournalEntries.length === 0) {
    lines.push('- No journal entries found in the selected period.')
  } else {
    for (const entry of sortedJournalEntries) {
      lines.push(`- ${entry.title} (${formatDate(entry.entryDate)})`)
    }
  }
  lines.push('')

  lines.push('## Trackers Summary')
  lines.push('')
  const sortedTrackers = input.trackers
    .slice()
    .sort((a, b) => a.trackerName.localeCompare(b.trackerName))

  if (sortedTrackers.length === 0) {
    lines.push('- No completed trackers found in the selected period.')
  } else {
    for (const tracker of sortedTrackers) {
      const uniqueDates = Array.from(
        new Set(tracker.completionDates.map((date) => format(date, 'yyyy-MM-dd'))),
      )
      const formattedDates = uniqueDates
        .map((dateString) => formatDate(new Date(dateString)))
        .join(', ')
      lines.push(`### ${tracker.trackerName}`)
      lines.push('')
      lines.push(`- Completed on: ${formattedDates || 'No completed days'}`)
      lines.push(`- Summary: ${uniqueDates.length} completed out of ${daysInPeriod} days`)
      lines.push('')
    }
  }

  return lines.join('\n').trimEnd()
}

function sortByDueDateAscending(items: DetailedProjectTaskItem[]): DetailedProjectTaskItem[] {
  return items.slice().sort((a, b) => {
    const aTime = a.dueDate ? a.dueDate.getTime() : Number.MAX_SAFE_INTEGER
    const bTime = b.dueDate ? b.dueDate.getTime() : Number.MAX_SAFE_INTEGER
    return aTime - bTime
  })
}

function sortByCompletedDateAscending(items: DetailedProjectTaskItem[]): DetailedProjectTaskItem[] {
  return items.slice().sort((a, b) => {
    const aTime = a.completedAt ? a.completedAt.getTime() : Number.MAX_SAFE_INTEGER
    const bTime = b.completedAt ? b.completedAt.getTime() : Number.MAX_SAFE_INTEGER
    return aTime - bTime
  })
}

function appendTaskList(
  lines: string[],
  heading: string,
  tasks: DetailedProjectTaskItem[],
  includeCompletedDate: boolean,
  includeProjectName: boolean,
) {
  lines.push(`## ${heading}`)
  lines.push('')

  if (tasks.length === 0) {
    lines.push('- No tasks in this state.')
    lines.push('')
    return
  }

  for (const task of tasks) {
    const safeDescription = task.description?.trim() || 'No description provided.'
    lines.push(`### ${task.title}`)
    if (includeProjectName) {
      lines.push(`- Project: ${task.projectName || 'Unknown Project'}`)
    }
    lines.push(`- Description: ${safeDescription}`)
    if (includeCompletedDate) {
      lines.push(`- Completed: ${task.completedAt ? formatDate(task.completedAt) : 'N/A'}`)
    } else {
      lines.push(`- Due Date: ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}`)
    }
    lines.push('')
  }
}

export function buildDetailedProjectReportMarkdown(input: DetailedProjectReportInput): string {
  const lines: string[] = []

  const plannedTasks = sortByDueDateAscending(input.plannedTasks)
  const inProgressTasks = sortByDueDateAscending(input.inProgressTasks)
  const completedTasks = sortByCompletedDateAscending(input.completedTasks)

  lines.push(`# Detailed Project Report: ${input.projectName}`)
  lines.push('')
  lines.push(`- Generated: ${format(input.generatedAt, 'dd MMM yyyy HH:mm')}`)
  lines.push(`- Planned tasks: ${plannedTasks.length}`)
  lines.push(`- In-progress tasks: ${inProgressTasks.length}`)
  lines.push(`- Completed tasks: ${completedTasks.length}`)
  lines.push('')

  appendTaskList(lines, 'Planned Tasks', plannedTasks, false, false)
  appendTaskList(lines, 'In-progress Tasks', inProgressTasks, false, false)
  appendTaskList(lines, 'Completed Tasks', completedTasks, true, false)

  return lines.join('\n').trimEnd()
}

export function buildDetailedAllProjectsReportMarkdown(input: DetailedAllProjectsReportInput): string {
  const lines: string[] = []

  const plannedTasks = sortByDueDateAscending(input.plannedTasks)
  const inProgressTasks = sortByDueDateAscending(input.inProgressTasks)
  const completedTasks = sortByCompletedDateAscending(input.completedTasks)
  const allTasks = [...plannedTasks, ...inProgressTasks, ...completedTasks]
  const tasksPerProject = allTasks.reduce<Record<string, number>>((acc, task) => {
    const key = task.projectName || 'Unknown Project'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  lines.push('# Detailed All Projects Tasks Report')
  lines.push('')
  lines.push(`- Period: ${formatDate(input.startDate)} to ${formatDate(input.endDate)}`)
  lines.push(`- Generated: ${format(input.generatedAt, 'dd MMM yyyy HH:mm')}`)
  lines.push(`- Planned tasks: ${plannedTasks.length}`)
  lines.push(`- In-progress tasks: ${inProgressTasks.length}`)
  lines.push(`- Completed tasks: ${completedTasks.length}`)
  lines.push('')

  lines.push('## Tasks per Project')
  lines.push('')
  const sortedProjects = Object.keys(tasksPerProject).sort((a, b) => a.localeCompare(b))
  if (sortedProjects.length === 0) {
    lines.push('- No project tasks found for the selected period.')
  } else {
    for (const projectName of sortedProjects) {
      lines.push(`- Project tasks: ${projectName} = ${tasksPerProject[projectName]}`)
    }
  }
  lines.push('')

  appendTaskList(lines, 'Planned Tasks', plannedTasks, false, true)
  appendTaskList(lines, 'In-progress Tasks', inProgressTasks, false, true)
  appendTaskList(lines, 'Completed Tasks', completedTasks, true, true)

  return lines.join('\n').trimEnd()
}

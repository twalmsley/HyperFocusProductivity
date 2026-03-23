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

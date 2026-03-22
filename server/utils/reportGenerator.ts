import { format } from 'date-fns'

export interface ReportTask {
  title: string
  completedAt: Date | string
  projectName?: string | null
}

export interface ReportCyclicTask {
  title: string
  completedAt: Date | string
}

export interface ReportJournalEntry {
  title: string
  date: Date | string
}

export interface ReportTrackerData {
  name: string
  completionDates: (Date | string)[]
  totalDaysInPeriod: number
}

export interface ReportData {
  startDate: Date
  endDate: Date
  projectTasks: ReportTask[]
  nonProjectTasks: ReportTask[]
  cyclicTasks: ReportCyclicTask[]
  journalEntries: ReportJournalEntry[]
  trackers: ReportTrackerData[]
}

function formatDate(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd')
}

function groupTasksByProject(tasks: ReportTask[]): Map<string, ReportTask[]> {
  const grouped = new Map<string, ReportTask[]>()

  for (const task of tasks) {
    const project = task.projectName || 'Unknown Project'
    if (!grouped.has(project)) {
      grouped.set(project, [])
    }
    grouped.get(project)!.push(task)
  }

  const sorted = new Map(
    [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))
  )

  for (const [, projectTasks] of sorted) {
    projectTasks.sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    )
  }

  return sorted
}

export function generateActivityReport(data: ReportData): string {
  const startStr = format(data.startDate, 'MMMM d, yyyy')
  const endStr = format(data.endDate, 'MMMM d, yyyy')

  const lines: string[] = []

  lines.push(`# Activity Report`)
  lines.push(``)
  lines.push(`**Period:** ${startStr} to ${endStr}`)
  lines.push(``)

  // Section 1: Project Tasks Summary
  lines.push(`## Project Tasks Summary`)
  lines.push(``)
  if (data.projectTasks.length === 0) {
    lines.push(`No project tasks completed during this period.`)
  } else {
    const grouped = groupTasksByProject(data.projectTasks)
    for (const [projectName, tasks] of grouped) {
      lines.push(`### ${projectName}`)
      lines.push(``)
      lines.push(`| Task | Completed |`)
      lines.push(`|------|-----------|`)
      for (const task of tasks) {
        lines.push(`| ${task.title} | ${formatDate(task.completedAt)} |`)
      }
      lines.push(``)
    }
  }
  lines.push(``)

  // Section 2: Non-project Tasks Summary
  lines.push(`## Non-project Tasks Summary`)
  lines.push(``)
  if (data.nonProjectTasks.length === 0) {
    lines.push(`No non-project tasks completed during this period.`)
  } else {
    const sorted = [...data.nonProjectTasks].sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    )
    lines.push(`| Task | Completed |`)
    lines.push(`|------|-----------|`)
    for (const task of sorted) {
      lines.push(`| ${task.title} | ${formatDate(task.completedAt)} |`)
    }
  }
  lines.push(``)

  // Section 3: Cyclic Tasks Summary
  lines.push(`## Cyclic Tasks Summary`)
  lines.push(``)
  if (data.cyclicTasks.length === 0) {
    lines.push(`No cyclic tasks completed during this period.`)
  } else {
    const sorted = [...data.cyclicTasks].sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    )
    lines.push(`| Task | Completed |`)
    lines.push(`|------|-----------|`)
    for (const task of sorted) {
      lines.push(`| ${task.title} | ${formatDate(task.completedAt)} |`)
    }
  }
  lines.push(``)

  // Section 4: Journal Summary
  lines.push(`## Journal Summary`)
  lines.push(``)
  if (data.journalEntries.length === 0) {
    lines.push(`No journal entries during this period.`)
  } else {
    const sorted = [...data.journalEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    lines.push(`| Title | Date |`)
    lines.push(`|-------|------|`)
    for (const entry of sorted) {
      lines.push(`| ${entry.title} | ${formatDate(entry.date)} |`)
    }
  }
  lines.push(``)

  // Section 5: Trackers Summary
  lines.push(`## Trackers Summary`)
  lines.push(``)
  if (data.trackers.length === 0) {
    lines.push(`No tracker activity during this period.`)
  } else {
    for (const tracker of data.trackers) {
      const completedCount = tracker.completionDates.length
      lines.push(`### ${tracker.name}`)
      lines.push(``)
      lines.push(
        `**${completedCount} completed out of ${tracker.totalDaysInPeriod} days**`
      )
      lines.push(``)
      if (completedCount > 0) {
        const sortedDates = [...tracker.completionDates].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        )
        lines.push(`Completed on: ${sortedDates.map(formatDate).join(', ')}`)
      }
      lines.push(``)
    }
  }

  return lines.join('\n')
}

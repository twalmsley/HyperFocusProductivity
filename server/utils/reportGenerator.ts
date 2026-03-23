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

export interface DetailedProjectTask {
  title: string
  description: string | null
  status: 'BACKLOG' | 'IN_PROGRESS' | 'DONE'
  dueDate: Date | string | null
  completedAt: Date | string | null
}

export interface DetailedProjectReportData {
  projectName: string
  tasks: DetailedProjectTask[]
}

function formatDate(date: Date | string): string {
  return format(new Date(date), 'yyyy-MM-dd')
}

function formatDateOrNone(date: Date | string | null): string {
  if (!date) return '-'
  return format(new Date(date), 'yyyy-MM-dd')
}

export interface PieSlice {
  label: string
  count: number
  color: string
}

export function generatePieChartSvg(slices: PieSlice[]): string {
  const total = slices.reduce((sum, s) => sum + s.count, 0)
  if (total === 0) {
    return '<p><em>No tasks to display in chart.</em></p>'
  }

  const size = 200
  const cx = size / 2
  const cy = size / 2
  const radius = 80

  const parts: string[] = []
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size + 200} ${size}" width="${size + 200}" height="${size}">`)

  let startAngle = -Math.PI / 2

  for (const slice of slices) {
    if (slice.count === 0) continue

    const sliceAngle = (slice.count / total) * 2 * Math.PI

    if (slice.count === total) {
      parts.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${slice.color}" />`)
    } else {
      const x1 = cx + radius * Math.cos(startAngle)
      const y1 = cy + radius * Math.sin(startAngle)
      const x2 = cx + radius * Math.cos(startAngle + sliceAngle)
      const y2 = cy + radius * Math.sin(startAngle + sliceAngle)
      const largeArc = sliceAngle > Math.PI ? 1 : 0

      parts.push(
        `<path d="M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z" fill="${slice.color}" />`
      )
    }

    startAngle += sliceAngle
  }

  let legendY = 30
  for (const slice of slices) {
    parts.push(`<rect x="${size + 10}" y="${legendY - 10}" width="14" height="14" fill="${slice.color}" />`)
    parts.push(`<text x="${size + 30}" y="${legendY + 2}" font-size="13" fill="#374151">${slice.label}: ${slice.count}</text>`)
    legendY += 28
  }

  parts.push('</svg>')
  return parts.join('\n')
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

export function generateDetailedProjectReport(data: DetailedProjectReportData): string {
  const lines: string[] = []

  lines.push(`# Detailed Project Report: ${data.projectName}`)
  lines.push(``)
  lines.push(`**Generated:** ${format(new Date(), 'MMMM d, yyyy')}`)
  lines.push(``)

  const planned = data.tasks.filter((t) => t.status === 'BACKLOG')
  const inProgress = data.tasks.filter((t) => t.status === 'IN_PROGRESS')
  const completed = data.tasks.filter((t) => t.status === 'DONE')

  const pieSlices: PieSlice[] = [
    { label: 'Planned', count: planned.length, color: '#6B7280' },
    { label: 'In Progress', count: inProgress.length, color: '#F59E0B' },
    { label: 'Completed', count: completed.length, color: '#10B981' }
  ]

  lines.push(`## Task Overview`)
  lines.push(``)
  lines.push(
    `**Total:** ${data.tasks.length} | **Planned:** ${planned.length} | **In Progress:** ${inProgress.length} | **Completed:** ${completed.length}`
  )
  lines.push(``)
  lines.push(generatePieChartSvg(pieSlices))
  lines.push(``)

  // Planned tasks sorted by due date
  lines.push(`## Planned Tasks`)
  lines.push(``)
  if (planned.length === 0) {
    lines.push(`No planned tasks.`)
  } else {
    const sorted = [...planned].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
    for (const task of sorted) {
      lines.push(`### ${task.title}`)
      lines.push(``)
      lines.push(`**Due:** ${formatDateOrNone(task.dueDate)}`)
      lines.push(``)
      lines.push(task.description || '*No description*')
      lines.push(``)
    }
  }

  // In-progress tasks sorted by due date
  lines.push(`## In Progress Tasks`)
  lines.push(``)
  if (inProgress.length === 0) {
    lines.push(`No tasks in progress.`)
  } else {
    const sorted = [...inProgress].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
    for (const task of sorted) {
      lines.push(`### ${task.title}`)
      lines.push(``)
      lines.push(`**Due:** ${formatDateOrNone(task.dueDate)}`)
      lines.push(``)
      lines.push(task.description || '*No description*')
      lines.push(``)
    }
  }

  // Completed tasks sorted by completion date
  lines.push(`## Completed Tasks`)
  lines.push(``)
  if (completed.length === 0) {
    lines.push(`No completed tasks.`)
  } else {
    const sorted = [...completed].sort((a, b) => {
      if (!a.completedAt && !b.completedAt) return 0
      if (!a.completedAt) return 1
      if (!b.completedAt) return -1
      return (
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
      )
    })
    for (const task of sorted) {
      lines.push(`### ${task.title}`)
      lines.push(``)
      lines.push(`**Completed:** ${formatDateOrNone(task.completedAt)}`)
      lines.push(``)
      lines.push(task.description || '*No description*')
      lines.push(``)
    }
  }

  return lines.join('\n')
}

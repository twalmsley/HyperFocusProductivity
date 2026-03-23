import { format, addDays, getDay, differenceInDays } from 'date-fns'

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

export interface AllTasksDetailedTask extends DetailedProjectTask {
  projectName: string | null
}

export interface DetailedAllTasksReportData {
  startDate: Date
  endDate: Date
  tasks: AllTasksDetailedTask[]
}

export interface TrackerReportEntry {
  date: Date | string
  value: number
}

export interface TrackerReportItem {
  name: string
  entries: TrackerReportEntry[]
}

export interface TrackersReportData {
  startDate: Date
  endDate: Date
  trackers: TrackerReportItem[]
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

function sortByDueDate<T extends { dueDate: Date | string | null }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}

function sortByCompletedAt<T extends { completedAt: Date | string | null }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    if (!a.completedAt && !b.completedAt) return 0
    if (!a.completedAt) return 1
    if (!b.completedAt) return -1
    return new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
  })
}

function renderPlannedTasks(tasks: DetailedProjectTask[], lines: string[], projectLabel?: (t: DetailedProjectTask) => string | null) {
  lines.push(`## Planned Tasks`)
  lines.push(``)
  if (tasks.length === 0) {
    lines.push(`No planned tasks.`)
  } else {
    for (const task of sortByDueDate(tasks)) {
      const label = projectLabel?.(task)
      lines.push(`### ${task.title}`)
      lines.push(``)
      if (label) lines.push(`**Project:** ${label}`)
      lines.push(`**Due:** ${formatDateOrNone(task.dueDate)}`)
      lines.push(``)
      lines.push(task.description || '*No description*')
      lines.push(``)
    }
  }
}

function renderInProgressTasks(tasks: DetailedProjectTask[], lines: string[], projectLabel?: (t: DetailedProjectTask) => string | null) {
  lines.push(`## In Progress Tasks`)
  lines.push(``)
  if (tasks.length === 0) {
    lines.push(`No tasks in progress.`)
  } else {
    for (const task of sortByDueDate(tasks)) {
      const label = projectLabel?.(task)
      lines.push(`### ${task.title}`)
      lines.push(``)
      if (label) lines.push(`**Project:** ${label}`)
      lines.push(`**Due:** ${formatDateOrNone(task.dueDate)}`)
      lines.push(``)
      lines.push(task.description || '*No description*')
      lines.push(``)
    }
  }
}

function renderCompletedTasks(tasks: DetailedProjectTask[], lines: string[], projectLabel?: (t: DetailedProjectTask) => string | null) {
  lines.push(`## Completed Tasks`)
  lines.push(``)
  if (tasks.length === 0) {
    lines.push(`No completed tasks.`)
  } else {
    for (const task of sortByCompletedAt(tasks)) {
      const label = projectLabel?.(task)
      lines.push(`### ${task.title}`)
      lines.push(``)
      if (label) lines.push(`**Project:** ${label}`)
      lines.push(`**Completed:** ${formatDateOrNone(task.completedAt)}`)
      lines.push(``)
      lines.push(task.description || '*No description*')
      lines.push(``)
    }
  }
}

function buildStatusPieSlices(tasks: DetailedProjectTask[]): PieSlice[] {
  const planned = tasks.filter((t) => t.status === 'BACKLOG').length
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length
  const completed = tasks.filter((t) => t.status === 'DONE').length
  return [
    { label: 'Planned', count: planned, color: '#6B7280' },
    { label: 'In Progress', count: inProgress, color: '#F59E0B' },
    { label: 'Completed', count: completed, color: '#10B981' }
  ]
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

  lines.push(`## Task Overview`)
  lines.push(``)
  lines.push(
    `**Total:** ${data.tasks.length} | **Planned:** ${planned.length} | **In Progress:** ${inProgress.length} | **Completed:** ${completed.length}`
  )
  lines.push(``)
  lines.push(generatePieChartSvg(buildStatusPieSlices(data.tasks)))
  lines.push(``)

  renderPlannedTasks(planned, lines)
  renderInProgressTasks(inProgress, lines)
  renderCompletedTasks(completed, lines)

  return lines.join('\n')
}

const PROJECT_COLORS = [
  '#3B82F6', '#EF4444', '#8B5CF6', '#F97316', '#06B6D4',
  '#EC4899', '#14B8A6', '#F59E0B', '#6366F1', '#84CC16'
]

export function generateDetailedAllTasksReport(data: DetailedAllTasksReportData): string {
  const lines: string[] = []

  const startStr = format(data.startDate, 'MMMM d, yyyy')
  const endStr = format(data.endDate, 'MMMM d, yyyy')

  lines.push(`# Detailed All Tasks Report`)
  lines.push(``)
  lines.push(`**Period:** ${startStr} to ${endStr}`)
  lines.push(``)

  const planned = data.tasks.filter((t) => t.status === 'BACKLOG')
  const inProgress = data.tasks.filter((t) => t.status === 'IN_PROGRESS')
  const completed = data.tasks.filter((t) => t.status === 'DONE')

  lines.push(`## Task Overview`)
  lines.push(``)
  lines.push(
    `**Total:** ${data.tasks.length} | **Planned:** ${planned.length} | **In Progress:** ${inProgress.length} | **Completed:** ${completed.length}`
  )
  lines.push(``)

  // Pie chart 1: Tasks by state
  lines.push(`### Tasks by Status`)
  lines.push(``)
  lines.push(generatePieChartSvg(buildStatusPieSlices(data.tasks)))
  lines.push(``)

  // Pie chart 2: Tasks by project
  const projectCounts = new Map<string, number>()
  for (const task of data.tasks) {
    const name = task.projectName || 'No Project'
    projectCounts.set(name, (projectCounts.get(name) || 0) + 1)
  }
  const projectSlices: PieSlice[] = [...projectCounts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, count], i) => ({
      label: name,
      count,
      color: PROJECT_COLORS[i % PROJECT_COLORS.length]
    }))

  lines.push(`### Tasks by Project`)
  lines.push(``)
  lines.push(generatePieChartSvg(projectSlices))
  lines.push(``)

  const getProjectLabel = (t: DetailedProjectTask) => {
    return (t as AllTasksDetailedTask).projectName || 'No Project'
  }

  renderPlannedTasks(planned, lines, getProjectLabel)
  renderInProgressTasks(inProgress, lines, getProjectLabel)
  renderCompletedTasks(completed, lines, getProjectLabel)

  return lines.join('\n')
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hPrime = h / 60
  const x = c * (1 - Math.abs(hPrime % 2 - 1))
  const m = l - c / 2

  let r1 = 0, g1 = 0, b1 = 0
  if (hPrime >= 0 && hPrime < 1) { r1 = c; g1 = x }
  else if (hPrime >= 1 && hPrime <= 2) { r1 = x; g1 = c }

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`
}

export const RAINBOW_COLORS: string[] = Array.from({ length: 20 }, (_, i) =>
  hslToHex((i / 19) * 120, 0.8, 0.45)
)

function getHeatmapColor(value: number): string {
  if (value === 0) return '#ebedf0'
  if (value <= 25) return '#9be9a8'
  if (value <= 50) return '#40c463'
  if (value <= 75) return '#30a14e'
  return '#216e39'
}

export function generateActivityHeatmapSvg(
  startDate: Date,
  endDate: Date,
  entries: TrackerReportEntry[]
): string {
  const cellSize = 13
  const gap = 3
  const stride = cellSize + gap
  const leftMargin = 36
  const topMargin = 20

  const valueMap = new Map<string, number>()
  for (const entry of entries) {
    valueMap.set(format(new Date(entry.date), 'yyyy-MM-dd'), entry.value)
  }

  const startNorm = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
  const endNorm = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

  const mondayOffset = (getDay(startNorm) + 6) % 7
  const gridStart = addDays(startNorm, -mondayOffset)

  const mondayBasedEndDay = (getDay(endNorm) + 6) % 7
  const gridEnd = addDays(endNorm, 6 - mondayBasedEndDay)

  const numWeeks = Math.round((differenceInDays(gridEnd, gridStart) + 1) / 7)

  const legendWidth = 130
  const svgWidth = leftMargin + numWeeks * stride + 10 + legendWidth
  const svgHeight = topMargin + 7 * stride

  const parts: string[] = []
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">`)

  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', '']
  for (let i = 0; i < 7; i++) {
    if (dayLabels[i]) {
      parts.push(`<text x="${leftMargin - 6}" y="${topMargin + i * stride + cellSize - 2}" font-size="10" fill="#57606a" text-anchor="end">${dayLabels[i]}</text>`)
    }
  }

  let currentDate = new Date(gridStart)
  const startKey = format(startNorm, 'yyyy-MM-dd')
  const endKey = format(endNorm, 'yyyy-MM-dd')
  const labeledMonths = new Set<number>()
  const labeledWeeks = new Set<number>()

  for (let week = 0; week < numWeeks; week++) {
    for (let day = 0; day < 7; day++) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      const inRange = dateKey >= startKey && dateKey <= endKey

      if (inRange) {
        const month = currentDate.getMonth()
        if (!labeledMonths.has(month) && !labeledWeeks.has(week)) {
          parts.push(`<text x="${leftMargin + week * stride}" y="${topMargin - 6}" font-size="10" fill="#57606a">${format(currentDate, 'MMM')}</text>`)
          labeledMonths.add(month)
          labeledWeeks.add(week)
        }

        const value = valueMap.get(dateKey) || 0
        const color = getHeatmapColor(value)
        const x = leftMargin + week * stride
        const y = topMargin + day * stride
        parts.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" />`)
      }

      currentDate = addDays(currentDate, 1)
    }
  }

  const legendX = leftMargin + numWeeks * stride + 10
  const legendY = topMargin + 3 * stride
  const legendColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
  parts.push(`<text x="${legendX}" y="${legendY + cellSize - 2}" font-size="10" fill="#57606a">Less</text>`)
  let lx = legendX + 28
  for (const color of legendColors) {
    parts.push(`<rect x="${lx}" y="${legendY}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" />`)
    lx += cellSize + 2
  }
  parts.push(`<text x="${lx + 2}" y="${legendY + cellSize - 2}" font-size="10" fill="#57606a">More</text>`)

  parts.push('</svg>')
  return parts.join('\n')
}

export function generateProgressBarSvg(percentage: number): string {
  const bandWidth = 18
  const bandHeight = 22
  const bandGap = 2
  const totalBands = 20
  const barWidth = totalBands * (bandWidth + bandGap) - bandGap

  const leftPad = 22
  const rightPad = 36
  const svgWidth = leftPad + barWidth + rightPad
  const svgHeight = bandHeight

  const filledBands = Math.min(20, Math.max(0, Math.round(percentage / 5)))

  const parts: string[] = []
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">`)

  parts.push(`<text x="0" y="${svgHeight / 2 + 4}" font-size="10" fill="#57606a">0%</text>`)

  for (let i = 0; i < totalBands; i++) {
    const x = leftPad + i * (bandWidth + bandGap)
    const isFilled = i < filledBands
    const color = isFilled ? RAINBOW_COLORS[i] : '#e5e7eb'
    parts.push(`<rect x="${x}" y="0" width="${bandWidth}" height="${bandHeight}" rx="2" fill="${color}" />`)
  }

  parts.push(`<text x="${leftPad + barWidth + 4}" y="${svgHeight / 2 + 4}" font-size="10" fill="#57606a">100%</text>`)

  parts.push('</svg>')
  return parts.join('\n')
}

export function generateTrackersReport(data: TrackersReportData): string {
  const startStr = format(data.startDate, 'MMMM d, yyyy')
  const endStr = format(data.endDate, 'MMMM d, yyyy')
  const totalDays = differenceInDays(data.endDate, data.startDate) + 1

  const lines: string[] = []

  lines.push(`# Trackers Report`)
  lines.push(``)
  lines.push(`**Period:** ${startStr} to ${endStr}`)
  lines.push(``)

  if (data.trackers.length === 0) {
    lines.push(`No trackers found.`)
    return lines.join('\n')
  }

  for (const tracker of data.trackers) {
    const completedDays = tracker.entries.filter((e) => e.value > 0).length
    const percentage = totalDays > 0 ? (completedDays / totalDays) * 100 : 0

    lines.push(`## ${tracker.name}`)
    lines.push(``)
    lines.push(`**${completedDays} completed out of ${totalDays} days (${percentage.toFixed(1)}%)**`)
    lines.push(``)
    lines.push(generateActivityHeatmapSvg(data.startDate, data.endDate, tracker.entries))
    lines.push(``)
    lines.push(`**Score:**`)
    lines.push(``)
    lines.push(generateProgressBarSvg(percentage))
    lines.push(``)
    lines.push(`---`)
    lines.push(``)
  }

  return lines.join('\n')
}

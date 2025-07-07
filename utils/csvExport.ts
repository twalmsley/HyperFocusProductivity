export interface UserData {
  user: {
    id: string
    email: string
    name: string | null
    createdAt: string | Date
    proStatus: boolean
  }
  settings: {
    userId: string
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    longBreakInterval: number
    theme: string
  } | null
  projects: Array<{
    id: string
    name: string
    description: string | null
    color: string | null
    createdAt: string | Date
    updatedAt: string | Date
  }>
  tasks: Array<{
    id: string
    title: string
    notes: string | null
    estimatedPomodoros: number | null
    completedPomodoros: number
    status: string
    priority: string
    createdAt: string | Date
    completedAt: string | Date | null
    dueDate: string | Date | null
    projectName: string | null
  }>
  sessions: Array<{
    id: string
    startTime: string | Date
    endTime: string | Date | null
    duration: number
    type: string
  }>
  journalEntries: Array<{
    id: string
    title: string
    content: string
    type: string
    date: string | Date
    mood: string | null
    tags: string[]
  }>
  cyclicTasks: Array<{
    id: string
    groupName: string
    title: string
    description: string | null
    lastCompletedDate: string | Date | null
    createdAt: string | Date
  }>
  trackers: Array<{
    id: string
    name: string
    groupName: string
    createdAt: string | Date
    entries: Array<{
      id: string
      date: string | Date
      value: number
    }>
  }>
}

// Helper function to safely convert dates to ISO strings
function toISOString(date: string | Date | null): string {
  if (!date) return ''
  if (typeof date === 'string') {
    return new Date(date).toISOString()
  }
  return date.toISOString()
}

export function convertToCSV(data: UserData): { filename: string; content: string }[] {
  const files: { filename: string; content: string }[] = []
  
  // User Profile
  const userCSV = [
    ['Field', 'Value'],
    ['Email', data.user.email],
    ['Name', data.user.name || ''],
    ['Account Created', toISOString(data.user.createdAt)],
    ['Pro Status', data.user.proStatus ? 'Yes' : 'No']
  ]
  files.push({
    filename: 'user-profile.csv',
    content: userCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
  })

  // Settings
  if (data.settings) {
    const settingsCSV = [
      ['Setting', 'Value'],
      ['Focus Duration (minutes)', data.settings.focusDuration.toString()],
      ['Short Break Duration (minutes)', data.settings.shortBreakDuration.toString()],
      ['Long Break Duration (minutes)', data.settings.longBreakDuration.toString()],
      ['Long Break Interval', data.settings.longBreakInterval.toString()],
      ['Theme', data.settings.theme]
    ]
    files.push({
      filename: 'settings.csv',
      content: settingsCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    })
  }

  // Projects
  if (data.projects.length > 0) {
    const projectsCSV = [
      ['ID', 'Name', 'Description', 'Color', 'Created At', 'Updated At'],
      ...data.projects.map(project => [
        project.id,
        project.name,
        project.description || '',
        project.color || '',
        toISOString(project.createdAt),
        toISOString(project.updatedAt)
      ])
    ]
    files.push({
      filename: 'projects.csv',
      content: projectsCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    })
  }

  // Tasks
  if (data.tasks.length > 0) {
    const tasksCSV = [
      ['ID', 'Title', 'Notes', 'Estimated Pomodoros', 'Completed Pomodoros', 'Status', 'Priority', 'Project', 'Created At', 'Completed At', 'Due Date'],
      ...data.tasks.map(task => [
        task.id,
        task.title,
        task.notes || '',
        task.estimatedPomodoros?.toString() || '',
        task.completedPomodoros.toString(),
        task.status,
        task.priority,
        task.projectName || '',
        toISOString(task.createdAt),
        toISOString(task.completedAt),
        toISOString(task.dueDate)
      ])
    ]
    files.push({
      filename: 'tasks.csv',
      content: tasksCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    })
  }

  // Sessions
  if (data.sessions.length > 0) {
    const sessionsCSV = [
      ['ID', 'Start Time', 'End Time', 'Duration (minutes)', 'Type'],
      ...data.sessions.map(session => [
        session.id,
        toISOString(session.startTime),
        toISOString(session.endTime),
        session.duration.toString(),
        session.type
      ])
    ]
    files.push({
      filename: 'sessions.csv',
      content: sessionsCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    })
  }

  // Journal Entries
  if (data.journalEntries.length > 0) {
    const journalCSV = [
      ['ID', 'Title', 'Content', 'Type', 'Date', 'Mood', 'Tags'],
      ...data.journalEntries.map(entry => [
        entry.id,
        entry.title,
        entry.content.replace(/"/g, '""'), // Escape quotes in content
        entry.type,
        toISOString(entry.date),
        entry.mood || '',
        entry.tags.join('; ')
      ])
    ]
    files.push({
      filename: 'journal-entries.csv',
      content: journalCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    })
  }

  // Cyclic Tasks
  if (data.cyclicTasks.length > 0) {
    const cyclicTasksCSV = [
      ['ID', 'Group Name', 'Title', 'Description', 'Last Completed Date', 'Created At'],
      ...data.cyclicTasks.map(task => [
        task.id,
        task.groupName,
        task.title,
        task.description || '',
        toISOString(task.lastCompletedDate),
        toISOString(task.createdAt)
      ])
    ]
    files.push({
      filename: 'cyclic-tasks.csv',
      content: cyclicTasksCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    })
  }

  // Trackers
  if (data.trackers.length > 0) {
    const trackersCSV = [
      ['Tracker ID', 'Tracker Name', 'Group Name', 'Entry Date', 'Value', 'Created At'],
      ...data.trackers.flatMap(tracker => 
        tracker.entries.map(entry => [
          tracker.id,
          tracker.name,
          tracker.groupName,
          toISOString(entry.date),
          entry.value.toString(),
          toISOString(entry.date)
        ])
      )
    ]
    files.push({
      filename: 'trackers.csv',
      content: trackersCSV.map(row => row.map(field => `"${field}"`).join(',')).join('\n')
    })
  }

  return files
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
} 
import type { Task } from '~/types/task'

/**
 * Checks if a task is overdue based on its due date and status
 * @param task - The task to check
 * @returns true if the task is overdue, false otherwise
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'DONE') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)

  return dueDate < today
}

/**
 * Gets the number of days a task is overdue
 * @param task - The task to check
 * @returns The number of days overdue (negative if not overdue, 0 if due today)
 */
export function getDaysOverdue(task: Task): number {
  if (!task.dueDate || task.status === 'DONE') return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  const timeDiff = today.getTime() - dueDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Checks if a task is due today
 * @param task - The task to check
 * @returns true if the task is due today, false otherwise
 */
export function isTaskDueToday(task: Task): boolean {
  if (!task.dueDate || task.status === 'DONE') return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dueDate = new Date(task.dueDate)
  dueDate.setHours(0, 0, 0, 0)

  return dueDate.getTime() === today.getTime()
}

/**
 * Gets the formatted due date string for display
 * @param task - The task to format
 * @returns Formatted date string or '-' if no due date
 */
export function getFormattedDueDate(task: Task): string {
  if (!task.dueDate) return '-'
  return new Date(task.dueDate).toISOString().slice(0, 10)
}

/**
 * Formats a due date string into a human-readable format
 * @param dateString - The date string to format (ISO string or null)
 * @returns Human-readable date string
 */
export function formatDueDate(dateString: string | null): string {
  if (!dateString) return 'No due date'

  const dueDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Normalize the due date to compare only the date part
  const normalizedDueDate = new Date(dueDate)
  normalizedDueDate.setHours(0, 0, 0, 0)

  if (normalizedDueDate.getTime() === today.getTime()) {
    return 'Due today'
  } else if (normalizedDueDate.getTime() === yesterday.getTime()) {
    return 'Due yesterday'
  } else if (normalizedDueDate.getTime() === tomorrow.getTime()) {
    return 'Due tomorrow'
  } else if (normalizedDueDate < today) {
    const diffTime = Math.abs(today.getTime() - normalizedDueDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays > 1 ? 's' : ''} overdue`
  } else {
    return `Due on ${dueDate.toLocaleDateString()}`
  }
} 
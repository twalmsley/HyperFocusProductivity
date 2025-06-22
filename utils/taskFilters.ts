import type { Task } from '~/types/task'

export interface TaskFilters {
  search: string
  status: string
  priority: string
  dueDate: string
  projectId: string
}

/**
 * Filters tasks based on the provided filter criteria
 * @param tasks - Array of tasks to filter
 * @param filters - Filter criteria object
 * @returns Filtered array of tasks
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter(task => {
    // Project filter
    if (filters.projectId) {
      if (!task.projectId || task.projectId !== filters.projectId) {
        return false
      }
    }

    // Status filter
    if (filters.status) {
      if (filters.status === 'NOT_DONE') {
        // NOT_DONE includes both BACKLOG and IN_PROGRESS tasks
        if (task.status !== 'BACKLOG' && task.status !== 'IN_PROGRESS') {
          return false
        }
      } else if (task.status !== filters.status) {
        return false
      }
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false
    }

    // Due date filter
    if (filters.dueDate) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      const endOfWeek = new Date(today)
      endOfWeek.setTime(endOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)

      const endOfMonth = new Date(today)
      endOfMonth.setTime(endOfMonth.getTime() + 30 * 24 * 60 * 60 * 1000)

      // Check if it's a valid due date filter
      const validDueDateFilters = ['today', 'tomorrow', 'week', 'month', 'overdue', 'none']
      if (!validDueDateFilters.includes(filters.dueDate)) {
        // Invalid filter, don't filter by due date
      } else {
        if (!task.dueDate) {
          if (filters.dueDate !== 'none') {
            return false
          }
        } else {
          const taskDate = new Date(task.dueDate)
          taskDate.setHours(0, 0, 0, 0)

          switch (filters.dueDate) {
            case 'today':
              if (taskDate.getTime() !== today.getTime()) return false
              break
            case 'tomorrow':
              if (taskDate.getTime() !== tomorrow.getTime()) return false
              break
            case 'week':
              if (taskDate < today || taskDate > endOfWeek) return false
              break
            case 'month':
              if (taskDate < today || taskDate > endOfMonth) return false
              break
            case 'overdue':
              // Exclude completed tasks from overdue filter
              if (task.status === 'DONE') return false
              if (taskDate >= today) return false
              break
            case 'none':
              return false
          }
        }
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        task.title.toLowerCase().includes(searchLower) ||
        (task.notes && task.notes.toLowerCase().includes(searchLower))
      )
    }

    return true
  })
} 
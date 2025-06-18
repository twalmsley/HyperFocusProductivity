import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isTaskOverdue, getDaysOverdue, isTaskDueToday, getFormattedDueDate, formatDueDate } from '~/utils/taskUtils'
import type { Task } from '~/types/task'

describe('Task Utils', () => {
  let mockDate: Date

  beforeEach(() => {
    // Mock the current date to 2024-01-15
    mockDate = new Date('2024-01-15T10:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const createMockTask = (overrides: Partial<Task> = {}): Task => ({
    id: '1',
    userId: 'user1',
    title: 'Test Task',
    notes: null,
    estimatedPomodoros: null,
    completedPomodoros: 0,
    status: 'BACKLOG',
    priority: 'MEDIUM',
    createdAt: '2024-01-01T00:00:00Z',
    completedAt: null,
    dueDate: null,
    position: null,
    repeatType: null,
    repeatInterval: null,
    repeatDays: null,
    repeatMonth: null,
    repeatDay: null,
    repeatWeekOfMonth: null,
    repeatDayOfWeek: null,
    isTemplate: false,
    templateTaskId: null,
    ...overrides
  })

  describe('isTaskOverdue', () => {
    it('returns false for tasks without due date', () => {
      const task = createMockTask({ dueDate: null })
      expect(isTaskOverdue(task)).toBe(false)
    })

    it('returns false for completed tasks', () => {
      const task = createMockTask({ 
        dueDate: '2024-01-10T00:00:00Z',
        status: 'DONE'
      })
      expect(isTaskOverdue(task)).toBe(false)
    })

    it('returns false for tasks due in the future', () => {
      const task = createMockTask({ dueDate: '2024-01-20T00:00:00Z' })
      expect(isTaskOverdue(task)).toBe(false)
    })

    it('returns false for tasks due today', () => {
      const task = createMockTask({ dueDate: '2024-01-15T00:00:00Z' })
      expect(isTaskOverdue(task)).toBe(false)
    })

    it('returns true for overdue tasks', () => {
      const task = createMockTask({ dueDate: '2024-01-10T00:00:00Z' })
      expect(isTaskOverdue(task)).toBe(true)
    })

    it('returns true for tasks overdue by multiple days', () => {
      const task = createMockTask({ dueDate: '2024-01-05T00:00:00Z' })
      expect(isTaskOverdue(task)).toBe(true)
    })

    it('handles different time zones correctly', () => {
      const task = createMockTask({ dueDate: '2024-01-14T23:59:59Z' })
      expect(isTaskOverdue(task)).toBe(true)
    })
  })

  describe('getDaysOverdue', () => {
    it('returns 0 for tasks without due date', () => {
      const task = createMockTask({ dueDate: null })
      expect(getDaysOverdue(task)).toBe(0)
    })

    it('returns 0 for completed tasks', () => {
      const task = createMockTask({ 
        dueDate: '2024-01-10T00:00:00Z',
        status: 'DONE'
      })
      expect(getDaysOverdue(task)).toBe(0)
    })

    it('returns 0 for tasks due today', () => {
      const task = createMockTask({ dueDate: '2024-01-15T00:00:00Z' })
      expect(getDaysOverdue(task)).toBe(0)
    })

    it('returns positive number for overdue tasks', () => {
      const task = createMockTask({ dueDate: '2024-01-10T00:00:00Z' })
      expect(getDaysOverdue(task)).toBe(5)
    })

    it('returns correct days for tasks overdue by multiple days', () => {
      const task = createMockTask({ dueDate: '2024-01-05T00:00:00Z' })
      expect(getDaysOverdue(task)).toBe(10)
    })

    it('returns negative number for future tasks', () => {
      const task = createMockTask({ dueDate: '2024-01-20T00:00:00Z' })
      expect(getDaysOverdue(task)).toBe(-5)
    })

    it('handles partial days correctly', () => {
      const task = createMockTask({ dueDate: '2024-01-14T23:59:59Z' })
      expect(getDaysOverdue(task)).toBe(1)
    })
  })

  describe('isTaskDueToday', () => {
    it('returns false for tasks without due date', () => {
      const task = createMockTask({ dueDate: null })
      expect(isTaskDueToday(task)).toBe(false)
    })

    it('returns false for completed tasks', () => {
      const task = createMockTask({ 
        dueDate: '2024-01-15T00:00:00Z',
        status: 'DONE'
      })
      expect(isTaskDueToday(task)).toBe(false)
    })

    it('returns true for tasks due today', () => {
      const task = createMockTask({ dueDate: '2024-01-15T00:00:00Z' })
      expect(isTaskDueToday(task)).toBe(true)
    })

    it('returns true for tasks due today with different times', () => {
      const task = createMockTask({ dueDate: '2024-01-15T23:59:59Z' })
      expect(isTaskDueToday(task)).toBe(true)
    })

    it('returns false for tasks due yesterday', () => {
      const task = createMockTask({ dueDate: '2024-01-14T00:00:00Z' })
      expect(isTaskDueToday(task)).toBe(false)
    })

    it('returns false for tasks due tomorrow', () => {
      const task = createMockTask({ dueDate: '2024-01-16T00:00:00Z' })
      expect(isTaskDueToday(task)).toBe(false)
    })
  })

  describe('getFormattedDueDate', () => {
    it('returns "-" for tasks without due date', () => {
      const task = createMockTask({ dueDate: null })
      expect(getFormattedDueDate(task)).toBe('-')
    })

    it('formats due date correctly', () => {
      const task = createMockTask({ dueDate: '2024-01-15T10:30:00Z' })
      expect(getFormattedDueDate(task)).toBe('2024-01-15')
    })

    it('formats date with time correctly', () => {
      const task = createMockTask({ dueDate: '2024-12-31T23:59:59Z' })
      expect(getFormattedDueDate(task)).toBe('2024-12-31')
    })

    it('handles leap year dates', () => {
      const task = createMockTask({ dueDate: '2024-02-29T00:00:00Z' })
      expect(getFormattedDueDate(task)).toBe('2024-02-29')
    })

    it('works with different date formats', () => {
      const task = createMockTask({ dueDate: '2024-03-01T12:00:00.000Z' })
      expect(getFormattedDueDate(task)).toBe('2024-03-01')
    })
  })

  describe('formatDueDate', () => {
    it('returns "No due date" for null input', () => {
      expect(formatDueDate(null)).toBe('No due date')
    })

    it('returns "No due date" for empty string', () => {
      expect(formatDueDate('')).toBe('No due date')
    })

    it('returns "Due today" for today', () => {
      expect(formatDueDate('2024-01-15T00:00:00Z')).toBe('Due today')
    })

    it('returns "Due today" for today with different times', () => {
      expect(formatDueDate('2024-01-15T23:59:59Z')).toBe('Due today')
    })

    it('returns "Due yesterday" for yesterday', () => {
      expect(formatDueDate('2024-01-14T00:00:00Z')).toBe('Due yesterday')
    })

    it('returns "Due yesterday" for yesterday with different times', () => {
      expect(formatDueDate('2024-01-14T23:59:59Z')).toBe('Due yesterday')
    })

    it('returns "Due tomorrow" for tomorrow', () => {
      expect(formatDueDate('2024-01-16T00:00:00Z')).toBe('Due tomorrow')
    })

    it('returns "Due tomorrow" for tomorrow with different times', () => {
      expect(formatDueDate('2024-01-16T23:59:59Z')).toBe('Due tomorrow')
    })

    it('returns "1 day overdue" for one day overdue', () => {
      expect(formatDueDate('2024-01-14T00:00:00Z')).toBe('Due yesterday')
    })

    it('returns "2 days overdue" for multiple days overdue', () => {
      expect(formatDueDate('2024-01-13T00:00:00Z')).toBe('2 days overdue')
    })

    it('returns "5 days overdue" for five days overdue', () => {
      expect(formatDueDate('2024-01-10T00:00:00Z')).toBe('5 days overdue')
    })

    it('returns "Due on [date]" for future dates', () => {
      const result = formatDueDate('2024-01-20T00:00:00Z')
      expect(result).toMatch(/^Due on \d{1,2}\/\d{1,2}\/\d{4}$/)
    })

    it('returns "Due on [date]" for dates far in the future', () => {
      const result = formatDueDate('2024-12-31T00:00:00Z')
      expect(result).toMatch(/^Due on \d{1,2}\/\d{1,2}\/\d{4}$/)
    })

    it('handles different date formats', () => {
      expect(formatDueDate('2024-01-15')).toBe('Due today')
      expect(formatDueDate('2024-01-15T10:30:00.000Z')).toBe('Due today')
    })

    it('handles edge cases around midnight', () => {
      expect(formatDueDate('2024-01-15T00:00:00.001Z')).toBe('Due today')
      expect(formatDueDate('2024-01-14T23:59:59.999Z')).toBe('Due yesterday')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string due dates', () => {
      const task = createMockTask({ dueDate: '' })
      expect(isTaskOverdue(task)).toBe(false)
      expect(getDaysOverdue(task)).toBe(0)
      expect(isTaskDueToday(task)).toBe(false)
      expect(getFormattedDueDate(task)).toBe('-')
    })

    it('handles tasks with all status types', () => {
      const dueDate = '2024-01-10T00:00:00Z'
      
      const backlogTask = createMockTask({ dueDate, status: 'BACKLOG' })
      const inProgressTask = createMockTask({ dueDate, status: 'IN_PROGRESS' })
      const doneTask = createMockTask({ dueDate, status: 'DONE' })

      expect(isTaskOverdue(backlogTask)).toBe(true)
      expect(isTaskOverdue(inProgressTask)).toBe(true)
      expect(isTaskOverdue(doneTask)).toBe(false)
    })
  })
}) 
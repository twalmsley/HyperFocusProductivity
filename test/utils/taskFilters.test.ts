import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { filterTasks, type TaskFilters } from '~/utils/taskFilters'
import type { Task } from '~/types/task'

describe('filterTasks', () => {
  let mockTasks: Task[]
  let baseDate: Date

  beforeEach(() => {
    // Set a fixed date for consistent testing
    baseDate = new Date('2024-01-15T12:00:00Z')
    
    mockTasks = [
      {
        id: '1',
        userId: 'user1',
        title: 'Complete project documentation',
        notes: 'Write comprehensive documentation for the new feature',
        estimatedPomodoros: 4,
        completedPomodoros: 2,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        createdAt: '2024-01-10T10:00:00Z',
        completedAt: null,
        dueDate: '2024-01-15T23:59:59Z', // Today
        position: 1,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      },
      {
        id: '2',
        userId: 'user1',
        title: 'Review code changes',
        notes: 'Review pull request #123',
        estimatedPomodoros: 2,
        completedPomodoros: 0,
        status: 'BACKLOG',
        priority: 'MEDIUM',
        createdAt: '2024-01-12T14:00:00Z',
        completedAt: null,
        dueDate: '2024-01-16T23:59:59Z', // Tomorrow
        position: 2,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      },
      {
        id: '3',
        userId: 'user1',
        title: 'Bug fix for login issue',
        notes: 'Fix authentication bug in production',
        estimatedPomodoros: 1,
        completedPomodoros: 1,
        status: 'DONE',
        priority: 'URGENT',
        createdAt: '2024-01-08T09:00:00Z',
        completedAt: '2024-01-14T16:00:00Z',
        dueDate: '2024-01-14T23:59:59Z', // Yesterday (overdue)
        position: 3,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      },
      {
        id: '4',
        userId: 'user1',
        title: 'Weekly team meeting',
        notes: 'Discuss project progress and next steps',
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        status: 'BACKLOG',
        priority: 'LOW',
        createdAt: '2024-01-13T11:00:00Z',
        completedAt: null,
        dueDate: '2024-01-22T23:59:59Z', // Next week
        position: 4,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      },
      {
        id: '5',
        userId: 'user1',
        title: 'No due date task',
        notes: 'This task has no due date',
        estimatedPomodoros: 3,
        completedPomodoros: 0,
        status: 'BACKLOG',
        priority: 'MEDIUM',
        createdAt: '2024-01-11T15:00:00Z',
        completedAt: null,
        dueDate: null,
        position: 5,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      }
    ]
  })

  describe('no filters applied', () => {
    it('should return all tasks when no filters are provided', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(5)
      expect(result).toEqual(mockTasks)
    })
  })

  describe('status filter', () => {
    it('should filter by BACKLOG status', () => {
      const filters: TaskFilters = {
        search: '',
        status: 'BACKLOG',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(3)
      expect(result.every(task => task.status === 'BACKLOG')).toBe(true)
    })

    it('should filter by IN_PROGRESS status', () => {
      const filters: TaskFilters = {
        search: '',
        status: 'IN_PROGRESS',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('IN_PROGRESS')
    })

    it('should filter by DONE status', () => {
      const filters: TaskFilters = {
        search: '',
        status: 'DONE',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].status).toBe('DONE')
    })

    it('should filter by NOT_DONE status (BACKLOG and IN_PROGRESS)', () => {
      const filters: TaskFilters = {
        search: '',
        status: 'NOT_DONE',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(4) // 3 BACKLOG + 1 IN_PROGRESS
      expect(result.every(task => task.status === 'BACKLOG' || task.status === 'IN_PROGRESS')).toBe(true)
    })

    it('should return empty array for non-existent status', () => {
      const filters: TaskFilters = {
        search: '',
        status: 'NON_EXISTENT',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(0)
    })
  })

  describe('priority filter', () => {
    it('should filter by URGENT priority', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: 'URGENT',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].priority).toBe('URGENT')
    })

    it('should filter by HIGH priority', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: 'HIGH',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].priority).toBe('HIGH')
    })

    it('should filter by MEDIUM priority', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: 'MEDIUM',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(2)
      expect(result.every(task => task.priority === 'MEDIUM')).toBe(true)
    })

    it('should filter by LOW priority', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: 'LOW',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].priority).toBe('LOW')
    })
  })

  describe('due date filter', () => {
    beforeEach(() => {
      // Mock the current date to be 2024-01-15
      vi.useFakeTimers()
      vi.setSystemTime(baseDate)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should filter by today', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: 'today'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Complete project documentation')
    })

    it('should filter by tomorrow', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: 'tomorrow'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Review code changes')
    })

    it('should filter by week', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: 'week'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(3)
      expect(result.map(task => task.title)).toContain('Complete project documentation')
      expect(result.map(task => task.title)).toContain('Review code changes')
      expect(result.map(task => task.title)).toContain('Weekly team meeting')
    })

    it('should filter by month', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: 'month'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(3)
      expect(result.map(task => task.title)).toContain('Complete project documentation')
      expect(result.map(task => task.title)).toContain('Review code changes')
      expect(result.map(task => task.title)).toContain('Weekly team meeting')
    })

    it('should filter by overdue (excluding completed tasks)', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: 'overdue'
      }

      const result = filterTasks(mockTasks, filters)
      // Should not include the DONE task even though it's overdue
      expect(result).toHaveLength(0)
    })

    it('should filter by none (tasks without due date)', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: 'none'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('No due date task')
    })

    it('should handle invalid due date filter', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: 'invalid'
      }

      const result = filterTasks(mockTasks, filters)
      // Should return all tasks since invalid filter is ignored
      expect(result).toHaveLength(5)
    })
  })

  describe('search filter', () => {
    it('should search in task title (case insensitive)', () => {
      const filters: TaskFilters = {
        search: 'documentation',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Complete project documentation')
    })

    it('should search in task notes (case insensitive)', () => {
      const filters: TaskFilters = {
        search: 'authentication',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Bug fix for login issue')
    })

    it('should search with partial matches', () => {
      const filters: TaskFilters = {
        search: 'doc',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Complete project documentation')
    })

    it('should handle case insensitive search', () => {
      const filters: TaskFilters = {
        search: 'DOCUMENTATION',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Complete project documentation')
    })

    it('should return empty array for non-matching search', () => {
      const filters: TaskFilters = {
        search: 'nonexistent',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(0)
    })

    it('should handle empty search string', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(5)
    })
  })

  describe('combined filters', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(baseDate)
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should combine status and priority filters', () => {
      const filters: TaskFilters = {
        search: '',
        status: 'BACKLOG',
        priority: 'MEDIUM',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(2)
      expect(result.every(task => task.status === 'BACKLOG' && task.priority === 'MEDIUM')).toBe(true)
    })

    it('should combine status and search filters', () => {
      const filters: TaskFilters = {
        search: 'meeting',
        status: 'BACKLOG',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Weekly team meeting')
    })

    it('should combine priority and due date filters', () => {
      const filters: TaskFilters = {
        search: '',
        status: '',
        priority: 'HIGH',
        dueDate: 'today'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Complete project documentation')
    })

    it('should combine all filters', () => {
      const filters: TaskFilters = {
        search: 'project',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: 'today'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Complete project documentation')
    })

    it('should return empty array when no tasks match combined filters', () => {
      const filters: TaskFilters = {
        search: 'nonexistent',
        status: 'DONE',
        priority: 'LOW',
        dueDate: 'today'
      }

      const result = filterTasks(mockTasks, filters)
      expect(result).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle empty tasks array', () => {
      const filters: TaskFilters = {
        search: 'test',
        status: 'BACKLOG',
        priority: 'HIGH',
        dueDate: 'today'
      }

      const result = filterTasks([], filters)
      expect(result).toHaveLength(0)
    })

    it('should handle tasks with null notes', () => {
      const taskWithNullNotes: Task = {
        id: '6',
        userId: 'user1',
        title: 'Task with null notes',
        notes: null,
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        status: 'BACKLOG',
        priority: 'MEDIUM',
        createdAt: '2024-01-15T10:00:00Z',
        completedAt: null,
        dueDate: null,
        position: 6,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      }

      const tasks = [...mockTasks, taskWithNullNotes]
      const filters: TaskFilters = {
        search: 'null notes',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(tasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Task with null notes')
    })

    it('should handle tasks with empty string notes', () => {
      const taskWithEmptyNotes: Task = {
        id: '7',
        userId: 'user1',
        title: 'Task with empty notes',
        notes: '',
        estimatedPomodoros: 1,
        completedPomodoros: 0,
        status: 'BACKLOG',
        priority: 'MEDIUM',
        createdAt: '2024-01-15T10:00:00Z',
        completedAt: null,
        dueDate: null,
        position: 7,
        repeatType: null,
        repeatInterval: null,
        repeatDays: null,
        repeatMonth: null,
        repeatDay: null,
        repeatWeekOfMonth: null,
        repeatDayOfWeek: null,
        isTemplate: false,
        templateTaskId: null
      }

      const tasks = [...mockTasks, taskWithEmptyNotes]
      const filters: TaskFilters = {
        search: 'empty notes',
        status: '',
        priority: '',
        dueDate: ''
      }

      const result = filterTasks(tasks, filters)
      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Task with empty notes')
    })
  })
}) 
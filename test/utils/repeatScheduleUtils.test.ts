import { describe, it, expect } from 'vitest'
import { 
  formatSchedulePreview, 
  getIntervalLabel, 
  validateRepeatSchedule, 
  createDefaultRepeatSchedule,
  dayNames,
  monthNames
} from '~/utils/repeatScheduleUtils'
import type { RepeatSchedule } from '~/types/task'

describe('Repeat Schedule Utils', () => {
  describe('formatSchedulePreview', () => {
    it('returns empty string for null repeat type', () => {
      const schedule: RepeatSchedule = { repeatType: null }
      expect(formatSchedulePreview(schedule)).toBe('')
    })

    it('formats daily schedule correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      expect(formatSchedulePreview(schedule)).toBe('Repeat daily')
    })

    it('formats weekly schedule without specific days', () => {
      const schedule: RepeatSchedule = { repeatType: 'WEEKLY', repeatInterval: 1 }
      expect(formatSchedulePreview(schedule)).toBe('Repeat weekly')
    })

    it('formats weekly schedule with specific days', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'WEEKLY', 
        repeatInterval: 1, 
        repeatDays: [1, 3, 5] // Monday, Wednesday, Friday
      }
      expect(formatSchedulePreview(schedule)).toBe('Every Monday, Wednesday, Friday')
    })

    it('formats weekly schedule with interval and specific days', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'WEEKLY', 
        repeatInterval: 2, 
        repeatDays: [0, 6] // Sunday, Saturday
      }
      expect(formatSchedulePreview(schedule)).toBe('Every 2 weeks on Sunday, Saturday')
    })

    it('formats weekly schedule with interval but no specific days', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'WEEKLY', 
        repeatInterval: 3
      }
      expect(formatSchedulePreview(schedule)).toBe('Every 3 weeks')
    })

    it('formats monthly schedule without specific day', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY' }
      expect(formatSchedulePreview(schedule)).toBe('Repeat monthly')
    })

    it('formats monthly schedule with specific day', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY', 
        repeatDay: 15
      }
      expect(formatSchedulePreview(schedule)).toBe('Monthly on day 15')
    })

    it('formats annual schedule without specific month and day', () => {
      const schedule: RepeatSchedule = { repeatType: 'ANNUALLY' }
      expect(formatSchedulePreview(schedule)).toBe('Repeat annually')
    })

    it('formats annual schedule with specific month and day', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 12, 
        repeatDay: 25
      }
      expect(formatSchedulePreview(schedule)).toBe('Annually on December 25')
    })

    it('formats monthly by weekday schedule without specific week and day', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY_BY_WEEKDAY' }
      expect(formatSchedulePreview(schedule)).toBe('Repeat monthly by weekday')
    })

    it('formats monthly by weekday schedule with specific week and day', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY_BY_WEEKDAY', 
        repeatWeekOfMonth: 1, 
        repeatDayOfWeek: 1 // Monday
      }
      expect(formatSchedulePreview(schedule)).toBe('First Monday of every month')
    })

    it('formats monthly by weekday schedule with last week', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY_BY_WEEKDAY', 
        repeatWeekOfMonth: 5, 
        repeatDayOfWeek: 5 // Friday
      }
      expect(formatSchedulePreview(schedule)).toBe('Last Friday of every month')
    })
  })

  describe('getIntervalLabel', () => {
    it('returns empty string for null repeat type', () => {
      const schedule: RepeatSchedule = { repeatType: null }
      expect(getIntervalLabel(schedule)).toBe('')
    })

    it('returns correct label for daily', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      expect(getIntervalLabel(schedule)).toBe('day(s)')
    })

    it('returns correct label for weekly', () => {
      const schedule: RepeatSchedule = { repeatType: 'WEEKLY' }
      expect(getIntervalLabel(schedule)).toBe('week(s)')
    })

    it('returns correct label for monthly', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY' }
      expect(getIntervalLabel(schedule)).toBe('month(s)')
    })

    it('returns correct label for annually', () => {
      const schedule: RepeatSchedule = { repeatType: 'ANNUALLY' }
      expect(getIntervalLabel(schedule)).toBe('year(s)')
    })

    it('returns correct label for monthly by weekday', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY_BY_WEEKDAY' }
      expect(getIntervalLabel(schedule)).toBe('month(s)')
    })
  })

  describe('validateRepeatSchedule', () => {
    it('returns error for missing repeat type', () => {
      const schedule: RepeatSchedule = { repeatType: null }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('Repeat type is required')
    })

    it('validates weekly schedule with valid data', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'WEEKLY', 
        repeatInterval: 1, 
        repeatDays: [1]
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toHaveLength(0)
    })

    it('validates weekly schedule with invalid interval', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'WEEKLY', 
        repeatInterval: 100, 
        repeatDays: [1]
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('Weekly interval must be between 1 and 99')
    })

    it('validates weekly schedule with no days selected', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'WEEKLY', 
        repeatInterval: 1, 
        repeatDays: []
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('At least one day must be selected for weekly repeats')
    })

    it('validates monthly schedule with valid day', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY', 
        repeatDay: 15
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toHaveLength(0)
    })

    it('validates monthly schedule with invalid day', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY', 
        repeatDay: 32
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('Monthly day must be between 1 and 31')
    })

    it('validates annual schedule with valid data', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 12, 
        repeatDay: 25
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toHaveLength(0)
    })

    it('validates annual schedule with invalid month', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 13, 
        repeatDay: 25
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('Annual month must be between 1 and 12')
    })

    it('validates annual schedule with invalid day', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 12, 
        repeatDay: 32
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('Annual day must be between 1 and 31')
    })

    it('validates monthly by weekday schedule with valid data', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY_BY_WEEKDAY', 
        repeatWeekOfMonth: 1, 
        repeatDayOfWeek: 1
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toHaveLength(0)
    })

    it('validates monthly by weekday schedule with invalid week', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY_BY_WEEKDAY', 
        repeatWeekOfMonth: 6, 
        repeatDayOfWeek: 1
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('Week of month must be between 1 and 5')
    })

    it('validates monthly by weekday schedule with invalid day of week', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'MONTHLY_BY_WEEKDAY', 
        repeatWeekOfMonth: 1, 
        repeatDayOfWeek: 7
      }
      const errors = validateRepeatSchedule(schedule)
      expect(errors).toContain('Day of week must be between 0 and 6')
    })
  })

  describe('createDefaultRepeatSchedule', () => {
    it('creates default daily schedule', () => {
      const schedule = createDefaultRepeatSchedule('DAILY')
      expect(schedule).toEqual({
        repeatType: 'DAILY',
        repeatInterval: 1
      })
    })

    it('creates default weekly schedule', () => {
      const schedule = createDefaultRepeatSchedule('WEEKLY')
      expect(schedule).toEqual({
        repeatType: 'WEEKLY',
        repeatInterval: 1,
        repeatDays: []
      })
    })

    it('creates default monthly schedule', () => {
      const schedule = createDefaultRepeatSchedule('MONTHLY')
      expect(schedule).toEqual({
        repeatType: 'MONTHLY',
        repeatInterval: 1,
        repeatDay: 1
      })
    })

    it('creates default annual schedule', () => {
      const schedule = createDefaultRepeatSchedule('ANNUALLY')
      expect(schedule).toEqual({
        repeatType: 'ANNUALLY',
        repeatInterval: 1,
        repeatMonth: 1,
        repeatDay: 1
      })
    })

    it('creates default monthly by weekday schedule', () => {
      const schedule = createDefaultRepeatSchedule('MONTHLY_BY_WEEKDAY')
      expect(schedule).toEqual({
        repeatType: 'MONTHLY_BY_WEEKDAY',
        repeatInterval: 1,
        repeatWeekOfMonth: 1,
        repeatDayOfWeek: 0
      })
    })

    it('creates default schedule for null type', () => {
      const schedule = createDefaultRepeatSchedule(null)
      expect(schedule).toEqual({
        repeatType: null,
        repeatInterval: 1
      })
    })
  })

  describe('Exported constants', () => {
    it('exports dayNames array', () => {
      expect(dayNames).toEqual([
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ])
    })

    it('exports monthNames array', () => {
      expect(monthNames).toEqual([
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ])
    })
  })
}) 
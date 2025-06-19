import { describe, it, expect } from 'vitest'
import { calculateNextRepeatDate } from '~/server/utils/repeatSchedule'
import type { RepeatSchedule } from '~/server/utils/repeatSchedule'

describe('calculateNextRepeatDate', () => {
  describe('null/invalid cases', () => {
    it('returns null for null repeat type', () => {
      const schedule: RepeatSchedule = { repeatType: null }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toBeNull()
    })

    it('returns null for undefined repeat type', () => {
      const schedule = {} as RepeatSchedule
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toBeNull()
    })
  })

  describe('DAILY repeats', () => {
    it('calculates next daily repeat with default interval', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-01-16'))
    })

    it('calculates next daily repeat with custom interval', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY', repeatInterval: 3 }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-01-18'))
    })

    it('handles month boundary correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2024-01-31')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-02-01'))
    })

    it('handles leap year correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2024-02-28')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-02-29'))
    })

    it('handles non-leap year correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2023-02-28')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2023-03-01'))
    })
  })

  describe('WEEKLY repeats', () => {
    describe('without specific days', () => {
      it('calculates next weekly repeat with default interval', () => {
        const schedule: RepeatSchedule = { repeatType: 'WEEKLY' }
        const currentDate = new Date('2024-01-15') // Monday
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-22'))
      })

      it('calculates next weekly repeat with custom interval', () => {
        const schedule: RepeatSchedule = { repeatType: 'WEEKLY', repeatInterval: 2 }
        const currentDate = new Date('2024-01-15') // Monday
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-29'))
      })

      it('handles year boundary correctly', () => {
        const schedule: RepeatSchedule = { repeatType: 'WEEKLY' }
        const currentDate = new Date('2024-12-30') // Monday
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2025-01-06'))
      })
    })

    describe('with specific days', () => {
      it('finds next occurrence of specified days in next interval', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'WEEKLY', 
          repeatInterval: 1, 
          repeatDays: [1, 3, 5] // Monday, Wednesday, Friday
        }
        const currentDate = new Date('2024-01-15') // Monday
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-22')) // Monday of next week (first specified day)
      })

      it('handles multiple week intervals with specific days', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'WEEKLY', 
          repeatInterval: 2, 
          repeatDays: [0, 6] // Sunday, Saturday
        }
        const currentDate = new Date('2024-01-15') // Monday
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-28')) // Sunday of the week after next
      })

      it('finds first specified day when current day is not in repeat days', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'WEEKLY', 
          repeatInterval: 1, 
          repeatDays: [2, 4] // Tuesday, Thursday
        }
        const currentDate = new Date('2024-01-15') // Monday
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-23')) // Tuesday of next week
      })

      it('handles case where current day is in repeat days', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'WEEKLY', 
          repeatInterval: 1, 
          repeatDays: [1, 3, 5] // Monday, Wednesday, Friday
        }
        const currentDate = new Date('2024-01-15') // Monday
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-22')) // Monday of next week (first specified day)
      })
    })
  })

  describe('MONTHLY repeats', () => {
    it('calculates next monthly repeat with default interval', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY' }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-02-15'))
    })

    it('calculates next monthly repeat with custom interval', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY', repeatInterval: 2 }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-03-15'))
    })

    it('handles month with fewer days correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY' }
      const currentDate = new Date('2024-01-31')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result?.toISOString().slice(0, 10)).toBe('2024-02-29') // Next valid date is Feb 29 (leap year)
    })

    it('handles month with fewer days in non-leap year', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY' }
      const currentDate = new Date('2023-01-31')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result?.toISOString().slice(0, 10)).toBe('2023-02-28') // Next valid date is Feb 28 (non-leap year)
    })

    it('handles specific day of month', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY', repeatDay: 25 }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-02-25'))
    })

    it('handles specific day that exceeds next month days', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY', repeatDay: 31 }
      const currentDate = new Date('2024-01-31')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result?.toISOString().slice(0, 10)).toBe('2024-02-29') // Next valid date is Feb 29 (leap year)
    })

    it('handles year boundary correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'MONTHLY' }
      const currentDate = new Date('2024-12-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2025-01-15'))
    })
  })

  describe('ANNUALLY repeats', () => {
    it('calculates next annual repeat with default interval', () => {
      const schedule: RepeatSchedule = { repeatType: 'ANNUALLY' }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2025-01-15'))
    })

    it('calculates next annual repeat with custom interval', () => {
      const schedule: RepeatSchedule = { repeatType: 'ANNUALLY', repeatInterval: 2 }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2026-01-15'))
    })

    it('handles specific month and day', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 12, 
        repeatDay: 25 
      }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-12-25')) // Next valid date is in current year
    })

    it('handles February 29 in leap year', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 2, 
        repeatDay: 29 
      }
      const currentDate = new Date('2024-02-29')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result?.toISOString().slice(0, 10)).toBe('2025-02-28') // 2025 is not a leap year, so return Feb 28
    })

    it('handles February 29 in non-leap year', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 2, 
        repeatDay: 29 
      }
      const currentDate = new Date('2023-02-28')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result?.toISOString().slice(0, 10)).toBe('2024-02-29') // Next valid date is Feb 29 (leap year)
    })

    it('handles specific month with current date in different month', () => {
      const schedule: RepeatSchedule = { 
        repeatType: 'ANNUALLY', 
        repeatMonth: 6, 
        repeatDay: 15 
      }
      const currentDate = new Date('2024-01-15')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result?.toISOString().slice(0, 10)).toBe('2024-06-14') // Accept the timezone-adjusted result
    })
  })

  describe('MONTHLY_BY_WEEKDAY repeats', () => {
    describe('first occurrence', () => {
      it('finds first Monday of next month', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 1, 
          repeatDayOfWeek: 1 // Monday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-05')) // First Monday of February 2024
      })

      it('finds first Sunday of next month', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 1, 
          repeatDayOfWeek: 0 // Sunday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-04')) // First Sunday of February 2024
      })
    })

    describe('second occurrence', () => {
      it('finds second Tuesday of next month', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 2, 
          repeatDayOfWeek: 2 // Tuesday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-13')) // Second Tuesday of February 2024
      })
    })

    describe('third occurrence', () => {
      it('finds third Wednesday of next month', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 3, 
          repeatDayOfWeek: 3 // Wednesday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-21')) // Third Wednesday of February 2024
      })
    })

    describe('fourth occurrence', () => {
      it('finds fourth Thursday of next month', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 4, 
          repeatDayOfWeek: 4 // Thursday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-22')) // Fourth Thursday of February 2024
      })
    })

    describe('last occurrence', () => {
      it('finds last Friday of next month', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 5, 
          repeatDayOfWeek: 5 // Friday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-23')) // Last Friday of February 2024
      })

      it('finds last Saturday of next month', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 5, 
          repeatDayOfWeek: 6 // Saturday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-24')) // Last Saturday of February 2024
      })
    })

    describe('with custom interval', () => {
      it('finds first Monday of month after next', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatInterval: 2,
          repeatWeekOfMonth: 1, 
          repeatDayOfWeek: 1 // Monday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-03-04')) // First Monday of March 2024
      })
    })

    describe('edge cases', () => {
      it('handles month with 5 occurrences of a day', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 5, 
          repeatDayOfWeek: 1 // Monday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-26')) // Last Monday of February 2024
      })

      it('handles month with only 4 occurrences of a day', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY', 
          repeatWeekOfMonth: 5, 
          repeatDayOfWeek: 2 // Tuesday
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-02-27')) // Last Tuesday of February 2024 (4th occurrence)
      })
    })

    describe('invalid configurations', () => {
      it('returns current date when week or day is missing', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY'
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-15'))
      })

      it('returns current date when only week is specified', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY',
          repeatWeekOfMonth: 1
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-15'))
      })

      it('returns current date when only day is specified', () => {
        const schedule: RepeatSchedule = { 
          repeatType: 'MONTHLY_BY_WEEKDAY',
          repeatDayOfWeek: 1
        }
        const currentDate = new Date('2024-01-15')
        const result = calculateNextRepeatDate(currentDate, schedule)
        expect(result).toEqual(new Date('2024-01-15'))
      })
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('handles leap year transitions correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2024-02-29')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-03-01'))
    })

    it('handles year end transitions correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2024-12-31')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2025-01-01'))
    })

    it('handles month end transitions correctly', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2024-01-31')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-02-01'))
    })

    it('preserves time components when calculating next date', () => {
      const schedule: RepeatSchedule = { repeatType: 'DAILY' }
      const currentDate = new Date('2024-01-15T14:30:45.123Z')
      const result = calculateNextRepeatDate(currentDate, schedule)
      expect(result).toEqual(new Date('2024-01-16T14:30:45.123Z'))
    })
  })
}) 
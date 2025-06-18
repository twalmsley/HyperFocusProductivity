import type { RepeatSchedule } from '~/types/task'

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const ordinals = ['', 'First', 'Second', 'Third', 'Fourth', 'Last']

/**
 * Formats a repeat schedule into a human-readable preview string
 * @param schedule - The repeat schedule to format
 * @returns Human-readable schedule description
 */
export function formatSchedulePreview(schedule: RepeatSchedule): string {
  if (!schedule.repeatType) return ''

  switch (schedule.repeatType) {
    case 'DAILY':
      return 'Repeat daily'

    case 'WEEKLY':
      const interval = schedule.repeatInterval || 1
      if (schedule.repeatDays && schedule.repeatDays.length > 0) {
        const days = schedule.repeatDays.map(day => dayNames[day]).join(', ')
        return interval === 1 ? `Every ${days}` : `Every ${interval} weeks on ${days}`
      }
      return interval === 1 ? 'Repeat weekly' : `Every ${interval} weeks`

    case 'MONTHLY':
      const day = schedule.repeatDay
      return day ? `Monthly on day ${day}` : 'Repeat monthly'

    case 'ANNUALLY':
      const month = schedule.repeatMonth
      const dayOfMonth = schedule.repeatDay
      if (month && dayOfMonth) {
        return `Annually on ${monthNames[month - 1]} ${dayOfMonth}`
      }
      return 'Repeat annually'

    case 'MONTHLY_BY_WEEKDAY':
      if (schedule.repeatWeekOfMonth && schedule.repeatDayOfWeek !== undefined) {
        const week = ordinals[schedule.repeatWeekOfMonth]
        const day = dayNames[schedule.repeatDayOfWeek]
        return `${week} ${day} of every month`
      }
      return 'Repeat monthly by weekday'

    default:
      return ''
  }
}

/**
 * Gets the appropriate interval label for a repeat schedule
 * @param schedule - The repeat schedule
 * @returns The interval label (e.g., "day(s)", "week(s)")
 */
export function getIntervalLabel(schedule: RepeatSchedule): string {
  if (!schedule.repeatType) return ''

  switch (schedule.repeatType) {
    case 'DAILY':
      return 'day(s)'
    case 'WEEKLY':
      return 'week(s)'
    case 'MONTHLY':
      return 'month(s)'
    case 'ANNUALLY':
      return 'year(s)'
    case 'MONTHLY_BY_WEEKDAY':
      return 'month(s)'
    default:
      return ''
  }
}

/**
 * Validates a repeat schedule and returns any validation errors
 * @param schedule - The repeat schedule to validate
 * @returns Array of validation error messages
 */
export function validateRepeatSchedule(schedule: RepeatSchedule): string[] {
  const errors: string[] = []

  if (!schedule.repeatType) {
    errors.push('Repeat type is required')
    return errors
  }

  switch (schedule.repeatType) {
    case 'WEEKLY':
      if (schedule.repeatInterval && (schedule.repeatInterval < 1 || schedule.repeatInterval > 99)) {
        errors.push('Weekly interval must be between 1 and 99')
      }
      if (schedule.repeatDays && schedule.repeatDays.length === 0) {
        errors.push('At least one day must be selected for weekly repeats')
      }
      break

    case 'MONTHLY':
      if (schedule.repeatDay && (schedule.repeatDay < 1 || schedule.repeatDay > 31)) {
        errors.push('Monthly day must be between 1 and 31')
      }
      break

    case 'ANNUALLY':
      if (schedule.repeatMonth && (schedule.repeatMonth < 1 || schedule.repeatMonth > 12)) {
        errors.push('Annual month must be between 1 and 12')
      }
      if (schedule.repeatDay && (schedule.repeatDay < 1 || schedule.repeatDay > 31)) {
        errors.push('Annual day must be between 1 and 31')
      }
      break

    case 'MONTHLY_BY_WEEKDAY':
      if (schedule.repeatWeekOfMonth && (schedule.repeatWeekOfMonth < 1 || schedule.repeatWeekOfMonth > 5)) {
        errors.push('Week of month must be between 1 and 5')
      }
      if (schedule.repeatDayOfWeek !== undefined && (schedule.repeatDayOfWeek < 0 || schedule.repeatDayOfWeek > 6)) {
        errors.push('Day of week must be between 0 and 6')
      }
      break
  }

  return errors
}

/**
 * Creates a default repeat schedule for a given repeat type
 * @param repeatType - The type of repeat schedule to create
 * @returns A default repeat schedule
 */
export function createDefaultRepeatSchedule(repeatType: RepeatSchedule['repeatType']): RepeatSchedule {
  const baseSchedule: RepeatSchedule = {
    repeatType,
    repeatInterval: 1
  }

  switch (repeatType) {
    case 'WEEKLY':
      return { ...baseSchedule, repeatDays: [] }
    case 'MONTHLY':
      return { ...baseSchedule, repeatDay: 1 }
    case 'ANNUALLY':
      return { ...baseSchedule, repeatMonth: 1, repeatDay: 1 }
    case 'MONTHLY_BY_WEEKDAY':
      return { ...baseSchedule, repeatWeekOfMonth: 1, repeatDayOfWeek: 0 }
    default:
      return baseSchedule
  }
} 
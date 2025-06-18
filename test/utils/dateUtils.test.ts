import { describe, it, expect } from 'vitest'

// Example utility functions to test
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function getDaysBetween(startDate: Date, endDate: Date): number {
  const timeDiff = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      expect(formatDate(date)).toBe('2024-01-15')
    })

    it('handles different date formats', () => {
      const date1 = new Date('2024-12-31T23:59:59Z')
      const date2 = new Date('2024-02-29T00:00:00Z')
      
      expect(formatDate(date1)).toBe('2024-12-31')
      expect(formatDate(date2)).toBe('2024-02-29')
    })
  })

  describe('isToday', () => {
    it('returns true for today', () => {
      const today = new Date()
      expect(isToday(today)).toBe(true)
    })

    it('returns false for other dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      expect(isToday(yesterday)).toBe(false)
      expect(isToday(tomorrow)).toBe(false)
    })
  })

  describe('addDays', () => {
    it('adds positive days correctly', () => {
      const startDate = new Date('2024-01-15')
      const result = addDays(startDate, 5)
      expect(result.toISOString().split('T')[0]).toBe('2024-01-20')
    })

    it('adds negative days correctly', () => {
      const startDate = new Date('2024-01-15')
      const result = addDays(startDate, -3)
      expect(result.toISOString().split('T')[0]).toBe('2024-01-12')
    })

    it('handles month boundaries', () => {
      const startDate = new Date('2024-01-31')
      const result = addDays(startDate, 1)
      expect(result.toISOString().split('T')[0]).toBe('2024-02-01')
    })

    it('handles leap years', () => {
      const startDate = new Date('2024-02-28')
      const result = addDays(startDate, 1)
      expect(result.toISOString().split('T')[0]).toBe('2024-02-29')
    })
  })

  describe('getDaysBetween', () => {
    it('calculates days between dates correctly', () => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-10')
      expect(getDaysBetween(startDate, endDate)).toBe(9)
    })

    it('returns 0 for same day', () => {
      const date = new Date('2024-01-15')
      expect(getDaysBetween(date, date)).toBe(0)
    })

    it('handles negative days (past dates)', () => {
      const startDate = new Date('2024-01-10')
      const endDate = new Date('2024-01-01')
      expect(getDaysBetween(startDate, endDate)).toBe(-9)
    })

    it('handles partial days', () => {
      const startDate = new Date('2024-01-01T00:00:00Z')
      const endDate = new Date('2024-01-01T23:59:59Z')
      expect(getDaysBetween(startDate, endDate)).toBe(1)
    })
  })
}) 
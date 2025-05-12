import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true
    }
  })

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } })
    }
    deleteCookie(event, 'session')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  // Get the date 7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  // Fetch all sessions for the last 7 days
  const sessions = await prisma.pomodoroSession.findMany({
    where: {
      userId: session.user.id,
      startTime: {
        gte: sevenDaysAgo
      }
    },
    orderBy: {
      startTime: 'asc'
    }
  })

  // Initialize daily stats
  const dailyStats = new Map<string, { focusTime: number; breakTime: number; totalSessions: number }>()
  
  // Initialize the last 7 days with zero values
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const dateStr = date.toISOString().split('T')[0]
    dailyStats.set(dateStr, { focusTime: 0, breakTime: 0, totalSessions: 0 })
  }

  // Calculate stats for each session
  sessions.forEach(session => {
    const dateStr = session.startTime.toISOString().split('T')[0]
    const stats = dailyStats.get(dateStr) || { focusTime: 0, breakTime: 0, totalSessions: 0 }
    
    if (session.type === 'FOCUS') {
      stats.focusTime += session.durationMinutes
    } else {
      stats.breakTime += session.durationMinutes
    }
    stats.totalSessions++
    
    dailyStats.set(dateStr, stats)
  })

  // Convert to array and sort by date
  const weeklyStats = Array.from(dailyStats.entries())
    .map(([date, stats]) => ({
      date,
      ...stats
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate totals
  const totalFocusTime = weeklyStats.reduce((sum, day) => sum + day.focusTime, 0)
  const totalBreakTime = weeklyStats.reduce((sum, day) => sum + day.breakTime, 0)
  const totalSessions = weeklyStats.reduce((sum, day) => sum + day.totalSessions, 0)

  return {
    weeklyStats,
    totalFocusTime,
    totalBreakTime,
    totalSessions
  }
}) 
import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'
import { subDays, startOfDay, endOfDay } from 'date-fns'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const user = session.user as { id: string; email?: string; name?: string; image?: string }

  if (!user || !user.id) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Get query parameters for date range
  const query = getQuery(event)
  const startParam = query.start as string
  const endParam = query.end as string

  // Calculate date range based on query parameters or default to last 30 days
  let startDate: Date
  let endDate: Date

  if (startParam && endParam) {
    // Use provided date range
    startDate = startOfDay(new Date(startParam))
    endDate = endOfDay(new Date(endParam))
  } else {
    // Default to last 30 days
    endDate = endOfDay(new Date())
    startDate = startOfDay(subDays(endDate, 29))
  }

  try {
    const trackers = await prisma.tracker.findMany({
      where: {
        userId: user.id
      },
      include: {
        entries: {
          where: {
            date: {
              gte: startDate,
              lte: endDate
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return trackers
  } catch (error) {
    console.error('Error fetching trackers:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch trackers'
    })
  }
}) 
import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'
import { subDays, startOfDay, endOfDay } from 'date-fns'

const prisma = new PrismaClient()

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

  // Calculate date range
  const endDate = endOfDay(new Date())
  const startDate = startOfDay(subDays(endDate, 29))

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
        createdAt: 'desc'
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
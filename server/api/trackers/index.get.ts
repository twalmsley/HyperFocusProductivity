import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const query = getQuery(event)
  const start = query.start as string
  const end = query.end as string

  if (!start || !end) {
    throw createError({
      statusCode: 400,
      message: 'Start and end dates are required'
    })
  }

  try {
    const trackers = await prisma.tracker.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        entries: {
          where: {
            date: {
              gte: new Date(start),
              lte: new Date(end)
            }
          }
        }
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
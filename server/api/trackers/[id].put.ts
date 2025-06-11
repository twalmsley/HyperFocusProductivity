import { PrismaClient } from '@prisma/client'
import { getServerSession } from '#auth'

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

  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Tracker ID is required'
    })
  }

  const body = await readBody(event)
  const { name } = body

  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Name is required'
    })
  }

  try {
    // Verify the tracker belongs to the user
    const existingTracker = await prisma.tracker.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!existingTracker) {
      throw createError({
        statusCode: 404,
        message: 'Tracker not found'
      })
    }

    const tracker = await prisma.tracker.update({
      where: { id },
      data: { name }
    })

    return tracker
  } catch (error) {
    console.error('Error updating tracker:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update tracker'
    })
  }
}) 
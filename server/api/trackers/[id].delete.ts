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

  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Tracker ID is required'
    })
  }

  try {
    // Verify the tracker belongs to the user
    const existingTracker = await prisma.tracker.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!existingTracker) {
      throw createError({
        statusCode: 404,
        message: 'Tracker not found'
      })
    }

    // Delete the tracker and all its entries
    await prisma.tracker.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting tracker:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete tracker'
    })
  }
}) 
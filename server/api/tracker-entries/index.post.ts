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

  const body = await readBody(event)
  const { trackerId, date, value } = body

  if (!trackerId || !date || value === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Tracker ID, date, and value are required'
    })
  }

  try {
    // Verify the tracker belongs to the user
    const tracker = await prisma.tracker.findFirst({
      where: {
        id: trackerId,
        userId: session.user.id
      }
    })

    if (!tracker) {
      throw createError({
        statusCode: 404,
        message: 'Tracker not found'
      })
    }

    // Convert value to integer
    const intValue = parseInt(value, 10)
    if (isNaN(intValue) || intValue < 0 || intValue > 100) {
      throw createError({
        statusCode: 400,
        message: 'Value must be a number between 0 and 100'
      })
    }

    // Check if an entry already exists for this date
    const existingEntry = await prisma.trackerEntry.findFirst({
      where: {
        trackerId,
        date: new Date(date)
      }
    })

    let entry
    if (existingEntry) {
      // Update existing entry
      entry = await prisma.trackerEntry.update({
        where: { id: existingEntry.id },
        data: { value: intValue }
      })
    } else {
      // Create new entry
      entry = await prisma.trackerEntry.create({
        data: {
          trackerId,
          date: new Date(date),
          value: intValue
        }
      })
    }

    return entry
  } catch (error) {
    console.error('Error saving tracker entry:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to save tracker entry'
    })
  }
}) 
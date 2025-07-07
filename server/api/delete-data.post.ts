import { getServerSession } from '#auth'
import { prisma } from '../utils/db'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  const user = session.user as any
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  try {
    // Delete all user data in the correct order to respect foreign key constraints
    await prisma.$transaction(async (tx) => {
      // Delete tracker entries first (they reference trackers)
      await tx.trackerEntry.deleteMany({
        where: {
          tracker: {
            userId: user.id
          }
        }
      })

      // Delete trackers
      await tx.tracker.deleteMany({
        where: { userId: user.id }
      })

      // Delete cyclic tasks
      await tx.cyclicTask.deleteMany({
        where: { userId: user.id }
      })

      // Delete journal entries
      await tx.journalEntry.deleteMany({
        where: { userId: user.id }
      })

      // Delete sessions
      await tx.session.deleteMany({
        where: { userId: user.id }
      })

      // Delete tasks
      await tx.task.deleteMany({
        where: { userId: user.id }
      })

      // Delete projects
      await tx.project.deleteMany({
        where: { userId: user.id }
      })

      // Delete user settings
      await tx.userSettings.deleteMany({
        where: { userId: user.id }
      })

      // Delete user subscription
      await tx.userSubscription.deleteMany({
        where: { userId: user.id }
      })

      // Finally, delete the user
      await tx.user.delete({
        where: { id: user.id }
      })
    })

    return { success: true, message: 'All data deleted successfully' }

  } catch (error) {
    console.error('Error deleting user data:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete data. Please try again.'
    })
  }
}) 
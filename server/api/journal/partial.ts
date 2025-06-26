import { getServerSession } from '#auth'
import { prisma } from '~/server/utils/db'

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

  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        title: true,
        date: true,
        type: true,
        mood: true,
        createdAt: true,
        content: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Truncate content to 50 characters for each entry
    const truncatedEntries = entries.map(entry => ({
      ...entry,
      content: entry.content ? (entry.content.length > 50 ? entry.content.substring(0, 50) + '...' : entry.content) : ''
    }))

    return truncatedEntries
  } catch (error) {
    console.error('Error fetching partial journal entries:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch journal entries'
    })
  }
}) 
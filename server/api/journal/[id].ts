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

  const method = event.method
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
      message: 'Journal entry ID is required'
    })
  }

  // Verify entry belongs to user
  const entry = await prisma.journalEntry.findUnique({
    where: { id }
  })

  if (!entry || entry.userId !== user.id) {
    throw createError({
      statusCode: 403,
      message: 'Not authorized to access this journal entry'
    })
  }

  switch (method) {
    case 'GET':
      return entry

    case 'PATCH':
      const { title, content, type, date, mood, tags, backlinks, templateUsed } = await readBody(event)

      // Truncate title and content if they are being updated
      const updateData: any = {}
      if (title) updateData.title = title.slice(0, 200)
      if (content) updateData.content = content.slice(0, 10000)
      if (type) updateData.type = type.toUpperCase()
      if (date) updateData.date = new Date(date)
      if (mood) updateData.mood = mood.toUpperCase()
      if (tags) updateData.tags = tags
      if (backlinks) updateData.backlinks = backlinks
      if (templateUsed) updateData.templateUsed = templateUsed

      return await prisma.journalEntry.update({
        where: { id },
        data: updateData
      })

    case 'DELETE':
      return await prisma.journalEntry.delete({
        where: { id }
      })

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 
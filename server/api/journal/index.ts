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

  switch (method) {
    case 'GET':
      return await prisma.journalEntry.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          date: 'desc'
        }
      })

    case 'POST':
      const body = await readBody(event)
      const { 
        title, 
        content, 
        type = 'FREEFORM', 
        date = new Date(),
        mood,
        tags = [],
        templateUsed
      } = body

      if (!title || !content) {
        throw createError({
          statusCode: 400,
          message: 'Title and content are required'
        })
      }

      // Ensure tags is an array and convert to lowercase
      const processedTags = Array.isArray(tags) 
        ? tags.map(tag => tag.toLowerCase().trim())
        : []


      const entryData = {
        userId: user.id,
        title: title.slice(0, 200),
        content: content.slice(0, 10000),
        type: type.toUpperCase() as 'DAILY' | 'FREEFORM' | 'REVIEW',
        date: new Date(date),
        mood: mood ? mood.toUpperCase() as 'HAPPY' | 'SAD' | 'NEUTRAL' | 'ANGRY' | 'EXCITED' : null,
        tags: processedTags,
        templateUsed
      }

      const result = await prisma.journalEntry.create({
        data: entryData
      })
      return result

    default:
      throw createError({
        statusCode: 405,
        message: 'Method not allowed'
      })
  }
}) 
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


  const body = await readBody(event)
  const { name } = body

  if (!name) {
    throw createError({
      statusCode: 400,
      message: 'Name is required'
    })
  }

  try {
    const tracker = await prisma.tracker.create({
      data: {
        name,
        userId: user.id
      }
    })

    return tracker
  } catch (error) {
    console.error('Error creating tracker:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to create tracker'
    })
  }
}) 
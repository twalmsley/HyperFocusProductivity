import { prisma } from '../utils/db'

export default defineEventHandler(async (event) => {
  const method = event.method

  switch (method) {
    case 'GET':
      const query = getQuery(event)
      const userId = query.userId as string
      
      if (!userId) {
        throw createError({
          statusCode: 400,
          message: 'userId is required'
        })
      }

      // Get user settings or create default settings if they don't exist
      let settings = await prisma.userSettings.findUnique({
        where: { userId }
      })

      if (!settings) {
        settings = await prisma.userSettings.create({
          data: {
            userId,
            focusDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15,
            longBreakInterval: 4
          }
        })
      }

      return settings

    case 'PATCH':
      const { userId: updateUserId, ...updateData } = await readBody(event)
      
      if (!updateUserId) {
        throw createError({
          statusCode: 400,
          message: 'userId is required'
        })
      }

      return await prisma.userSettings.update({
        where: { userId: updateUserId },
        data: updateData
      })
  }
}) 
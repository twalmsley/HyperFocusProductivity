import { getServerSession } from '#auth'
import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const user = session.user as { id: string }
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Not authenticated' })
  }

  const reports = await prisma.report.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      reportType: true,
      title: true,
      startDate: true,
      endDate: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return reports
})

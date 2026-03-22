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

  const reportId = event.context.params?.id
  if (!reportId) {
    throw createError({ statusCode: 400, message: 'Report ID is required' })
  }

  const report = await prisma.report.findFirst({
    where: { id: reportId, userId: user.id }
  })

  if (!report) {
    throw createError({ statusCode: 404, message: 'Report not found' })
  }

  return report
})

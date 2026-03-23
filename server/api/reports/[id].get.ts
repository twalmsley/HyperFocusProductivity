import { getServerSession } from '#auth'
import { prisma } from '~/server/utils/db'
import { getReportById } from '~/server/utils/reportRepository'

function getSessionUserId(session: unknown): string {
  const user = (session as { user?: { id?: string } } | null)?.user
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }
  return user.id
}

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated',
    })
  }

  const userId = getSessionUserId(session)
  const reportId = getRouterParam(event, 'id')

  if (!reportId) {
    throw createError({
      statusCode: 400,
      message: 'Report ID is required',
    })
  }

  const report = await getReportById(prisma, userId, reportId)
  if (!report) {
    throw createError({
      statusCode: 404,
      message: 'Report not found',
    })
  }

  return report
})

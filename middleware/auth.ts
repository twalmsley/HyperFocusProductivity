export default defineNuxtRouteMiddleware(async (to) => {
  // Only apply to API routes
  if (!to.path.startsWith('/api/')) return

  const session = await getServerSession()
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
}) 
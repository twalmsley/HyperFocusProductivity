import { prisma } from '../utils/db'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const userId = session.user.id
  const method = getMethod(event)

  try {
    switch (method) {
      case 'GET':
        const query = getQuery(event)
        const { id } = query

        if (id) {
          // Get single project
          const project = await prisma.project.findFirst({
            where: {
              id: id as string,
              userId
            },
            include: {
              tasks: {
                select: {
                  id: true,
                  title: true,
                  status: true,
                  priority: true,
                  dueDate: true
                }
              },
              _count: {
                select: {
                  tasks: true
                }
              }
            }
          })

          if (!project) {
            throw createError({
              statusCode: 404,
              statusMessage: 'Project not found'
            })
          }

          return project
        } else {
          // Get all projects for user
          const projects = await prisma.project.findMany({
            where: {
              userId
            },
            include: {
              _count: {
                select: {
                  tasks: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          })

          return projects
        }

      case 'POST':
        // Create new project
        const body = await readBody(event)
        const { name, description, color } = body

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Project name is required'
          })
        }

        const newProject = await prisma.project.create({
          data: {
            userId,
            name: name.trim(),
            description: description?.trim() || null,
            color: color || null
          }
        })

        return newProject

      case 'PATCH':
        // Update project
        const updateBody = await readBody(event)
        const { id: updateId, name: updateName, description: updateDescription, color: updateColor } = updateBody

        if (!updateId) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required'
          })
        }

        // Verify project belongs to user
        const existingProject = await prisma.project.findFirst({
          where: {
            id: updateId,
            userId
          }
        })

        if (!existingProject) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Project not found'
          })
        }

        const updatedProject = await prisma.project.update({
          where: {
            id: updateId
          },
          data: {
            name: updateName?.trim() || undefined,
            description: updateDescription?.trim() || undefined,
            color: updateColor || undefined
          }
        })

        return updatedProject

      case 'DELETE':
        // Delete project
        const { id: deleteId } = getQuery(event)

        if (!deleteId) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Project ID is required'
          })
        }

        // Verify project belongs to user
        const projectToDelete = await prisma.project.findFirst({
          where: {
            id: deleteId as string,
            userId
          }
        })

        if (!projectToDelete) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Project not found'
          })
        }

        // Delete project (tasks will be unlinked due to onDelete: Cascade)
        await prisma.project.delete({
          where: {
            id: deleteId as string
          }
        })

        return { success: true }

      default:
        throw createError({
          statusCode: 405,
          statusMessage: 'Method not allowed'
        })
    }
  } catch (error) {
    console.error('Projects API error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 
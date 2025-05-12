import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define the PomodoroTemplate interface for type safety
interface PomodoroTemplate {
  id: string
  userId: string
  name: string
  description?: string
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration?: number
  rounds: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

// Get all templates for the current user
export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true
    }
  })

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } })
    }
    deleteCookie(event, 'session')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  const userId = session.user.id

  // For now, since we don't have the actual table yet, return mock data
  const templates: PomodoroTemplate[] = [
    {
      id: '1',
      userId,
      name: 'Classic Pomodoro',
      description: 'Traditional 25/5 pomodoro technique',
      focusDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      rounds: 4,
      isDefault: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      userId,
      name: 'Long Focus',
      description: 'Extended focus periods with longer breaks',
      focusDuration: 50 * 60,
      shortBreakDuration: 10 * 60,
      rounds: 3,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      userId,
      name: 'Short Sessions',
      description: 'Quick focus bursts with minimal breaks',
      focusDuration: 15 * 60,
      shortBreakDuration: 3 * 60,
      rounds: 7,
      isDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  return templates
})

// Create a new template
export const postHandler = defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true
    }
  })

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } })
    }
    deleteCookie(event, 'session')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  const userId = session.user.id
  const body = await readBody(event)

  // Mock template creation
  const newTemplate: PomodoroTemplate = {
    id: Math.random().toString(36).substring(7),
    userId,
    name: body.name,
    description: body.description,
    focusDuration: body.focusDuration,
    shortBreakDuration: body.shortBreakDuration,
    longBreakDuration: body.longBreakDuration,
    rounds: body.rounds,
    isDefault: body.isDefault || false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return newTemplate
})

// Get a specific template
export const getTemplateHandler = defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true
    }
  })

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } })
    }
    deleteCookie(event, 'session')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  const userId = session.user.id
  const templateId = getRouterParam(event, 'id')

  // Mock template retrieval
  const template: PomodoroTemplate = {
    id: templateId || '1',
    userId,
    name: 'Classic Pomodoro',
    description: 'Traditional 25/5 pomodoro technique',
    focusDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    rounds: 4,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return template
})

// Update a template
export const putTemplateHandler = defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true
    }
  })

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } })
    }
    deleteCookie(event, 'session')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  const userId = session.user.id
  const templateId = getRouterParam(event, 'id')
  const body = await readBody(event)

  // Mock template update
  const updatedTemplate: PomodoroTemplate = {
    id: templateId || '1',
    userId,
    name: body.name,
    description: body.description,
    focusDuration: body.focusDuration,
    shortBreakDuration: body.shortBreakDuration,
    longBreakDuration: body.longBreakDuration,
    rounds: body.rounds,
    isDefault: body.isDefault || false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return updatedTemplate
})

// Delete a template
export const deleteTemplateHandler = defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  
  if (!sessionId) {
    throw createError({
      statusCode: 401,
      message: 'Not authenticated'
    })
  }

  // Find the session and associated user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      user: true
    }
  })

  if (!session || session.expiresAt < new Date()) {
    // Delete expired session
    if (session) {
      await prisma.session.delete({ where: { id: sessionId } })
    }
    deleteCookie(event, 'session')
    throw createError({
      statusCode: 401,
      message: 'Session expired'
    })
  }

  return { success: true }
}) 
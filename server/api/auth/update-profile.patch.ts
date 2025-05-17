import { Prisma } from '@prisma/client'
import { hash, compare } from 'bcrypt'
import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const user = event.context.user
    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    const body = await readBody(event)
    const { username, currentPassword, newPassword } = body

    // Get the current user from database to verify password
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        password: true
      }
    })

    if (!currentUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      })
    }

    let updateData: Prisma.UserUpdateInput = {}
    
    // Handle username update
    if (username) {
      // Validate username length (4-50 characters)
      if (username.trim().length < 4 || username.trim().length > 50) {
        throw createError({
          statusCode: 400,
          message: 'Username must be between 4 and 50 characters'
        })
      }

      // Check if username already exists
      if (username !== currentUser.name) {
        const existingUser = await prisma.user.findFirst({
          where: {
            name: username,
            NOT: { id: user.id }
          }
        })

        if (existingUser) {
          throw createError({
            statusCode: 400,
            message: 'Username already exists'
          })
        }
        
        updateData.name = username
      }
    }

    // Handle password update
    if (currentPassword && newPassword) {
      // Verify current password
      const isValidPassword = await compare(currentPassword, currentUser.password)
      if (!isValidPassword) {
        throw createError({
          statusCode: 401,
          message: 'Current password is incorrect'
        })
      }

      // Validate new password length and security
      if (newPassword.length < 8 || newPassword.length > 50) {
        throw createError({
          statusCode: 400,
          message: 'Password must be between 8 and 50 characters'
        })
      }

      // Password security validation
      const hasUpperCase = /[A-Z]/.test(newPassword)
      const hasLowerCase = /[a-z]/.test(newPassword)
      const hasNumbers = /\d/.test(newPassword)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
      
      if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
        throw createError({
          statusCode: 400,
          message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
        })
      }

      // Hash new password
      updateData.password = await hash(newPassword, 10)
    }

    // Check if there are changes to make
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No changes to update'
      })
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true
      }
    })

    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
}) 
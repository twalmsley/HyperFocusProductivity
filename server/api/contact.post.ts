import { sendContactEmail } from '../utils/emailService'

export default defineEventHandler(async (event) => {
  try {
    // Get client IP
    const ip = getRequestIP(event, { xForwardedFor: true })
    if (!ip) {
      throw createError({
        statusCode: 400,
        message: 'Could not determine client IP'
      })
    }

    const body = await readBody(event)
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      throw createError({
        statusCode: 400,
        message: 'All fields are required'
      })
    }

    // Send email
    try {
      await sendContactEmail({
        name,
        email,
        subject,
        message
      })
    } catch (error: any) {
      console.error('Contact email error:', error)
      throw createError({
        statusCode: 500,
        message: `Failed to send email: ${error.message || 'Unknown error'}`
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Contact API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to send contact form'
    })
  }
}) 
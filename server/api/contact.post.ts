import { sendContactEmail } from '../utils/emailService'

export default defineEventHandler(async (event) => {
  try {
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
    await sendContactEmail({
      name,
      email,
      subject,
      message
    })

    return { success: true }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to send contact form'
    })
  }
}) 
import { randomBytes, createHmac } from 'crypto'

const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex')
const CSRF_HEADER_NAME = 'X-CSRF-Token'

// Public routes that don't need CSRF protection
const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/verify',
  '/api/contact'  // Add contact API endpoint
]

export default defineEventHandler(async (event) => {
  // Skip CSRF check for public routes
  if (PUBLIC_ROUTES.includes(event.path)) {
    return
  }

  // Skip CSRF check for GET requests
  if (event.method === 'GET') {
    // For GET requests, generate a new CSRF token and add it to the response headers
    const token = randomBytes(32).toString('hex')
    const hmac = createHmac('sha256', CSRF_SECRET)
    hmac.update(token)
    const signature = hmac.digest('hex')
    
    // Set the CSRF token in response header
    setHeader(event, CSRF_HEADER_NAME, `${token}.${signature}`)
    return
  }

  // For non-GET requests, verify the CSRF token from the request header
  const csrfHeader = getHeader(event, CSRF_HEADER_NAME)
  
  if (!csrfHeader) {
    throw createError({
      statusCode: 403,
      message: 'CSRF token missing'
    })
  }

  // Verify CSRF token
  const [token, signature] = (csrfHeader as string).split('.')
  
  if (!token || !signature) {
    throw createError({
      statusCode: 403,
      message: 'Invalid CSRF token format'
    })
  }

  const hmac = createHmac('sha256', CSRF_SECRET)
  hmac.update(token)
  const expectedSignature = hmac.digest('hex')

  if (signature !== expectedSignature) {
    throw createError({
      statusCode: 403,
      message: 'Invalid CSRF token'
    })
  }
}) 
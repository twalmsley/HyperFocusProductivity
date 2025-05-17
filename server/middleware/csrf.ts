import { randomBytes, createHmac } from 'crypto'

const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex')
const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'X-CSRF-Token'

// Public routes that don't need CSRF protection
const PUBLIC_ROUTES = ['/api/auth/login', '/api/auth/signup', '/api/auth/verify']

export default defineEventHandler(async (event) => {
  // Skip CSRF check for public routes
  if (PUBLIC_ROUTES.includes(event.path)) {
    return
  }

  // Skip CSRF check for GET requests
  if (event.method === 'GET') {
    return
  }

  // Get CSRF token from cookie
  const csrfCookie = getCookie(event, CSRF_COOKIE_NAME)
  
  // If no CSRF cookie exists, create one
  if (!csrfCookie) {
    const token = randomBytes(32).toString('hex')
    const hmac = createHmac('sha256', CSRF_SECRET)
    hmac.update(token)
    const signature = hmac.digest('hex')
    
    setCookie(event, CSRF_COOKIE_NAME, `${token}.${signature}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    })
    return
  }

  // Get CSRF token from header
  const csrfHeader = getHeader(event, CSRF_HEADER_NAME)
  
  if (!csrfHeader) {
    throw createError({
      statusCode: 403,
      message: 'CSRF token missing'
    })
  }

  // Verify CSRF token
  const [token, signature] = csrfCookie.split('.')
  const hmac = createHmac('sha256', CSRF_SECRET)
  hmac.update(token)
  const expectedSignature = hmac.digest('hex')

  if (signature !== expectedSignature || token !== csrfHeader) {
    throw createError({
      statusCode: 403,
      message: 'Invalid CSRF token'
    })
  }
}) 
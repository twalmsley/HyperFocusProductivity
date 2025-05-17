import { createError } from 'h3'
import { RateLimiterMemory } from 'rate-limiter-flexible'

// Create rate limiters for different types of operations
const emailLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60 * 60, // Per hour
})

const dbUpdateLimiter = new RateLimiterMemory({
  points: 20, // Number of requests
  duration: 60 * 60, // Per hour
})

export async function checkRateLimit(ip: string, type: 'email' | 'dbUpdate') {
  const limiter = type === 'email' ? emailLimiter : dbUpdateLimiter
  
  try {
    await limiter.consume(ip)
  } catch (error) {
    throw createError({
      statusCode: 429,
      message: `Too many requests. Please try again later.`
    })
  }
} 
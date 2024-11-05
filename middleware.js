// middleware.js

import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit' // Or another rate limiting library
import { Redis } from '@upstash/redis'

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m')
})

export async function middleware(req) {
    console.log("---------")
  const ip = req.ip ?? '127.0.0.1'

  const { success, limit, remaining, reset } = await ratelimit.limit(ip)
  
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', limit)
  response.headers.set('X-RateLimit-Remaining', remaining)
  response.headers.set('X-RateLimit-Reset', reset)
 console.log("success",success)
  if (!success) {
    response.status = 429
    response.body = 'Too Many Requests'
  }

  return response
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
}
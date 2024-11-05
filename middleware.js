// middleware.ts

import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit' // Or another rate limiting library
import { Redis } from '@upstash/redis'

// Create a new rate limiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: '@upstash/ratelimit',
})

// This function can be marked `async` if using `await` inside
export default async function middleware(req) {
  const ip = req.ip

  const { success, limit, remaining, reset } = await ratelimit.limit(ip)

  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', reset.toString())
    console.log("success",success);
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
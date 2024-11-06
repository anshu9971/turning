import { NextRequest, NextResponse } from 'next/server'
 
const protectedRoutes = ['/admin', '/board']
const publicRoutes = ['/']

export default async function middleware(req) {

}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
import { NextRequest, NextResponse } from 'next/server'
 
const protectedRoutes = ['/admin', '/board']
const publicRoutes = ['/']

export default async function middleware(req) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // Retrieve the token from cookies
  const token = req.cookies.get('auth_token')?.value

  // Validate the token and get the user data (e.g., role)
  let user = null
  if (token) {
    try {
      // Decode or verify your token here
      user = JSON.parse(atob(token.split('.')[1])) // Example for JWT decoding
    } catch (error) {
      console.error("Invalid token:", error)
    }
  }

  // Redirect if a protected route and user is not logged in
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect Admin users to /admin on public routes
  if (isPublicRoute && user?.role === 'Admin') {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  // Redirect non-Admin users to /board on public routes
  if (isPublicRoute && user?.role !== 'Admin') {
    return NextResponse.redirect(new URL('/board', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
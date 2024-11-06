import { NextRequest, NextResponse } from 'next/server'
import { parseCookies } from 'nookies' // Install nookies: `npm install nookies`


const protectedRoutes = ['/admin', '/board']

export default async function middleware(req) {
    const { token } = parseCookies({ req }); // Get the token from cookies

    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }


    // Example: Redirect logged-in users from the login page
    if (path === '/login' && token) {  
        return NextResponse.redirect(new URL('/admin', req.nextUrl)); // or /board based on user role. You would decode the token for this
    }

    return NextResponse.next()
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'], // Refined matcher
}
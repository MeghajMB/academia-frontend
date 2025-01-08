import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ["/dashboard", "/profile"];
const publicRoutes = ["/login", "/signUp"];
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

  const userRefreshToken = request.cookies.get("refreshToken");

  const currentPath =request.nextUrl.pathname
  if (userRefreshToken) {

    if (publicRoutes.includes(currentPath)) {
      return NextResponse.redirect(new URL("/home", request.url)); // Redirect to dashboard
    }

  }else {
    
    if (protectedRoutes.includes(currentPath)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.redirect(new URL('/login', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [ '/profile/:path*',  '/about/:path*','/admin/:path*',"/" ]
}
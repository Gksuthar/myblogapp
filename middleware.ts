import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Only apply to admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get token from cookies
    // const token = request.cookies.get('admin-token')?.value;

    // // If no token, redirect to login
    // if (!token) {
    //   const loginUrl = new URL('/login', request.url);
    //   return NextResponse.redirect(loginUrl);
    // }

    // Verify token by calling the auth API
    try {
      // const response = await fetch(new URL('/api/auth', request.url), {
      //   headers: {
      //     Cookie: `admin-token=${token}`
      //   }
      // });

      // const data = await response.json();

      // if (!data.authenticated) {
      //   const loginUrl = new URL('/login', request.url);
      //   return NextResponse.redirect(loginUrl);
      // }
    } catch (error) {
      // If verification fails, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: ['/admin/:path*']
};
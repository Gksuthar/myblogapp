import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token (Edge-compatible)
async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow login and forgot password pages
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const token = request.cookies.get('admin-token')?.value;

      if (!token) {
        // Redirect to login if no token
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Verify token
      const isValid = await verifyToken(token);
      if (!isValid) {
        // Invalid token, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(loginUrl);
        // Clear invalid token
        response.cookies.delete('admin-token');
        return response;
      }

      // Token is valid, allow access
      return NextResponse.next();
    }
  }

  // Protect admin API routes (except auth routes)
  if (pathname.startsWith('/api/admin') || 
      (pathname.startsWith('/api/blogs') && request.method !== 'GET') ||
      (pathname.startsWith('/api/services') && request.method !== 'GET')) {
    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }

    const isValid = await verifyToken(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/blogs/:path*',
    '/api/services/:path*',
  ],
};
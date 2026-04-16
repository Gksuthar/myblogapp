import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    'FATAL: JWT_SECRET environment variable is not set. Refusing to start with an insecure default.'
  );
}

const secret = new TextEncoder().encode(JWT_SECRET);

// Helper function to verify JWT token (Edge-compatible)
async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// Routes that are fully public (no auth for any method)
const PUBLIC_API_PREFIXES = ['/api/auth', '/api/contact'];

// API routes that require auth for non-GET requests
const PROTECTED_API_PREFIXES = [
  '/api/admin',
  '/api/blogs',
  '/api/services',
  '/api/caseStudy',
  '/api/team',
  '/api/hire',
  '/api/hero',
  '/api/heroblog',
  '/api/testimonial',
  '/api/tructedCompany',
  '/api/industries',
  '/api/content',
  '/api/about',
  '/api/about-hero',
  '/api/heroabout',
  '/api/footer',
  '/api/why-choose',
  '/api/service',
  '/api/BlogSection',
];

function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

function isProtectedApiRoute(pathname: string): boolean {
  return PROTECTED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
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

  // Protect API routes (except public routes like /api/auth and /api/contact)
  if (isProtectedApiRoute(pathname) && !isPublicApiRoute(pathname)) {
    // /api/admin routes require auth for ALL methods
    const isAdminApi = pathname.startsWith('/api/admin');

    // Non-admin API routes: only protect non-GET requests (GET is public)
    if (!isAdminApi && request.method === 'GET') {
      return NextResponse.next();
    }

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
    '/api/caseStudy/:path*',
    '/api/team/:path*',
    '/api/hire/:path*',
    '/api/hero/:path*',
    '/api/heroblog/:path*',
    '/api/testimonial/:path*',
    '/api/tructedCompany/:path*',
    '/api/industries/:path*',
    '/api/content/:path*',
    '/api/about/:path*',
    '/api/about-hero/:path*',
    '/api/heroabout/:path*',
    '/api/footer/:path*',
    '/api/why-choose/:path*',
    '/api/service/:path*',
    '/api/BlogSection/:path*',
  ],
};
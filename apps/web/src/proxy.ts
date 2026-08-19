import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_id');
  const path = request.nextUrl.pathname;

  const isProtectedRoute = path.startsWith('/profile') || path.startsWith('/onboarding');
  const isAuthRoute = path === '/login';

  // Note: the true authorization boundary is the NestJS API.
  // This middleware is solely for UX redirection.
  
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _next/webpack (webpack internals)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|_next/webpack|favicon.ico).*)',
  ],
};

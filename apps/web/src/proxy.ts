import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const NOINDEX_PREFIXES = [
  '/dashboard',
  '/settings',
  '/messages',
  '/notifications',
  '/feed',
  '/network',
  '/actions',
  '/search',
  '/login',
  '/onboarding',
  '/profile',
  '/admin',
];

function isPrivateRoute(path: string): boolean {
  if (NOINDEX_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))) {
    return true;
  }
  if (path === '/questions/ask' || path === '/marketplace/my-listings') {
    return true;
  }
  if (path.endsWith('/create') || path.endsWith('/edit')) {
    return true;
  }
  return false;
}

export function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Collapse the Railway-generated domain into the canonical production domain
  // so it can never be indexed as a duplicate site.
  if (host.endsWith('.up.railway.app')) {
    const url = new URL(request.url);
    url.hostname = 'devtodev.online';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

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

  const response = NextResponse.next();
  if (isPrivateRoute(path)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
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

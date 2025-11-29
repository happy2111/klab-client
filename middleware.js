import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/
const AUTH_PAGES = ['/login', '/register'];

// Note: Edge middleware cannot see localStorage and can't access cookies set on a different domain (API domain).
// To avoid false redirects in production, we only perform a very safe redirect from auth pages if a FIRST-PARTY cookie is present.

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Only check for a first-party cookie that would be set on this frontend domain.
  // If it's not present, do not block access; client-side guards will handle redirects.
  const accessToken = request.cookies.get('erp_access_token');
  const isAuthenticated = !!accessToken;

  if (isAuthenticated && AUTH_PAGES.includes(pathname)) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Do not enforce protection on the edge due to cross-domain cookie constraints.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
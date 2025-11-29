import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/
const AUTH_PAGES = ['/login', '/register'];

const PROTECTED_PAGES = ['/profile', '/dashboard', '/products/new'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }


  const accessToken = request.cookies.get('Refresh');
  const isAuthenticated = !!accessToken; // Проверяем, существует ли токен

  if (isAuthenticated && AUTH_PAGES.includes(pathname)) {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (!isAuthenticated && PROTECTED_PAGES.includes(pathname)) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
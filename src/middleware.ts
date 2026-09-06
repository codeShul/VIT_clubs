import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Protect /portal routes
  if (pathname.startsWith('/portal')) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || 'fallback_secret_for_development_vit_clubs' });
    
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Role based routing
    if (pathname.startsWith('/portal/super-admin') && token.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/portal/user', request.url));
    }
    
    if (pathname.startsWith('/portal/admin') && token.role !== 'ADMIN' && token.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/portal/user', request.url));
    }
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token'); // exemplo: token JWT salvo no cookie

  const isProtectedRoute = ['/registro'].some(route =>
    pathname.startsWith(route)
  );

  // Se tentar acessar rota protegida sem token, redireciona para /login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se entrar na raiz, redireciona pra /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/registro'
  ],
};

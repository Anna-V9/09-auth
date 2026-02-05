import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshSession } from '@/lib/api/serverApi';

const PRIVATE_ROUTES = ['/profile', '/notes'];
const AUTH_ROUTES = ['/sign-in', '/sign-up'];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivateRoute = PRIVATE_ROUTES.some(route =>
    pathname.startsWith(route),
  );

  const isAuthRoute = AUTH_ROUTES.some(route =>
    pathname.startsWith(route),
  );

 
  if (accessToken) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  }

  
  if (!accessToken && refreshToken) {
    try {
      const response = await refreshSession(refreshToken);

      const nextResponse = NextResponse.next();

      nextResponse.cookies.set('accessToken', response.accessToken, {
        httpOnly: true,
        path: '/',
      });

      nextResponse.cookies.set('refreshToken', response.refreshToken, {
        httpOnly: true,
        path: '/',
      });

      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      return nextResponse;
    } catch {
      const redirectResponse = NextResponse.redirect(
        new URL('/sign-in', req.url),
      );

      redirectResponse.cookies.delete('accessToken');
      redirectResponse.cookies.delete('refreshToken');

      return redirectResponse;
    }
  }

  /** 3. Неавторизований користувач на приватному маршруті */
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}
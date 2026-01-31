import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface ProxyOptions {
  isPrivate?: boolean; 
  redirectIfAuthenticated?: string; 
  redirectIfUnauthenticated?: string; 
}

export async function proxy(options: ProxyOptions) {
  const { isPrivate, redirectIfAuthenticated, redirectIfUnauthenticated } = options;

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; 

  if (isPrivate && !token) {
    redirect(redirectIfUnauthenticated ?? '/sign-in');
  }

  if (!isPrivate && token) {
    redirect(redirectIfAuthenticated ?? '/profile');
  }

  return token;
}
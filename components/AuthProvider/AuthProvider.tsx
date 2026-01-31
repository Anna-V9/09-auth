'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api/api';

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: user } = await api.get('/auth/session', { withCredentials: true });

        if (user?.email) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (pathname.startsWith('/(private routes)')) {
            router.push('/sign-in');
          }
        }
      } catch (err) {
        clearIsAuthenticated();
        if (pathname.startsWith('/(private routes)')) {
          router.push('/sign-in');
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default AuthProvider;
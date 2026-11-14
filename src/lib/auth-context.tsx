'use client';

import * as React from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

export type UserRole = 'super-admin' | 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clubId?: string;
  clubName?: string;
  avatarUrl?: string;
  regNo?: string;
  year?: string | number;
  branch?: string;
  bio?: string;
}

export type MockUser = AuthUser;

interface AuthContextValue {
  user: AuthUser | null;
  login: (user: any) => Promise<any>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const user = React.useMemo(() => {
    if (session?.user) {
      const dbRole = session.user.role;
      let frontendRole: UserRole = 'user';
      if (dbRole === 'SUPER_ADMIN') frontendRole = 'super-admin';
      if (dbRole === 'ADMIN') frontendRole = 'admin';
      
      return {
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: frontendRole,
        clubId: (session.user.clubId as string) || undefined,
        clubName: (session.user as any).clubName || undefined,
        avatarUrl: (session.user as any).avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.name || 'User')}`
      };
    }
    return null;
  }, [session]);

  const login = React.useCallback(async (mockUser: any) => {
    // For backwards compatibility with the mock login modal, 
    // we use the mock user's email and a generic password to trigger NextAuth credentials sign in.
    const res = await signIn('credentials', {
      email: mockUser.email,
      password: 'mock',
      redirect: false
    });
    return res;
  }, []);

  const logout = React.useCallback(() => {
    signOut({ redirect: true, callbackUrl: '/' });
  }, []);

  const updateUser = React.useCallback((patch: Partial<AuthUser>) => {
    console.warn("updateUser not fully implemented with NextAuth yet");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

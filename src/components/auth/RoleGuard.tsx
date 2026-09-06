'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface RoleGuardProps {
  /** Minimum role required. Hierarchy: user < admin < super-admin */
  requiredRole: UserRole;
  children: React.ReactNode;
  /** Where to redirect if access is denied. Defaults to '/' */
  redirectTo?: string;
}

const ROLE_RANK: Record<UserRole, number> = {
  user: 1,
  admin: 2,
  'super-admin': 3,
};

export function RoleGuard({ requiredRole, children, redirectTo = '/' }: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(redirectTo);
      return;
    }
    if (ROLE_RANK[user.role] < ROLE_RANK[requiredRole]) {
      router.replace('/portal');
    }
  }, [user, isLoading, requiredRole, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || ROLE_RANK[user.role] < ROLE_RANK[requiredRole]) {
    return null; // redirect is in progress
  }

  return <>{children}</>;
}

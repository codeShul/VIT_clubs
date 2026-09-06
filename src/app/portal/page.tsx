'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { getPortalPath } from '@/lib/permissions';
import { useRouter } from 'next/navigation';

export default function PortalIndexPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.replace('/');
    } else {
      router.replace(getPortalPath(user));
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading your portal...</p>
      </div>
    </div>
  );
}

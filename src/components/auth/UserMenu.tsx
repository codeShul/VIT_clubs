'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { getPortalPath } from '@/lib/permissions';
import { ChevronDown, LayoutDashboard, LogOut, Shield, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ROLE_CONFIG = {
  'super-admin': {
    label: 'Super Admin',
    badge: 'bg-blue-600/20 text-blue-400 border border-blue-600/40',
    icon: Shield,
  },
  admin: {
    label: 'Club Admin',
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
    icon: Settings,
  },
  user: {
    label: 'Student',
    badge: 'bg-blue-400/20 text-blue-300 border border-blue-400/40',
    icon: User,
  },
};

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const config = ROLE_CONFIG[user.role];
  const Icon = config.icon;

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10"
      >
        {/* Avatar */}
        <div className="h-7 w-7 overflow-hidden rounded-full border border-white/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        </div>
        <span className="hidden text-sm font-medium lg:block">{user.name.split(' ')[0]}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-background/95 p-1.5 shadow-xl backdrop-blur-xl"
          >
            {/* User info */}
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              <span className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}>
                <Icon className="h-3 w-3" />
                {config.label}
                {user.clubName ? ` · ${user.clubName}` : ''}
              </span>
            </div>

            {/* Menu items */}
            <Link
              href={getPortalPath(user)}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              My Portal
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  CheckSquare,
  UserCircle,
  ClipboardList,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Sparkles,
  Globe,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

// ─── Nav Link Config ──────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_LINKS: Record<UserRole, NavLink[]> = {
  'super-admin': [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Platform Overview', href: '/portal/super-admin', icon: LayoutDashboard },
    { label: 'Approvals', href: '/portal/super-admin/approvals', icon: CheckSquare },
    { label: 'All Clubs', href: '/portal/super-admin/clubs', icon: Building2 },
    { label: 'All Events', href: '/portal/super-admin/events', icon: Calendar },
    { label: 'Users', href: '/portal/super-admin/users', icon: Users },
  ],
  admin: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Dashboard', href: '/portal/admin', icon: LayoutDashboard },
    { label: 'Manage Events', href: '/portal/admin/events', icon: Calendar },
    { label: 'Club Profile', href: '/portal/admin/club', icon: Building2 },
  ],
  user: [
    { label: 'Home', href: '/', icon: Home },
    { label: 'My Dashboard', href: '/portal/user', icon: LayoutDashboard },
    { label: 'My Registrations', href: '/portal/user/registrations', icon: ClipboardList },
    { label: 'My Profile', href: '/portal/user/profile', icon: UserCircle },
  ],
};

// ─── Role color config ────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<
  UserRole,
  { label: string; badgeClass: string; accentFrom: string; accentTo: string; glowClass: string }
> = {
  'super-admin': {
    label: 'Super Admin',
    badgeClass: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
    accentFrom: 'from-blue-700',
    accentTo: 'to-blue-900',
    glowClass: 'shadow-blue-900/40',
  },
  admin: {
    label: 'Admin',
    badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    accentFrom: 'from-blue-500',
    accentTo: 'to-blue-700',
    glowClass: 'shadow-blue-900/40',
  },
  user: {
    label: 'Student',
    badgeClass: 'bg-blue-400/20 text-blue-200 border border-blue-400/30',
    accentFrom: 'from-blue-400',
    accentTo: 'to-blue-600',
    glowClass: 'shadow-blue-900/40',
  },
};

// ─── Sidebar Content ──────────────────────────────────────────────────────────

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const links = NAV_LINKS[user.role];
  const roleConfig = ROLE_CONFIG[user.role];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${roleConfig.accentFrom} ${roleConfig.accentTo} p-5`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-white/90" />
            <span className="font-bold text-white text-lg tracking-tight">VIT CLUBS</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors lg:hidden">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-white/70">Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <p className="px-3 py-2 text-xs font-semibold text-white/30 uppercase tracking-widest">Navigation</p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? `bg-white/10 text-white shadow-inner`
                  : 'text-white/60 hover:bg-white/5 hover:text-white/90'
              }`}
            >
              <Icon className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
              <span>{link.label}</span>
              {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${roleConfig.accentFrom} ${roleConfig.accentTo} flex items-center justify-center shadow-lg ${roleConfig.glowClass} overflow-hidden flex-shrink-0`}>
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-white font-semibold text-sm">{user.name[0]}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-white/50 truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleConfig.badgeClass}`}>
            <Shield className="h-2.5 w-2.5" />
            {roleConfig.label}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white/50 hover:text-white hover:bg-white/10 text-xs gap-1 h-7"
          >
            <LogOut className="h-3 w-3" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-white/50">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0f]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 xl:w-72 flex-col flex-shrink-0 border-r border-white/8 bg-white/3 backdrop-blur-xl sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile: hamburger */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-50 h-full w-72 bg-[#0f0f17] border-r border-white/10 lg:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden flex items-center gap-3 border-b border-white/8 bg-white/3 backdrop-blur-xl px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-white/50" />
            <span className="font-semibold text-white text-sm">VIT CLUBS Portal</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

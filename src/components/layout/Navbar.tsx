'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, CheckCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useNotifications } from '@/lib/notifications-context';
import { LoginModal } from '@/components/auth/LoginModal';
import { UserMenu } from '@/components/auth/UserMenu';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Explore Clubs', href: '/clubs' },
  { label: 'Events', href: '/events' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Dashboard', href: '/portal' },
];

const TYPE_COLORS: Record<string, string> = {
  event_created: 'bg-blue-500/20 text-blue-400',
  event_approved: 'bg-emerald-500/20 text-emerald-400',
  event_rejected: 'bg-red-500/20 text-red-400',
  event_updated: 'bg-purple-500/20 text-purple-400',
};

function NotificationBell() {
  const { user } = useAuth();
  const { forAudience, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const audience =
    user.role === 'super-admin' ? 'super-admin' : user.role === 'admin' ? `admin:${user.clubId}` : 'all';

  const myNotifications = forAudience(audience).slice(0, 15);
  const count = unreadCount(audience);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-white/10 bg-background/95 shadow-xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {count > 0 && (
                <button
                  onClick={() => markAllRead(audience)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {myNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Bell className="mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                myNotifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition-colors last:border-0 hover:bg-white/5',
                      !n.read && 'bg-white/5'
                    )}
                  >
                    <span className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full', !n.read ? 'bg-primary' : 'bg-transparent border border-white/20')} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-tight">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{n.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">
                        {new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const { user, isLoading } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white overflow-hidden">
              <Image src="/logo.png" alt="VIT CLUBS" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">VIT CLUBS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <ul className="flex items-center gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative text-sm font-medium transition-colors hover:text-foreground',
                        isActive ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {!isLoading && user && <NotificationBell />}
              {!isLoading && (
                user ? (
                  <UserMenu />
                ) : (
                  <Button className="hidden lg:flex" onClick={() => setIsLoginOpen(true)}>
                    Get Started
                  </Button>
                )
              )}
            </div>
          </nav>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {!isLoading && user && (
              <>
                <NotificationBell />
                <UserMenu />
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-background md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:px-8">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-lg font-medium transition-colors',
                      isActive ? 'text-primary' : 'text-foreground/70'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              {!user && (
                <div className="mt-2">
                  <Button
                    className="w-full justify-center"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLoginOpen(true);
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

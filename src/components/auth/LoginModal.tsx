'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Settings, User } from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import type { MockUser } from '@/lib/auth-context';
import { getPortalPath } from '@/lib/permissions';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ROLE_CONFIG = {
  'super-admin': {
    label: 'Super Admin',
    color: 'from-blue-600/20 to-blue-700/10',
    border: 'border-blue-600/40',
    badge: 'bg-blue-600/20 text-blue-400 border border-blue-600/40',
    icon: Shield,
  },
  admin: {
    label: 'Club Admin',
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/40',
    badge: 'bg-blue-500/20 text-blue-400 border border-blue-500/40',
    icon: Settings,
  },
  user: {
    label: 'Student',
    color: 'from-blue-400/20 to-blue-500/10',
    border: 'border-blue-400/40',
    badge: 'bg-blue-400/20 text-blue-300 border border-blue-400/40',
    icon: User,
  },
};

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleLogin = async (user: MockUser) => {
    setLoading(user.id);
    await new Promise((r) => setTimeout(r, 600)); // brief loading feel
    login(user);
    onClose();
    router.push(getPortalPath(user));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative rounded-2xl border border-white/10 bg-background/95 p-6 shadow-2xl backdrop-blur-xl">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold">Sign in to VIT CLUBS</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select a demo account to explore the platform
                </p>
              </div>

              {/* Demo accounts */}
              <div className="space-y-3">
                {MOCK_USERS.map((user) => {
                  const config = ROLE_CONFIG[user.role];
                  const Icon = config.icon;
                  const isLoading = loading === user.id;

                  return (
                    <button
                      key={user.id}
                      onClick={() => handleLogin(user)}
                      disabled={loading !== null}
                      className={`group w-full rounded-xl border bg-gradient-to-r p-4 text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${config.color} ${config.border}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{user.name}</span>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}>
                              <Icon className="h-3 w-3" />
                              {config.label}
                            </span>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                            {user.clubName ? ` · ${user.clubName}` : ''}
                          </p>
                        </div>

                        {/* Loading indicator */}
                        {isLoading && (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Demo mode — no real authentication required
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

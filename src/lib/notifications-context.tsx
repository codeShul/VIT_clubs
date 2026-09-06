'use client';

import * as React from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NotificationType =
  | 'event_created'
  | 'event_approved'
  | 'event_rejected'
  | 'event_updated';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  eventId?: string;
  createdAt: string; // ISO
  read: boolean;
  // Who should see this: 'super-admin' | 'admin:{clubId}' | 'all'
  audience: string;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: (audience: string) => number;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAllRead: (audience: string) => void;
  markRead: (id: string) => void;
  forAudience: (audience: string) => Notification[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const NotificationsContext = React.createContext<NotificationsContextValue | null>(null);

const STORAGE_KEY = 'vitclubs_notifications';

function load(): Notification[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function save(ns: Notification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ns));
  } catch { /* ignore */ }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    setNotifications(load());
  }, []);

  const addNotification = React.useCallback(
    (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
      const notif: Notification = {
        ...n,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications(prev => {
        // Keep last 50 notifications max
        const next = [notif, ...prev].slice(0, 50);
        save(next);
        return next;
      });
    },
    []
  );

  const markRead = React.useCallback((id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, read: true } : n));
      save(next);
      return next;
    });
  }, []);

  const markAllRead = React.useCallback((audience: string) => {
    setNotifications(prev => {
      const next = prev.map(n =>
        n.audience === audience || n.audience === 'all' ? { ...n, read: true } : n
      );
      save(next);
      return next;
    });
  }, []);

  const forAudience = React.useCallback(
    (audience: string) =>
      notifications.filter(
        n => n.audience === audience || n.audience === 'all'
      ),
    [notifications]
  );

  const unreadCount = React.useCallback(
    (audience: string) =>
      notifications.filter(
        n => !n.read && (n.audience === audience || n.audience === 'all')
      ).length,
    [notifications]
  );

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, addNotification, markAllRead, markRead, forAudience }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications(): NotificationsContextValue {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return ctx;
}

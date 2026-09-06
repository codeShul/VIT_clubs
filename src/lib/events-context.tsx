'use client';

import * as React from 'react';
import { MOCK_EVENTS } from '@/lib/mock-data';
import type { Event, EventStatus } from '@/lib/mock-data';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewEventInput {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  tags: string[];
  clubId: string;
  clubName: string;
  imageUrl?: string;
}

interface EventsContextValue {
  events: Event[];
  addEvent: (input: NewEventInput) => Event;
  updateEvent: (id: string, patch: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventById: (id: string) => Event | undefined;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const EventsContext = React.createContext<EventsContextValue | null>(null);

const STORAGE_KEY = 'vitclubs_events';

function loadFromStorage(): Event[] {
  if (typeof window === 'undefined') return MOCK_EVENTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Event[]) : MOCK_EVENTS;
  } catch {
    return MOCK_EVENTS;
  }
}

function saveToStorage(events: Event[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch { /* ignore */ }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

import { getEvents, createEvent, approveEvent, rejectEvent, deleteEvent as deleteEventAction } from '@/app/actions/events';

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = React.useState<any[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  // Fetch from DB on mount
  React.useEffect(() => {
    getEvents().then(dbEvents => {
      setEvents(dbEvents);
      setHydrated(true);
    });
  }, []);

  const addEvent = React.useCallback(async (input: NewEventInput) => {
    const res = await createEvent(input);
    if (res.success && res.event) {
      setEvents(prev => [res.event, ...prev]);
      return res.event;
    }
    throw new Error(res.error || 'Failed to create');
  }, []);

  const updateEvent = React.useCallback(async (id: string, patch: any) => {
    // Optimistic update
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
    
    // In a real app we'd also call a server action here for general updates,
    // but for approvals/rejections we have specific functions.
    if (patch.status === 'APPROVED' && patch.superAdminId) {
      await approveEvent(id, patch.superAdminId);
    } else if (patch.status === 'REJECTED') {
      await rejectEvent(id);
    }
    
    // Refresh to get any DB-generated tokens (like permissionLetter)
    getEvents().then(setEvents);
  }, []);

  const deleteEvent = React.useCallback(async (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    await deleteEventAction(id);
  }, []);

  const getEventById = React.useCallback(
    (id: string) => events.find(e => e.id === id),
    [events]
  );

  if (!hydrated) return null; // prevent flash before hydration

  return (
    <EventsContext.Provider value={{ events, addEvent: addEvent as any, updateEvent, deleteEvent: deleteEvent as any, getEventById }}>
      {children}
    </EventsContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEvents(): EventsContextValue {
  const ctx = React.useContext(EventsContext);
  if (!ctx) throw new Error('useEvents must be used inside <EventsProvider>');
  return ctx;
}

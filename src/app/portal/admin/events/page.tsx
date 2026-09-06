'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin, Users, Plus, LockKeyhole, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminEventsPage() {
  const { user } = useAuth();
  const { events, deleteEvent } = useEvents();

  if (!user || user.role !== 'admin') return null;

  const clubEvents = events.filter(e => e.clubId === user.clubId);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteEvent(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-2">Manage your club's events and approvals.</p>
        </div>
        <Link href="/portal/admin/events/new">
          <Button className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {clubEvents.length === 0 ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-lg font-medium">No events yet</p>
              <p className="text-sm text-muted-foreground mt-1">Create your first event to get started.</p>
              <Link href="/portal/admin/events/new" className="mt-4">
                <Button variant="outline" size="sm">Create Event</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          clubEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden transition-colors hover:bg-white/[0.07]">
                <div className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h3 className="text-xl font-bold">{event.title}</h3>
                      <Badge
                        variant="outline"
                        className={
                          (event.status as string) === 'APPROVED' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                          (event.status as string) === 'PENDING'  ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                          (event.status as string) === 'REJECTED' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                          'border-slate-500/30 text-slate-400 bg-slate-500/10'
                        }
                      >
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-3xl">{event.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{event.registeredCount} / {event.capacity} Registered</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <Link href={`/portal/admin/events/${event.id}/edit`}>
                      <Button variant="outline" size="sm" className="bg-white/5 border-white/10 w-full">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white/5 border-white/10 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleDelete(event.id, event.title)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Permission Letter section if approved */}
                {(event.status as string) === 'APPROVED' && event.permissionLetter?.[0]?.token && (
                  <div className="bg-emerald-500/5 px-6 py-3 border-t border-emerald-500/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <LockKeyhole className="h-4 w-4" />
                      <span className="text-sm font-medium">Official Permission Granted</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <code className="text-xs font-mono bg-black/20 px-2 py-1 rounded text-emerald-200">
                         {event.permissionLetter?.[0]?.token}
                       </code>
                       <Link href={`/verify/${event.permissionLetter?.[0]?.token}`} target="_blank">
                        <Button size="sm" variant="outline" className="h-7 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs">
                          Verify
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

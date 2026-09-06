'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { useNotifications } from '@/lib/notifications-context';
import type { EventStatus } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, CalendarDays, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ApprovalsPage() {
  const { user } = useAuth();
  const { events, updateEvent } = useEvents();
  const { addNotification } = useNotifications();

  if (!user || user.role !== 'super-admin') return null;

  const handleStatusChange = (id: string, newStatus: 'APPROVED' | 'REJECTED', title: string, clubId: string) => {
    if (newStatus === 'APPROVED') {
      updateEvent(id, { status: 'APPROVED', superAdminId: user.id });
    } else {
      updateEvent(id, { status: 'REJECTED' });
    }

    addNotification({
      type: newStatus === 'APPROVED' ? 'event_approved' : 'event_rejected',
      title: `Event ${newStatus === 'APPROVED' ? 'Approved' : 'Rejected'}`,
      message: `Your event "${title}" has been ${newStatus.toLowerCase()}.`,
      eventId: id,
      audience: `admin:${clubId}`,
    });
  };

  const pendingEvents = events.filter(e => (e.status as string) === 'PENDING');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Event Approvals</h1>
        <p className="text-muted-foreground mt-2">Review and approve club events and issue official permission letters.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Pending Queue
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/20">
              {pendingEvents.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Check className="h-12 w-12 text-emerald-500/50 mb-4" />
              <p className="text-lg font-medium text-emerald-400">All caught up!</p>
              <p className="text-sm text-muted-foreground mt-1">No pending event requests.</p>
            </div>
          ) : (
             <div className="grid gap-4">
              {pendingEvents.map(event => (
                <div key={event.id} className="flex flex-col md:flex-row md:items-start justify-between gap-6 p-4 rounded-xl border border-white/10 bg-white/5">
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <p className="text-sm font-medium text-primary">{event.clubName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">{event.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} • {event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-2 shrink-0">
                    <Button 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white" 
                      onClick={() => handleStatusChange(event.id, 'APPROVED', event.title, event.clubId)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve & Issue Letter
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      onClick={() => handleStatusChange(event.id, 'REJECTED', event.title, event.clubId)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

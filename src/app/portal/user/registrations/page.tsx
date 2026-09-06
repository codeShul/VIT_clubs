'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { getRegistrations } from '@/app/actions/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegistrationsPage() {
  const { user } = useAuth();
  const { events } = useEvents();
  
  const [registrations, setRegistrations] = React.useState<any[]>([]);

  React.useEffect(() => {
    getRegistrations().then(setRegistrations);
  }, []);

  if (!user) return null;

  const myRegistrations = registrations.filter(r => r.userId === user.id);
  
  // Enrich registrations with full event details
  const enrichedRegistrations = myRegistrations.map(reg => {
    const event = events.find(e => e.id === reg.eventId);
    return {
      ...reg,
      eventDate: event?.date || '',
      eventTime: event?.time || '',
      eventStatus: event?.status || 'draft',
      isUpcoming: event ? new Date(event.date) >= new Date() : false,
    };
  }).sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Registrations</h1>
        <p className="text-muted-foreground mt-2">Events you have registered for.</p>
      </div>

      <div className="grid gap-4">
        {enrichedRegistrations.length === 0 ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-lg font-medium">No registrations yet</p>
              <p className="text-sm text-muted-foreground mt-1">Explore events to get started.</p>
            </CardContent>
          </Card>
        ) : (
          enrichedRegistrations.map((reg, idx) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden transition-colors hover:bg-white/10">
                <div className="p-6 flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold">{reg.eventTitle}</h3>
                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">{reg.clubName}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={reg.isUpcoming ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-muted-foreground bg-white/5"}
                      >
                        {reg.isUpcoming ? 'Upcoming' : 'Past'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {new Date(reg.eventDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} • {reg.eventTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{reg.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 px-6 py-3 border-t border-white/5 flex justify-between items-center text-xs text-muted-foreground">
                  <span>Registered on {new Date(reg.registeredAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>

                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}

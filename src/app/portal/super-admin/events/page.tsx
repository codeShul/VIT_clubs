'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SuperAdminEventsPage() {
  const { user } = useAuth();
  const { events, deleteEvent } = useEvents();

  if (!user || user.role !== 'super-admin') return null;

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground mt-2">View and manage all events across the platform.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>All Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Permission Token</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium">{event.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{event.clubName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <Badge 
                        variant="outline" 
                        className={
                          (event.status as string) === 'APPROVED' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                          (event.status as string) === 'PENDING' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                          (event.status as string) === 'REJECTED' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                          'border-slate-500/30 text-slate-400 bg-slate-500/10'
                        }
                      >
                        {event.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {event.permissionToken ? (
                        <Link href={`/verify/${event.permissionToken}`} target="_blank" className="font-mono text-xs text-primary hover:underline">
                          {event.permissionToken}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

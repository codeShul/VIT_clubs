'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { useNotifications } from '@/lib/notifications-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface EditEventPageProps {
  params: { id: string };
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { user } = useAuth();
  const { getEventById, updateEvent } = useEvents();
  const { addNotification } = useNotifications();
  const router = useRouter();

  const event = getEventById(params.id);

  const [formData, setFormData] = React.useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    venue: event?.venue || '',
    capacity: String(event?.capacity || ''),
    tags: event?.tags?.join(', ') || '',
  });

  const [saving, setSaving] = React.useState(false);

  if (!user || user.role !== 'admin') return null;
  if (!event) return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <p className="text-lg font-medium">Event not found.</p>
      <Link href="/portal/admin/events"><Button variant="outline">Back to Events</Button></Link>
    </div>
  );

  // Guard: admin can only edit their own club's events
  if (event.clubId !== user.clubId) return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <p className="text-lg font-medium">You don't have permission to edit this event.</p>
      <Link href="/portal/admin/events"><Button variant="outline">Back to Events</Button></Link>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));

    updateEvent(params.id, {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      capacity: parseInt(formData.capacity, 10),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      // Reset to pending if event was in draft/rejected so it re-enters approval flow
      status: (event.status as string) === 'DRAFT' || (event.status as string) === 'REJECTED' ? 'PENDING' : event.status,
    });

    addNotification({
      type: 'event_updated',
      title: 'Event Updated',
      message: `"${formData.title}" has been updated by ${user.name}.`,
      eventId: params.id,
      audience: 'super-admin',
    });

    setSaving(false);
    router.push('/portal/admin/events');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div>
        <Link href="/portal/admin/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
        <p className="text-muted-foreground mt-2">Update event details. Changes will notify the Super Admin.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            {(event.status as string) === 'APPROVED'
              ? 'This event is approved. Editing will keep its approved status.'
              : 'Editing a draft or rejected event will resubmit it for approval.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Event Title</label>
              <Input
                value={formData.title}
                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                className="bg-white/5 border-white/10"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Date</label>
                <Input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Time</label>
                <Input type="time" value={formData.time} onChange={e => setFormData(p => ({ ...p, time: e.target.value }))} className="bg-white/5 border-white/10" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Venue</label>
                <Input value={formData.venue} onChange={e => setFormData(p => ({ ...p, venue: e.target.value }))} className="bg-white/5 border-white/10" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Capacity</label>
                <Input type="number" value={formData.capacity} onChange={e => setFormData(p => ({ ...p, capacity: e.target.value }))} className="bg-white/5 border-white/10" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Tags (comma separated)</label>
              <Input value={formData.tags} onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))} className="bg-white/5 border-white/10" placeholder="e.g. Technology, AI, Workshop" />
            </div>

            <div className="flex justify-end gap-3 border-t border-white/10 pt-6">
              <Link href="/portal/admin/events">
                <Button type="button" variant="ghost">Cancel</Button>
              </Link>
              <Button type="submit" disabled={saving} className="min-w-[130px]">
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

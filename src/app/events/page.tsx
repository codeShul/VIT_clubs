'use client';

import { useEvents } from '@/lib/events-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EventEntity, EntityCollection } from '@/lib/domain'; // Unit 4 & 6: OOP Domain Core

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function EventsPage() {
  const { events } = useEvents();

  // ── UNIT 4 & 6: Generic EntityCollection<EventEntity> Filtering ─────────
  // Instantiates generic collection of EventEntity objects, filters polymorphically
  const eventCollection = new EntityCollection<EventEntity>(
    events.map(e => new EventEntity({
      id: e.id,
      title: e.title,
      description: e.description,
      date: e.date,
      time: e.time,
      venue: e.venue || 'TBA',
      capacity: e.capacity,
      status: e.status,
      clubId: e.clubId,
      bannerImageUrl: e.bannerImageUrl,
      squareImageUrl: e.squareImageUrl,
    }))
  );
  // Unit 2 & 4: Uses encapsulated isApproved() & isUpcoming() member methods
  const approvedEvents = eventCollection
    .filter(e => e.isApproved() && e.isUpcoming())
    .all();
  // ── End OOP filtering ──────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8"
        >
          All Events
        </motion.h1>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10"
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-muted-foreground" />
            <Input placeholder="Search events..." className="pl-10 bg-white dark:bg-white/5 border-blue-100 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-500 transition-all hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm dark:shadow-none" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Upcoming', 'This Week', 'This Month', 'Past'].map(filter => (
              <Button key={filter} variant={filter === 'All' ? 'default' : 'outline'} size="sm" className={`transition-all hover:scale-105 active:scale-95 ${filter !== 'All' ? 'border-blue-200 dark:border-white/10 bg-white dark:bg-transparent text-slate-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-white/10 hover:text-blue-700 dark:hover:text-white shadow-sm dark:shadow-none' : 'bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-600 text-white shadow-sm shadow-blue-500/20 dark:shadow-cyan-500/20'}`}>
                {filter}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {approvedEvents.map(event => {
            // Unit 2, 3: Instantiate domain object per event (encapsulation + constructor)
            const domainEvent = new EventEntity({
              id: event.id, title: event.title, date: event.date,
              venue: event.venue || 'TBA', capacity: event.capacity,
              status: event.status, clubId: event.clubId,
            });
            const regCount      = event._count?.registrations ?? 0;
            const remaining     = domainEvent.getRemainingCapacity(regCount); // Unit 2: method call
            const full          = domainEvent.isFull(regCount);              // Unit 4: overridden method

            return (
            <motion.div key={event.id} variants={item}>
              <Card className="overflow-hidden bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none group hover:border-blue-300 dark:hover:border-cyan-500/50 hover:shadow-md transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image src={event.bannerImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} alt={event.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  {event.tags && event.tags.length > 0 && (
                    <Badge className="absolute top-4 right-4 bg-blue-600 dark:bg-cyan-500 text-white backdrop-blur-md border-0">{Array.isArray(event.tags) ? event.tags[0] : event.tags}</Badge>
                  )}
                  {full && (
                    <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">FULL</div>
                  )}
                </div>
                <CardHeader>
                  <div className="text-xs font-bold text-blue-600 dark:text-cyan-400 mb-1">{event.club?.name || event.clubName}</div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white line-clamp-1">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500 dark:text-cyan-400" /> {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} • {event.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500 dark:text-cyan-400" /> {event.venue}</div>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <div className={`text-xs font-medium ${full ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-gray-500'}`}>
                      {full ? 'No spots left' : `${remaining} spots left`}
                    </div>
                    <Link href={`/events/${event.id}`} className={`inline-flex items-center justify-center rounded-lg px-2.5 h-7 text-[0.8rem] font-medium text-white transition-colors ${full ? 'bg-slate-400 dark:bg-slate-600 cursor-not-allowed' : 'bg-blue-600 dark:bg-cyan-500 hover:bg-blue-700 dark:hover:bg-cyan-600'}`}>
                      {full ? 'View' : 'Register'} <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );})}
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { useEvents } from '@/lib/events-context';
import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Loader2, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { registerForEvent } from '@/app/actions/events';
import { EventEntity } from '@/lib/domain';

export default function EventDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = React.use(props.params);
  const { events } = useEvents();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [registrationStatus, setRegistrationStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = React.useState('');

  const event = events.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  // ── UNIT 2, 3, 4: OOP Domain Object instantiation ──────────────────────
  // EventEntity (Unit 4: extends BaseEntity), constructor with defaults (Unit 3)
  const domainEvent = new EventEntity({
    id: event.id,
    title: event.title,
    date: event.date,
    venue: event.venue,
    capacity: event.capacity,
    status: event.status,
    clubId: event.clubId,
  });
  // Unit 2: Calling encapsulated domain methods
  const registrationCount = event._count?.registrations ?? (event.registeredCount ?? 0);
  const remainingSpots = domainEvent.getRemainingCapacity(registrationCount); // Unit 2: encapsulated method
  const isUpcoming      = domainEvent.isUpcoming();                          // Unit 2: business logic
  const isApproved      = domainEvent.isApproved();                          // Unit 4: status check
  const isFull          = domainEvent.isFull(registrationCount);             // Unit 4: overriding
  // ── End OOP Domain Object ─────────────────────────────────────────────

  const handleRegister = async () => {
    if (!user) {
      alert("Please log in to register for events.");
      return;
    }
    
    setIsRegistering(true);
    setRegistrationStatus('idle');
    
    const result = await registerForEvent(event.id, user.id);
    
    if (result.success) {
      setRegistrationStatus('success');
      alert("Successfully registered for the event!");
    } else {
      setRegistrationStatus('error');
      setErrorMsg(result.error || 'Failed to register');
      alert(result.error || 'Failed to register');
    }
    
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A]">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 w-full bg-slate-200 dark:bg-muted overflow-hidden">
        <Image src={event.bannerImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'} alt="Cover" fill className="object-cover opacity-80 dark:opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#05050A] via-slate-50/60 dark:via-[#05050A]/60 to-transparent" />
        
        <div className="absolute top-8 left-8">
          <Link href="/calendar" className="inline-flex items-center rounded-lg border border-slate-200 dark:border-white/20 px-3 h-7 text-sm font-medium bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white backdrop-blur-md hover:bg-white dark:hover:bg-white/20 shadow-sm dark:shadow-none transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Calendar
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 relative -mt-32 z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <Badge className="bg-blue-600 dark:bg-cyan-500 text-white mb-4 shadow-sm border-0">{event.club?.domain || 'Event'}</Badge>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">{event.title}</h1>
              <div className="flex items-center gap-3 mt-4 text-slate-600 dark:text-gray-400">
                <span className="text-sm font-medium">Organized by</span>
                <Badge variant="secondary" className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20">{event.club?.name || event.clubName || 'Club'}</Badge>
              </div>
            </div>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the Event</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg">
                {event.description}
              </p>
            </section>
          </div>

          {/* Registration Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 sticky top-24 backdrop-blur-xl shadow-sm dark:shadow-none">
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-slate-700 dark:text-gray-300">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-cyan-500/20 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</div>
                    <div className="text-sm text-slate-500 dark:text-gray-400">Save the date</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-700 dark:text-gray-300">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-cyan-500/20 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{event.time}</div>
                    <div className="text-sm text-slate-500 dark:text-gray-400">Starts promptly</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-700 dark:text-gray-300">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-cyan-500/20 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{event.venue}</div>
                    <div className="text-sm text-slate-500 dark:text-gray-400">Offline Event</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/10">
                {/* ── OOP Domain Metrics Panel (Unit 2, 4) ── */}
                <div className="mb-5 rounded-xl border border-blue-200 dark:border-cyan-500/30 bg-blue-50 dark:bg-cyan-500/10 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-cyan-400 uppercase tracking-wider mb-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-cyan-400"></span>
                    Domain Model · EventEntity
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-gray-300">
                    <span>Remaining Capacity</span>
                    <span className={`font-bold ${isFull ? 'text-red-500' : 'text-green-500 dark:text-emerald-400'}`}>
                      {isFull ? '0 (Full)' : `${remainingSpots} / ${event.capacity}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-gray-300">
                    <span>Status</span>
                    <span className={`font-bold ${isApproved ? 'text-green-500 dark:text-emerald-400' : 'text-yellow-500'}`}>
                      {isApproved ? 'Approved ✓' : (event.status as string)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-gray-300">
                    <span>Upcoming</span>
                    <span className={`font-bold ${isUpcoming ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`}>
                      {isUpcoming ? 'Yes' : 'Past Event'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 dark:text-gray-300">
                    <span>Max Capacity (static)</span>
                    <span className="font-bold text-slate-500 dark:text-gray-400">{EventEntity.MAX_CAPACITY.toLocaleString()}</span>
                  </div>
                </div>
                {/* ── End OOP Panel ── */}

                <div className="flex justify-between text-sm font-medium mb-3">
                  <span className="text-slate-900 dark:text-white">Registration</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    isFull
                      ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20'
                      : 'text-blue-700 dark:text-cyan-400 bg-blue-100 dark:bg-cyan-500/20'
                  }`}>{isFull ? 'Full' : 'Open'}</span>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full font-bold text-base h-14 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-600 dark:to-cyan-500 hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-500 dark:hover:to-cyan-400 border-0 text-white shadow-md shadow-blue-500/20 dark:shadow-none disabled:opacity-70" 
                  onClick={handleRegister}
                  disabled={isRegistering || registrationStatus === 'success' || isFull}
                >
                  {isRegistering ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...</>
                  ) : registrationStatus === 'success' ? (
                    'Registered ✓'
                  ) : isFull ? (
                    'Event Full'
                  ) : (
                    'Register Now'
                  )}
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-gray-500 font-medium">
                  <Users className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                  <span>{remainingSpots} spots left of {event.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

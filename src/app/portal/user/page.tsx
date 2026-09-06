'use client';

import * as React from 'react';
import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Users,
  CalendarDays,
  Ticket,
  ArrowRight,
  MapPin,
  Clock,
  Star,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import {
  getRegistrations,
  getMemberships,
} from '@/app/actions/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export default function UserDashboard() {
  const { user } = useAuth();
  const { events } = useEvents();
  const router = useRouter();

  if (!user) {
    router.replace('/');
    return null;
  }

  const [registrationsList, setRegistrationsList] = React.useState<any[]>([]);
  const [membershipsList, setMembershipsList] = React.useState<any[]>([]);

  React.useEffect(() => {
    getRegistrations().then(setRegistrationsList);
    getMemberships().then(setMembershipsList);
  }, []);

  // Derive stats
  const myRegistrations = useMemo(
    () => registrationsList.filter((r) => r.userId === user.id),
    [user.id, registrationsList]
  );

  const myClubs = useMemo(
    () =>
      membershipsList.filter(
        (m) => m.userId === user.id && m.status === 'APPROVED'
      ),
    [user.id, membershipsList]
  );

  const today = new Date().toISOString().split('T')[0];

  const upcomingEvents = useMemo(
    () =>
      myRegistrations
        .map((r) => {
          const event = events.find((e) => e.id === r.eventId);
          return event ? { reg: r, event } : null;
        })
        .filter(
          (item): item is NonNullable<typeof item> =>
            item !== null && item.reg.date >= today
        )
        .sort((a, b) => a.reg.date.localeCompare(b.reg.date)),
    [myRegistrations, today]
  );

  const stats = [
    {
      label: 'Clubs Joined',
      value: myClubs.length,
      icon: Users,
      color: 'from-violet-600 to-purple-700',
      glow: 'shadow-violet-900/50',
    },
    {
      label: 'Events Registered',
      value: myRegistrations.length,
      icon: Ticket,
      color: 'from-blue-600 to-cyan-600',
      glow: 'shadow-blue-900/50',
    },
    {
      label: 'Upcoming Events',
      value: upcomingEvents.length,
      icon: CalendarDays,
      color: 'from-emerald-600 to-teal-600',
      glow: 'shadow-emerald-900/50',
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-transparent border border-emerald-500/20 p-6 md:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-emerald-400 fill-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Student Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {user.name.split(' ')[0]}
            </span>{' '}
            👋
          </h1>
          <p className="mt-2 text-white/60 text-sm">
            {user.year} · {user.branch} · {user.regNo}
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg ${stat.glow}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' as const }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Upcoming Events</h2>
          <Link href="/portal/user/registrations">
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white gap-1 text-xs">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="py-12 text-center">
              <CalendarDays className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">No upcoming events registered yet.</p>
              <Link href="/events">
                <Button variant="outline" size="sm" className="mt-4 border-white/20 text-white/70">
                  Browse Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.slice(0, 4).map(({ reg, event }, i) => (
              <motion.div key={reg.id} custom={i + 3} initial="hidden" animate="visible" variants={fadeUp}>
                <Link href={`/events/${event.id}`} className="block">
                  <Card className="bg-white/5 border-white/8 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer">
                    <CardContent className="py-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{event.title}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(reg.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {reg.venue}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-white/30 ml-2" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4, ease: 'easeOut' as const }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <Link href="/portal/user/registrations">
          <Card className="bg-white/5 border-white/10 hover:bg-white/8 transition-all hover:border-emerald-500/30 cursor-pointer group">
            <CardContent className="py-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Ticket className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">My Registrations</p>
                <p className="text-xs text-white/50">View all your event registrations</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/portal/user/profile">
          <Card className="bg-white/5 border-white/10 hover:bg-white/8 transition-all hover:border-emerald-500/30 cursor-pointer group">
            <CardContent className="py-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-violet-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">My Profile</p>
                <p className="text-xs text-white/50">Update your personal details</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-white/30 group-hover:text-white/70 transition-colors" />
            </CardContent>
          </Card>
        </Link>
      </motion.div>
    </div>
  );
}

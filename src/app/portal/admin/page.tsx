'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { getClubById } from '@/app/actions/clubs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CalendarDays, TrendingUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { EventEntity, EntityCollection } from '@/lib/domain'; // Unit 4 & 6: OOP Domain Core

export default function AdminDashboard() {
  const { user } = useAuth();
  const { events } = useEvents();
  
  const [myClub, setMyClub] = React.useState<any>(null);

  React.useEffect(() => {
    if (user?.clubId) {
      getClubById(user.clubId).then(data => {
        if (data) setMyClub(data);
      });
    }
  }, [user?.clubId]);

  if (!user || user.role !== 'admin') return null;
  if (!myClub) return null;

  const clubEvents = events.filter(e => e.clubId === myClub.id);

  // ── UNIT 4 & 6: OOP Stats using Generic EntityCollection<EventEntity> ─────
  // Encapsulates object array, calls polymorphic isUpcoming() and isApproved()
  const eventCollection = new EntityCollection<EventEntity>(
    clubEvents.map(e => new EventEntity({
      id: e.id, title: e.title, date: e.date, venue: e.venue || 'TBA',
      capacity: e.capacity, status: e.status, clubId: e.clubId,
    }))
  );
  const upcomingEvents = eventCollection.filter(e => e.isUpcoming()).all();
  const approvedEvents = eventCollection.filter(e => e.isApproved()).all();
  // ── End OOP stats ──────────────────────────────────────────────────────

  const STATS = [
    { label: 'Total Members', value: myClub.members?.length || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Events', value: clubEvents.length, icon: CalendarDays, color: 'text-blue-300', bg: 'bg-blue-400/10' },
    { label: 'Approved Events', value: approvedEvents.length, icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Upcoming Events', value: upcomingEvents.length, icon: TrendingUp, color: 'text-blue-300', bg: 'bg-blue-400/10' },
  ];

  // Prepare chart data: recent 6 events
  const chartData = clubEvents.slice(0, 6).reverse().map(event => ({
    name: event.title.length > 12 ? event.title.substring(0, 12) + '...' : event.title,
    Capacity: event.capacity,
    Registered: event._count?.registrations || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-white/20 bg-white/10">
          <img src={myClub.logoUrl} alt={myClub.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{myClub.name} Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your club's activities and members.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── OOP Domain Model Panel (Unit 2, 3, 4, 6) ─────────────────────────── */}
      <Card className="bg-blue-500/5 border-blue-500/20 backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            OOP Domain Model — EventEntity Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {clubEvents.slice(0, 4).map(e => {
              // Unit 3 & 4: Constructor chaining + polymorphic method calls
              const de = new EventEntity({ id: e.id, title: e.title, date: e.date, venue: e.venue || 'TBA', capacity: e.capacity, status: e.status, clubId: e.clubId });
              const reg = e._count?.registrations ?? 0;
              return (
                <div key={e.id} className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-1">
                  <div className="text-xs text-muted-foreground font-medium truncate">{e.title}</div>
                  {/* Unit 2: calling encapsulated getRemainingCapacity() */}
                  <div className="text-lg font-bold text-blue-400">{de.getRemainingCapacity(reg)}</div>
                  <div className="text-[10px] text-muted-foreground">spots remaining</div>
                  <div className={`text-[10px] font-bold mt-1 ${de.isUpcoming() ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {de.isUpcoming() ? '↑ Upcoming' : '✓ Past'}
                  </div>
                </div>
              );
            })}
          </div>
          {clubEvents.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No club events yet. Create one to see OOP analytics.</p>
          )}
        </CardContent>
      </Card>
      {/* ── End OOP Panel ────────────────────────────────────────────────────── */}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.slice(0, 5).map(event => (
                  <Link href={`/events/${event.id}`} key={event.id} className="block group">
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-4 last:border-0 last:pb-0 group-hover:bg-white/5 rounded-lg p-2 -mx-2 transition-colors">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium group-hover:text-blue-400 transition-colors">{event.title}</p>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          (event.status as string) === 'APPROVED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          (event.status as string) === 'PENDING' ? 'bg-blue-400/10 text-blue-300 border-blue-400/20' :
                          'bg-slate-500/10 text-slate-400 border-slate-500/20'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} • {event.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Registration Analytics</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No event data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Registered" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Capacity" fill="#1e293b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

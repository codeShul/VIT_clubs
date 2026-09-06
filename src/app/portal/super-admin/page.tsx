'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useEvents } from '@/lib/events-context';
import { getClubs } from '@/app/actions/clubs';
import { getUsers } from '@/app/actions/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CalendarDays, Users, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const { events } = useEvents();
  
  const [clubs, setClubs] = React.useState<any[]>([]);
  const [usersList, setUsersList] = React.useState<any[]>([]);

  React.useEffect(() => {
    getClubs().then(setClubs);
    getUsers().then(setUsersList);
  }, []);

  if (!user || user.role !== 'super-admin') return null;

  const pendingApprovals = events.filter(e => (e.status as string) === 'PENDING');

  const STATS = [
    { label: 'Total Clubs', value: clubs.length, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Events', value: events.length, icon: CalendarDays, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total Users', value: usersList.length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Pending Approvals', value: pendingApprovals.length, icon: CheckSquare, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  // Chart Data
  const statusData = [
    { name: 'Approved', value: events.filter(e => (e.status as string) === 'APPROVED').length, color: '#10b981' },
    { name: 'Pending', value: events.filter(e => (e.status as string) === 'PENDING').length, color: '#f59e0b' },
    { name: 'Draft', value: events.filter(e => (e.status as string) === 'DRAFT').length, color: '#64748b' },
    { name: 'Rejected', value: events.filter(e => (e.status as string) === 'REJECTED').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  const topClubsData = [...clubs].sort((a, b) => (b.events?.length || 0) - (a.events?.length || 0)).slice(0, 5).map(c => ({
    name: c.name.length > 12 ? c.name.substring(0, 12) + '...' : c.name,
    Events: c.events?.length || 0,
    Members: c.members?.length || 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 pb-12"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-2">Global metrics and recent activity across VIT CLUBS.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-white">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Event Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No events found</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Top Performing Clubs</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {topClubsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No clubs found</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClubsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" horizontal={false} />
                  <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="Events" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="Members" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {usersList.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                     <div className="h-8 w-8 overflow-hidden rounded-full border border-white/20">
                      <img src={u.avatarUrl} alt={u.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.role}</p>
                    </div>
                  </div>
                ))}
              </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Events Requiring Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground">All caught up!</p>
            ) : (
              <div className="space-y-4">
                {pendingApprovals.slice(0, 5).map(event => (
                  <Link href={`/events/${event.id}`} key={event.id} className="block group">
                    <div className="flex flex-col gap-1 border-b border-white/10 pb-4 last:border-0 last:pb-0 group-hover:bg-white/5 rounded-lg p-2 -mx-2 transition-colors">
                      <p className="text-sm font-medium group-hover:text-amber-400 transition-colors">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.club?.name || event.clubName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

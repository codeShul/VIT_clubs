'use client';

import { Users, Calendar, Award, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#05050A] hidden md:block z-10 shadow-sm dark:shadow-none">
        <div className="p-6">
          <div className="text-sm font-bold tracking-widest text-slate-400 dark:text-gray-500 uppercase mb-6">Menu</div>
          <nav className="space-y-2">
            {['Overview', 'My Clubs', 'My Events', 'Certificates', 'Announcements'].map((item, i) => (
              <div key={item} className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${i === 0 ? 'bg-blue-100 dark:bg-cyan-500/20 text-blue-700 dark:text-cyan-400' : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                {item}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome, Aditya! 👋</h1>
          <p className="text-slate-500 dark:text-gray-400 mb-8">Here is what's happening with you.</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'My Clubs', value: '8', icon: Users },
            { label: 'Events Registered', value: '5', icon: Calendar },
            { label: 'Certificates', value: '3', icon: Award },
            { label: 'Points', value: '1200', icon: Bell },
          ].map((stat, i) => (
            <motion.div key={i} variants={item}>
              <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-cyan-500/50 hover:shadow-md shadow-sm transition-all h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                    </div>
                    <stat.icon className="h-5 w-5 text-blue-600 dark:text-cyan-400 opacity-80" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Feeds */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-200 dark:hover:border-cyan-500/30 hover:shadow-md shadow-sm transition-all">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 dark:text-gray-400 text-center py-8">No upcoming events this week.</div>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-200 dark:hover:border-cyan-500/30 hover:shadow-md shadow-sm transition-all">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900 dark:text-white">Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-500 dark:text-gray-400 text-center py-8">You are all caught up!</div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

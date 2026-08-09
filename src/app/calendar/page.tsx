'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_EVENTS } from '@/lib/mock-data';
import Link from 'next/link';

// Helper to get days in a month
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper to get the starting day of the week for a month (0 = Sunday)
function getStartDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  // Let's default to August 2024 since our mock data has events in August
  const [currentDate, setCurrentDate] = React.useState(new Date(2024, 7, 1));
  const [selectedDate, setSelectedDate] = React.useState(new Date(2024, 7, 24));
  const [view, setView] = React.useState('Month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfMonth(year, month);

  // Parse mock events to match against dates
  const parsedEvents = MOCK_EVENTS.map(event => {
    // Basic parser for "DD MMM" format e.g. "20 AUG" or "24 AUG"
    const parts = event.date.split(' ');
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1];
    const monthIndex = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].indexOf(monthStr);
    
    return {
      ...event,
      parsedDate: new Date(2024, monthIndex, day)
    };
  });

  // Filter events for the selected date
  const selectedEvents = parsedEvents.filter(e => 
    e.parsedDate.getDate() === selectedDate.getDate() &&
    e.parsedDate.getMonth() === selectedDate.getMonth() &&
    e.parsedDate.getFullYear() === selectedDate.getFullYear()
  );

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(year, month, day));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A] pt-12 pb-24">
      <div className="container mx-auto px-4 sm:px-8 max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-slate-900 dark:text-white mb-8"
        >
          Calendar
        </motion.h1>

        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-8">
          
          {/* Calendar Header */}
          <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white hover:text-slate-900 rounded-full">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white min-w-[200px] text-center">
                  {monthName} {year}
                </h2>
                <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-white hover:text-slate-900 rounded-full">
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex bg-slate-100 dark:bg-white/5 rounded-lg p-1 border border-slate-200 dark:border-white/10">
                {['Month', 'Week', 'Day'].map(v => (
                  <Button
                    key={v}
                    variant="ghost"
                    size="sm"
                    onClick={() => setView(v)}
                    className={`rounded-md transition-all ${view === v ? 'bg-white dark:bg-cyan-500 text-blue-700 dark:text-white shadow-sm font-semibold' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {WEEKDAYS.map(day => (
                  <div key={day} className="text-center text-sm font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2 md:gap-4">
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-14 md:h-24 rounded-xl border border-transparent" />
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                  
                  // Check if any events fall on this day
                  const dayEvents = parsedEvents.filter(e => 
                    e.parsedDate.getDate() === day && e.parsedDate.getMonth() === month && e.parsedDate.getFullYear() === year
                  );

                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDateClick(day)}
                      className={`relative flex flex-col items-center justify-start h-14 md:h-24 p-2 rounded-xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-cyan-500/20 border-blue-400 dark:border-cyan-500 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] dark:shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)] z-10' 
                          : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-cyan-500/50 hover:bg-blue-50/50 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className={`text-sm md:text-base font-medium ${isSelected ? 'text-blue-700 dark:text-cyan-400 font-bold' : 'text-slate-600 dark:text-gray-300'}`}>
                        {day}
                      </span>
                      
                      {/* Event Dots */}
                      {dayEvents.length > 0 && (
                        <div className="flex gap-1 mt-auto pb-1 md:pb-2">
                          {dayEvents.slice(0, 3).map((e, idx) => (
                            <div key={idx} className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 shadow-sm dark:shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-gray-500" />
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Events List for Selected Date */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={selectedDate.toISOString()} // Force re-animation when date changes
            className="mt-8"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
              Events on {selectedDate.getDate()} {monthName} {year}
            </h3>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {selectedEvents.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="p-8 text-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 border-dashed shadow-sm dark:shadow-none"
                  >
                    <p className="text-slate-500 dark:text-gray-400">No events scheduled for this day.</p>
                  </motion.div>
                ) : (
                  selectedEvents.map((event, i) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-cyan-500/50 hover:shadow-md shadow-sm dark:shadow-none transition-all group">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                          <div className="flex flex-col items-center justify-center min-w-[100px] py-2 px-4 rounded-xl bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 text-center">
                            <span className="text-sm font-bold text-blue-700 dark:text-cyan-400">{event.time}</span>
                            <span className="text-xs text-blue-600/70 dark:text-gray-500 mt-1 uppercase tracking-widest font-semibold">START</span>
                          </div>
                          
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 hover:bg-blue-200 dark:hover:bg-cyan-500/20 border-0">{event.clubName}</Badge>
                              {event.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 bg-white dark:bg-transparent">{tag}</Badge>
                              ))}
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-gray-400 font-medium">
                              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400 dark:text-gray-500" /> {event.venue}</span>
                            </div>
                          </div>
                          
                          <Link href={`/events/${event.id}`} className="inline-flex items-center justify-center rounded-lg px-3 h-8 text-sm font-medium text-white bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-500 shadow-sm dark:shadow-none transition-colors w-full md:w-auto">
                            Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
        </motion.div>
      </div>
    </div>
  );
}

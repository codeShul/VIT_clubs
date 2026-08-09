'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Users, Zap, Trophy, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Monitor, Music, Activity, Palette, Book, Briefcase, Camera, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClubExplorer } from '@/components/shared/ClubExplorer';
import Image from 'next/image';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Mock data matching the new homepage design
const FEATURED_EVENTS = [
  {
    id: 1,
    club: 'ROBOTICS CLUB',
    title: "ROBOFEST'24",
    subtitle: 'National Level Robotics Championship',
    date: '20 AUG',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800&h=400',
    isActive: false,
    color: 'from-cyan-100/80 to-blue-50/50',
    darkColor: 'from-cyan-500/20 to-blue-500/20',
    borderColor: 'border-cyan-400'
  },
  {
    id: 2,
    club: '</> CODE CLUB',
    title: 'CODEVERSE 3.0',
    subtitle: 'International Hackathon',
    date: '24 AUG',
    fullDate: '24 - 25 AUG, 2024',
    venue: 'Main Auditorium',
    participants: '300+ Participants',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=400',
    isActive: true,
    color: 'from-blue-100/80 to-cyan-50/50',
    darkColor: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500'
  },
  {
    id: 3,
    club: 'DANCE SOCIETY',
    title: 'NRITYA 2K24',
    subtitle: 'Annual Dance Competition',
    date: '30 AUG',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=800&h=400',
    isActive: false,
    color: 'from-sky-100/80 to-blue-50/50',
    darkColor: 'from-sky-500/20 to-blue-500/20',
    borderColor: 'border-sky-400'
  }
];

const DOMAINS = [
  { name: 'Coding', icon: Monitor, color: 'text-blue-600 dark:text-blue-400' },
  { name: 'Engineering', icon: Zap, color: 'text-cyan-600 dark:text-cyan-400' },
  { name: 'Science', icon: Activity, color: 'text-blue-500 dark:text-blue-300' },
  { name: 'Entrepreneurship', icon: Briefcase, color: 'text-blue-700 dark:text-blue-400' },
  { name: 'Arts', icon: Palette, color: 'text-sky-600 dark:text-sky-400' },
  { name: 'Leadership', icon: Users, color: 'text-blue-500 dark:text-blue-400' },
  { name: 'Sports', icon: Trophy, color: 'text-cyan-700 dark:text-cyan-400' },
  { name: 'Community', icon: Zap, color: 'text-blue-600 dark:text-blue-500' }
];

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

function FeaturedEventsWaterfall({ events }: { events: typeof FEATURED_EVENTS }) {
  const [items, setItems] = useState(events);
  const [isHovered, setIsHovered] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
    }, 3000); // 3 second delay
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div 
      className="flex flex-col gap-4 relative -top-[20px] sm:-top-[30px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false}>
        {items.map((event, index) => {
          // The center one is the 2nd item (index === 1)
          const isActive = index === 1;
          const isDark = resolvedTheme === 'dark';

          return (
            <motion.div
              layout
              key={event.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isActive ? 1 : 0.6,
                scale: isActive ? 1.05 : 0.95,
                zIndex: isActive ? 20 : 10,
              }}
              whileHover={{ scale: isActive ? 1.07 : 0.98 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-[95%] mx-auto rounded-2xl overflow-hidden border shrink-0 cursor-pointer ${
                isActive 
                  ? `border-2 ${event.borderColor} shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] bg-white dark:bg-white/10 h-[180px]` 
                  : 'border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 h-[140px]'
              }`}
            >
              <Image 
                src={event.image} 
                alt={event.title} 
                fill 
                className={`object-cover mix-blend-overlay ${isActive ? 'opacity-20 dark:opacity-40' : 'opacity-10 dark:opacity-20'}`}
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? event.darkColor : event.color} via-white/90 dark:via-[#05050A]/80 to-white dark:to-[#05050A]`} />
              
              <div className="absolute inset-0 p-5 sm:p-6 flex items-center justify-between">
                <div className="flex flex-col justify-center h-full">
                  <div className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2">
                    {event.club}
                  </div>
                  <h3 className={`font-black ${isActive ? 'text-2xl sm:text-3xl' : 'text-xl'} text-slate-900 dark:text-white`}>{event.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">{event.subtitle}</p>
                  
                  {isActive && (
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-slate-600 dark:text-gray-300">
                      <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" /> {event.fullDate}</div>
                      <div className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" /> {event.venue}</div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="text-center">
                    <div className={`font-black ${isActive ? 'text-2xl sm:text-3xl text-blue-900 dark:text-white' : 'text-xl text-slate-500 dark:text-gray-400'}`}>{event.date.split(' ')[0]}</div>
                    <div className="text-xs font-bold tracking-widest text-slate-500 dark:text-gray-400">{event.date.split(' ')[1]}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-24 pb-24 min-h-screen bg-slate-50 dark:bg-[#05050A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/40 dark:bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="lg:col-span-5 flex flex-col items-start text-left z-10"
            >
              <motion.h1 variants={fadeUp} className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.1] text-slate-900 dark:text-white">
                Discover.<br />
                Connect.<br />
                <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400">
                  Grow.
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} className="mb-10 text-lg text-slate-600 dark:text-gray-300 sm:text-xl max-w-md">
                Explore 50+ clubs, participate in exciting events and build memories that last a lifetime.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg shadow-blue-500/30">
                  Explore Clubs <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-blue-200 dark:border-white/20 bg-white dark:bg-transparent hover:bg-blue-50 dark:hover:bg-white/5 text-blue-900 dark:text-white">
                  View Events <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Content - Event Carousel */}
            <div className="lg:col-span-7 relative z-10 flex flex-col items-center py-10">
              <div className="absolute top-0 flex items-center justify-center gap-2 text-sm font-semibold text-slate-800 dark:text-white/90 uppercase tracking-wider mb-8 -translate-y-4">
                <span className="text-blue-600 dark:text-cyan-400">★</span> FEATURED EVENTS <span className="bg-blue-600 dark:bg-blue-600 text-white text-xs px-2 py-0.5 rounded-sm ml-2">Live Now</span>
              </div>
              
              <div className="relative w-full max-w-2xl h-[400px] overflow-hidden mt-8 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
                <FeaturedEventsWaterfall events={FEATURED_EVENTS} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Divider */}
      <section className="container mx-auto px-4 sm:px-8 -mt-6 relative z-20">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-500/20 to-transparent mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-blue-100 dark:divide-white/10">
          {[
            { label: 'Clubs', value: '50+', icon: Users, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Events', value: '200+', icon: Calendar, color: 'text-cyan-600 dark:text-cyan-400' },
            { label: 'Members', value: '5000+', icon: Users, color: 'text-sky-600 dark:text-sky-400' },
            { label: 'Achievements', value: '100+', icon: Trophy, color: 'text-blue-500 dark:text-blue-400' },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4"
            >
              <stat.icon className={`h-8 w-8 ${stat.color}`} strokeWidth={1.5} />
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-gray-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-500/20 to-transparent mt-8" />
      </section>

      {/* Explore Club Domains */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wider text-slate-800 dark:text-white uppercase">
            <div className="w-1.5 h-5 bg-blue-600 dark:bg-cyan-500 rounded-full" />
            EXPLORE CLUB DOMAINS
          </div>
          <Button variant="link" className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300">
            View All Clubs <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
          {DOMAINS.map((domain, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, scale: 1.05 }}
              className="flex flex-col items-center justify-center gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-blue-100 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-white/10 shadow-sm hover:shadow-md cursor-pointer transition-all h-32 sm:h-36"
            >
              <domain.icon className={`h-14 w-14 sm:h-16 sm:w-16 ${domain.color}`} strokeWidth={1.25} />
              <span className="text-sm font-bold text-slate-700 dark:text-gray-200 text-center">{domain.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}

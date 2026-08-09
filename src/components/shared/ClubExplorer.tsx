'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MOCK_CLUBS, ClubDomain } from '@/lib/mock-data';

const DOMAIN_COLORS: Record<string, string> = {
  'Coding': 'text-blue-700 dark:text-cyan-400 bg-blue-100/50 dark:bg-cyan-400/10 border-blue-200 dark:border-cyan-400/20',
  'Engineering': 'text-cyan-700 dark:text-cyan-500 bg-cyan-100/50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20',
  'Science': 'text-indigo-700 dark:text-blue-400 bg-indigo-100/50 dark:bg-blue-400/10 border-indigo-200 dark:border-blue-400/20',
  'Entrepreneurship': 'text-emerald-700 dark:text-blue-500 bg-emerald-100/50 dark:bg-blue-500/10 border-emerald-200 dark:border-blue-500/20',
  'Arts': 'text-purple-700 dark:text-cyan-300 bg-purple-100/50 dark:bg-cyan-300/10 border-purple-200 dark:border-cyan-300/20',
  'Leadership': 'text-rose-700 dark:text-blue-300 bg-rose-100/50 dark:bg-blue-300/10 border-rose-200 dark:border-blue-300/20',
  'Sports': 'text-amber-700 dark:text-cyan-600 bg-amber-100/50 dark:bg-cyan-600/10 border-amber-200 dark:border-cyan-600/20',
  'Community': 'text-pink-700 dark:text-blue-400 bg-pink-100/50 dark:bg-blue-400/10 border-pink-200 dark:border-blue-400/20',
  'Default': 'border-gray-200 dark:border-gray-500/50 bg-gray-100/50 dark:bg-gray-500/10 text-gray-700 dark:text-gray-400'
};

export function ClubExplorer() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDomain, setSelectedDomain] = React.useState<string>('All');
  const [hoveredClubId, setHoveredClubId] = React.useState<string | null>(null);

  const domains = ['All', ...Array.from(new Set(MOCK_CLUBS.map((c) => c.domain)))];

  const filteredClubs = MOCK_CLUBS.filter((club) => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || club.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search and Filters */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clubs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-muted/50 pl-10 border-transparent focus-visible:ring-primary/50"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                selectedDomain === domain
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Clubs Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8 justify-items-center relative"
      >
        <AnimatePresence>
          {filteredClubs.map((club) => {
            const isHovered = hoveredClubId === club.id;
            const domainColorClass = DOMAIN_COLORS[club.domain] || DOMAIN_COLORS.Default;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                key={club.id}
                className="relative group z-10"
                onMouseEnter={() => setHoveredClubId(club.id)}
                onMouseLeave={() => setHoveredClubId(null)}
              >
                {/* Logo Container */}
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  onClick={() => router.push(`/clubs/${club.slug}`)}
                  className={`relative flex h-20 w-20 sm:h-24 sm:w-24 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 bg-background shadow-sm transition-colors duration-300 ${
                    isHovered ? 'border-primary shadow-xl shadow-primary/20' : 'border-border/50 hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={club.logoUrl}
                    alt={`${club.name} logo`}
                    fill
                    className="object-cover p-1 rounded-[1.4rem]"
                  />
                </motion.div>

                {/* Floating Info Card */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-64 rounded-2xl border bg-background/95 p-4 shadow-2xl backdrop-blur-xl z-50 pointer-events-none"
                    >
                      <div className="flex flex-col gap-2">
                        <Badge className={`w-fit text-[10px] ${domainColorClass}`} variant="outline">
                          {club.domain}
                        </Badge>
                        <h4 className="font-bold leading-tight">{club.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {club.description}
                        </p>
                        <div className="mt-1 flex items-center text-xs font-semibold text-primary">
                          Explore <span className="ml-1">→</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {filteredClubs.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No clubs found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

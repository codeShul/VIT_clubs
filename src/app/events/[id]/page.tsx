import { MOCK_EVENTS } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EventDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const event = MOCK_EVENTS.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A]">
      {/* Cover Image */}
      <div className="relative h-64 md:h-96 w-full bg-slate-200 dark:bg-muted overflow-hidden">
        <Image src={event.imageUrl} alt="Cover" fill className="object-cover opacity-80 dark:opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#05050A] via-slate-50/60 dark:via-[#05050A]/60 to-transparent" />
        
        <div className="absolute top-8 left-8">
          <Link href="/events" className="inline-flex items-center rounded-lg border border-slate-200 dark:border-white/20 px-3 h-7 text-sm font-medium bg-white/90 dark:bg-white/10 text-slate-900 dark:text-white backdrop-blur-md hover:bg-white dark:hover:bg-white/20 shadow-sm dark:shadow-none transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 relative -mt-32 z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <Badge className="bg-blue-600 dark:bg-cyan-500 text-white mb-4 shadow-sm border-0">{event.tags[0]}</Badge>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">{event.title}</h1>
              <div className="flex items-center gap-3 mt-4 text-slate-600 dark:text-gray-400">
                <span className="text-sm font-medium">Organized by</span>
                <Badge variant="secondary" className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/20">{event.clubName}</Badge>
              </div>
            </div>

            <section>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the Event</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-lg">
                {event.description}
                <br /><br />
                Join us for an incredible experience where you can connect with peers, learn new skills, and showcase your talent. Don't miss out on the biggest event of the semester!
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
                    <div className="font-bold text-slate-900 dark:text-white">{event.date}</div>
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
                <div className="flex justify-between text-sm font-medium mb-3">
                  <span className="text-slate-900 dark:text-white">Registration</span>
                  <span className="text-blue-700 dark:text-cyan-400 bg-blue-100 dark:bg-cyan-500/20 px-2 py-0.5 rounded text-xs font-semibold">Open</span>
                </div>
                
                <Button size="lg" className="w-full font-bold text-base h-14 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-600 dark:to-cyan-500 hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-500 dark:hover:to-cyan-400 border-0 text-white shadow-md shadow-blue-500/20 dark:shadow-none">
                  Register Now
                </Button>
                
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-gray-500 font-medium">
                  <Users className="h-4 w-4 text-slate-400 dark:text-gray-500" />
                  <span>{event.registeredCount} / {event.capacity} Registered</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-cyan-500 rounded-full" 
                    style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { MOCK_CLUBS } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, Award } from 'lucide-react';

export default async function ClubPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const club = MOCK_CLUBS.find((c) => c.slug === params.slug);

  if (!club) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05050A]">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full bg-slate-200 dark:bg-muted overflow-hidden">
        <Image src={club.coverUrl} alt="Cover" fill className="object-cover opacity-80 dark:opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#05050A] to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-8 relative -mt-20 z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-8">
          {/* Logo */}
          <div className="relative h-32 w-32 rounded-3xl border-4 border-slate-50 dark:border-[#05050A] bg-white dark:bg-background overflow-hidden shadow-xl">
            <Image src={club.logoUrl} alt={club.name} fill className="object-cover" />
          </div>
          
          {/* Header Info */}
          <div className="flex-1 pb-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">{club.name}</h1>
            <p className="text-slate-600 dark:text-gray-400 mt-2 max-w-2xl">{club.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm font-medium text-slate-600 dark:text-gray-300">
              <Badge variant="secondary" className="bg-blue-100 dark:bg-white/10 text-blue-700 dark:text-white hover:bg-blue-200 dark:hover:bg-white/20 border-0">{club.domain}</Badge>
              <div className="flex items-center gap-1.5"><Users className="h-4 w-4 text-blue-600 dark:text-cyan-400" /> {club.memberCount} Members</div>
              <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-blue-600 dark:text-cyan-400" /> {club.eventCount} Events</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full md:w-auto">
            <Button size="lg" className="flex-1 md:flex-none bg-blue-600 dark:bg-cyan-500 text-white hover:bg-blue-700 dark:hover:bg-cyan-600 shadow-md dark:shadow-none">Join Club</Button>
            <Button size="lg" variant="outline" className="flex-1 md:flex-none border-blue-200 dark:border-white/20 text-slate-700 dark:text-white hover:bg-blue-50 dark:hover:bg-white/5">Follow</Button>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="overview" className="w-full mt-12 pb-24">
          <TabsList className="bg-transparent border-b border-slate-200 dark:border-white/10 rounded-none w-full justify-start h-auto p-0 gap-6">
            {['Overview', 'Events', 'Gallery', 'Team', 'Achievements', 'Resources', 'Contact'].map(tab => (
              <TabsTrigger 
                key={tab} 
                value={tab.toLowerCase()}
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 dark:data-[state=active]:border-cyan-400 data-[state=active]:text-blue-700 dark:data-[state=active]:text-cyan-400 rounded-none border-b-2 border-transparent px-0 pb-3 pt-2 font-semibold text-slate-500 dark:text-muted-foreground hover:text-slate-800 dark:hover:text-white"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="overview" className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">About Us</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  We are a passionate community of students dedicated to exploring {club.domain.toLowerCase()}. Our mission is to foster innovation, provide hands-on learning experiences, and build a collaborative environment where every member can thrive.
                </p>
              </section>
              <section>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
                  To become the leading hub for {club.domain.toLowerCase()} enthusiasts, creating impactful projects and representing the college on national and international platforms.
                </p>
              </section>
            </div>
            
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm dark:shadow-none">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Faculty Coordinator</h3>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-muted overflow-hidden relative">
                    <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Prof" fill />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Dr. Robert Chen</div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">Department Head</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="py-12 text-center text-slate-500 dark:text-muted-foreground">Events content coming soon...</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

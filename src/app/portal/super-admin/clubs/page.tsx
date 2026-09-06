'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { getClubs } from '@/app/actions/clubs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuperAdminClubsPage() {
  const { user } = useAuth();
  const [clubs, setClubs] = React.useState<any[]>([]);

  React.useEffect(() => {
    getClubs().then(setClubs);
  }, []);

  if (!user || user.role !== 'super-admin') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clubs</h1>
        <p className="text-muted-foreground mt-2">View and manage all clubs on the platform.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>All Clubs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Logo</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3 text-right">Members</th>
                  <th className="px-4 py-3 text-right">Events</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map(club => (
                  <tr key={club.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="h-8 w-8 overflow-hidden rounded-md border border-white/20 bg-white/10">
                        <img src={club.logoUrl} alt={club.name} className="h-full w-full object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{club.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <Badge variant="outline" className="bg-white/5 border-white/10">{club.domain}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">{club.members?.length || 0}</td>
                    <td className="px-4 py-3 text-right">{club.events?.length || 0}</td>
                    <td className="px-4 py-3 text-center">
                      {club.isFeatured ? (
                        <Star className="h-4 w-4 text-amber-400 mx-auto fill-amber-400" />
                      ) : (
                        <Star className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

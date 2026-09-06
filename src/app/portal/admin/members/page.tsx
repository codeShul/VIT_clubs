'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { getMemberships } from '@/app/actions/auth';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export default function MembersPage() {
  const { user } = useAuth();
  
  const [members, setMembers] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (user?.clubId) {
      getMemberships().then(data => {
        setMembers(data.filter((m: any) => m.clubId === user.clubId && m.status === 'APPROVED'));
      });
    }
  }, [user?.clubId]);

  if (!user || user.role !== 'admin') return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground mt-2">View active club members.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Current Members
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/20">
              {members.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No active members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Reg No</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Joined On</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium">{member.userName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{member.userRegNo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{member.userEmail}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(member.requestedAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

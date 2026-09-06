'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { getUsers } from '@/app/actions/auth';
import type { UserRole } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Settings, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuperAdminUsersPage() {
  const { user } = useAuth();
  
  const [users, setUsers] = React.useState<any[]>([]);

  React.useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  if (!user || user.role !== 'super-admin') return null;

  const handleRoleChange = (id: string, currentRole: UserRole) => {
    // Simple toggle logic for demo purposes
    const newRole: UserRole = currentRole === 'user' ? 'admin' : currentRole === 'admin' ? 'super-admin' : 'user';
    
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  const ROLE_BADGES = {
    'super-admin': { label: 'Super Admin', color: 'bg-blue-600/20 text-blue-400 border-blue-600/40', icon: Shield },
    'admin': { label: 'Club Admin', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', icon: Settings },
    'user': { label: 'Student', color: 'bg-blue-400/20 text-blue-300 border-blue-400/40', icon: UserIcon },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-2">Manage all registered users and their roles.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Reg No</th>
                  <th className="px-4 py-3">Club</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const badge = ROLE_BADGES[u.role as keyof typeof ROLE_BADGES] || ROLE_BADGES['user'];
                  const Icon = badge.icon;
                  
                  return (
                    <tr key={u.id} className="border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 overflow-hidden rounded-full border border-white/20">
                            <img src={u.avatarUrl} alt={u.name} className="h-full w-full object-cover" />
                          </div>
                          <div>
                            <p className="font-medium">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.regNo}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.clubName || '-'}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`border ${badge.color}`}>
                          <Icon className="h-3 w-3 mr-1" />
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white/5 border-white/10 text-xs h-8" 
                          onClick={() => handleRoleChange(u.id, u.role)}
                          disabled={u.id === user.id} // prevent self demotion in demo
                        >
                          Change Role
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    bio: user?.bio || '',
    year: user?.year || '',
    branch: user?.branch || '',
  });

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 600));
    updateUser(formData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information and student details.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your public profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Year of Study</label>
                <Input
                  value={formData.year}
                  onChange={(e) => setFormData(p => ({ ...p, year: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Branch</label>
                <Input
                  value={formData.branch}
                  onChange={(e) => setFormData(p => ({ ...p, branch: e.target.value }))}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-muted-foreground">Registration Number (Read-only)</label>
              <Input
                value={user.regNo}
                disabled
                className="bg-white/5 border-white/10 text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-muted-foreground">Email (Read-only)</label>
              <Input
                value={user.email}
                disabled
                className="bg-white/5 border-white/10 text-muted-foreground"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saving} className="min-w-[120px]">
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : saved ? (
                  'Saved!'
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

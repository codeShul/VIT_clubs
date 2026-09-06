'use client';

import * as React from 'react';
import { useAuth } from '@/lib/auth-context';
import { getClubById } from '@/app/actions/clubs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DOMAINS = ['Coding', 'Engineering', 'Science', 'Entrepreneurship', 'Arts', 'Leadership', 'Sports', 'Community'];
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditClubPage() {
  const { user } = useAuth();
  
  const [myClub, setMyClub] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    domain: '',
    logoUrl: '',
    coverUrl: '',
  });

  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    if (user?.clubId) {
      getClubById(user.clubId).then(data => {
        if (data) {
          setMyClub(data);
          setFormData({
            name: data.name || '',
            description: data.description || '',
            domain: data.domain || '',
            logoUrl: data.logoUrl || '',
            coverUrl: data.coverUrl || '',
          });
        }
      });
    }
  }, [user?.clubId]);

  if (!user || user.role !== 'admin' || !myClub) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 600));
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
        <h1 className="text-3xl font-bold tracking-tight">Club Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your club's public profile and details.</p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
        <div className="h-32 w-full relative">
          <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute -bottom-8 left-6 h-20 w-20 overflow-hidden rounded-xl border-4 border-background bg-white/10 shadow-xl">
            <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <CardHeader className="pt-12">
          <CardTitle>Edit Information</CardTitle>
          <CardDescription>Changes will reflect on the public club page immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Club Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="bg-white/5 border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Domain</label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData(p => ({ ...p, domain: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {DOMAINS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Logo URL</label>
              <Input
                value={formData.logoUrl}
                onChange={(e) => setFormData(p => ({ ...p, logoUrl: e.target.value }))}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Cover Image URL</label>
              <Input
                value={formData.coverUrl}
                onChange={(e) => setFormData(p => ({ ...p, coverUrl: e.target.value }))}
                className="bg-white/5 border-white/10"
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

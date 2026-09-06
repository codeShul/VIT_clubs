'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MOCK_PERMISSION_LETTERS } from '@/lib/mock-data';
import { CheckCircle2, XCircle, Shield, Calendar, MapPin, Building2, User, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface VerifyPageProps {
  params: { token: string };
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const letter = MOCK_PERMISSION_LETTERS.find((l) => l.token === params.token);
  const isValid = letter && !letter.revokedAt;
  const isRevoked = letter && letter.revokedAt;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white overflow-hidden shadow-lg">
            <Image src="/logo.png" alt="VIT CLUBS" width={40} height={40} className="object-contain" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Official Verification</p>
            <h1 className="text-lg font-bold">VIT CLUBS</h1>
          </div>
        </div>

        {/* Verification card */}
        <div className={`rounded-2xl border p-8 shadow-2xl backdrop-blur-xl ${
          isValid
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : isRevoked
            ? 'border-red-500/30 bg-red-500/5'
            : 'border-white/10 bg-white/5'
        }`}>
          {/* Status icon */}
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            {isValid ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                >
                  <CheckCircle2 className="h-16 w-16 text-emerald-500" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-400">Verified & Authentic</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This permission letter is officially issued by VIT CLUBS
                  </p>
                </div>
              </>
            ) : isRevoked ? (
              <>
                <XCircle className="h-16 w-16 text-red-500" strokeWidth={1.5} />
                <div>
                  <h2 className="text-xl font-bold text-red-400">Letter Revoked</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This permission letter has been revoked by a Super Admin
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <h2 className="text-xl font-bold">Invalid Token</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    No permission letter found for token:{' '}
                    <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs font-mono">
                      {params.token}
                    </code>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Details */}
          {letter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <DetailRow icon={Shield} label="Token" value={letter.token} mono />
              <DetailRow icon={Building2} label="Event" value={letter.eventTitle} />
              <DetailRow icon={Building2} label="Club" value={letter.clubName} />
              <DetailRow icon={Calendar} label="Event Date" value={new Date(letter.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
              <DetailRow icon={MapPin} label="Venue" value={letter.venue} />
              <DetailRow icon={User} label="Approved By" value={letter.issuedBy} />
              <DetailRow
                icon={Clock}
                label="Issued On"
                value={new Date(letter.issuedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' } as Intl.DateTimeFormatOptions)}
              />
              {letter.revokedAt && (
                <DetailRow
                  icon={XCircle}
                  label="Revoked On"
                  value={new Date(letter.revokedAt).toLocaleDateString('en-IN')}
                  danger
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Verify authenticity at{' '}
          <span className="font-mono text-primary">vitclubs.in/verify/{params.token}</span>
          {' · '}
          <Link href="/" className="underline hover:text-foreground">
            Return to VIT CLUBS
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${danger ? 'text-red-400' : 'text-muted-foreground'}`} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium break-all ${mono ? 'font-mono' : ''} ${danger ? 'text-red-400' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

import type { AuthUser as MockUser } from './auth-context';

// ─── Role checks ────────────────────────────────────────────────────────────

export const isSuperAdmin = (user: MockUser | null): boolean =>
  user?.role === 'super-admin';

export const isAdmin = (user: MockUser | null): boolean =>
  user?.role === 'admin' || user?.role === 'super-admin';

export const isUser = (user: MockUser | null): boolean => user !== null;

// ─── Specific permission helpers ─────────────────────────────────────────────

/** Super Admin can manage any club; Club Admin only their own */
export const canManageClub = (user: MockUser | null, clubId?: string): boolean => {
  if (!user) return false;
  if (user.role === 'super-admin') return true;
  if (user.role === 'admin') return user.clubId === clubId;
  return false;
};

/** Only admins (scoped) and super admins can create events */
export const canCreateEvent = (user: MockUser | null): boolean => isAdmin(user);

/** Super admin can approve / reject events */
export const canApproveEvents = (user: MockUser | null): boolean =>
  isSuperAdmin(user);

/** Super admin can issue / revoke permission letters */
export const canIssuePermissionLetter = (user: MockUser | null): boolean =>
  isSuperAdmin(user);

/** Admins and super admins can manage members */
export const canManageMembers = (user: MockUser | null, clubId?: string): boolean =>
  canManageClub(user, clubId);

/** Only super admin can manage all users */
export const canManageUsers = (user: MockUser | null): boolean =>
  isSuperAdmin(user);

/** Super admin can send platform-wide announcements; admins can too */
export const canSendAnnouncement = (user: MockUser | null): boolean =>
  isAdmin(user);

/** Super admin can manage any event; admin only their club's */
export const canDeleteEvent = (
  user: MockUser | null,
  eventClubId?: string,
): boolean => {
  if (!user) return false;
  if (user.role === 'super-admin') return true;
  if (user.role === 'admin') return user.clubId === eventClubId;
  return false;
};

/** Which portal path to redirect to after login */
export const getPortalPath = (user: MockUser | null): string => {
  if (!user) return '/';
  if (user.role === 'super-admin') return '/portal/super-admin';
  if (user.role === 'admin') return '/portal/admin';
  return '/portal/user';
};

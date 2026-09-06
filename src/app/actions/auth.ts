'use server';

import prisma from '@/lib/db';

function getPrisma() {
  return prisma;
}

export async function loginUser(email: string) {
  const prisma = getPrisma();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        coordinatedClubs: true,
        memberships: {
          include: { club: true }
        }
      }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Format to match MockUser interface temporarily until full frontend refactor
    const clubId = user.coordinatedClubs.length > 0 
      ? user.coordinatedClubs[0].id 
      : (user.memberships.find(m => m.status === 'APPROVED')?.clubId || undefined);

    const clubName = user.coordinatedClubs.length > 0 
      ? user.coordinatedClubs[0].name 
      : (user.memberships.find(m => m.status === 'APPROVED')?.club.name || undefined);

    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase().replace('_', '-'), // SUPER_ADMIN -> super-admin
      clubId,
      clubName,
      regNo: user.regNo,
      year: user.year,
      branch: user.branch,
      bio: '',
      avatarUrl: user.avatarUrl,
    };

    return { success: true, user: formattedUser };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: 'Server error during login' };
  }
}

export async function updateUserProfile(id: string, data: any) {
  const prisma = getPrisma();
  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        year: data.year,
        branch: data.branch,
        // Bio is not in DB schema currently, but we can add it later if needed
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function getUsers() {
  const prisma = getPrisma();
  try {
    const users = await prisma.user.findMany({
      include: {
        coordinatedClubs: true,
        memberships: {
          include: { club: true }
        }
      }
    });
    return users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase().replace('_', '-'),
      regNo: user.regNo,
      year: user.year,
      branch: user.branch,
      bio: '',
      avatarUrl: user.avatarUrl,
      clubId: user.coordinatedClubs.length > 0 ? user.coordinatedClubs[0].id : (user.memberships.find((m: any) => m.status === 'APPROVED')?.clubId || undefined),
      clubName: user.coordinatedClubs.length > 0 ? user.coordinatedClubs[0].name : (user.memberships.find((m: any) => m.status === 'APPROVED')?.club.name || undefined)
    }));
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function getMemberships() {
  const prisma = getPrisma();
  try {
    const memberships = await prisma.membership.findMany({
      include: {
        user: true,
        club: true
      }
    });
    return memberships.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      userName: m.user.name,
      userEmail: m.user.email,
      userRegNo: m.user.regNo,
      clubId: m.clubId,
      clubName: m.club.name,
      status: m.status.toLowerCase(),
      requestedAt: m.requestedAt.toISOString()
    }));
  } catch (error) {
    console.error("Failed to fetch memberships:", error);
    return [];
  }
}

export async function getRegistrations() {
  const prisma = getPrisma();
  try {
    const registrations = await prisma.registration.findMany({
      include: {
        user: true,
        event: { include: { club: true } }
      }
    });
    return registrations.map((r: any) => ({
      id: r.id,
      userId: r.userId,
      eventId: r.eventId,
      eventTitle: r.event.title,
      clubName: r.event.club.name,
      date: r.event.date.toISOString(),
      venue: r.event.venue,
      registeredAt: r.registeredAt.toISOString()
    }));
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    return [];
  }
}

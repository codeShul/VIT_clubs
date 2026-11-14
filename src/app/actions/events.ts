'use server';

import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { createEventSchema, registerEventSchema, eventIdSchema } from '@/lib/validations';

function getPrisma() {
  return prisma;
}

export async function getEvents() {
  const prisma = getPrisma();
  try {
    const events = await prisma.event.findMany({
      include: { 
        club: true, 
        permissionLetter: true,
        _count: { select: { registrations: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

export async function getEventById(id: string) {
  const prisma = getPrisma();
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { club: true, permissionLetter: true }
    });
    return event;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
}

export async function createEvent(data: any) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return { success: false, error: 'Unauthorized: Only admins can create events' };
  }

  const prisma = getPrisma();
  try {
    const validatedData = createEventSchema.parse(data);

    // Resolve clubId: if admin, ensure or default to their assigned club
    let targetClubId = validatedData.clubId || session.user.clubId;
    if (!targetClubId && session.user.role === 'ADMIN') {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { coordinatedClubs: true, memberships: { where: { role: { in: ['LEAD', 'CORE_TEAM'] } } } }
      });
      if (dbUser?.coordinatedClubs.length) targetClubId = dbUser.coordinatedClubs[0].id;
      else if (dbUser?.memberships.length) targetClubId = dbUser.memberships[0].clubId;
    }

    if (!targetClubId) {
      return { success: false, error: 'Club not found for this user.' };
    }

    if (session.user.role !== 'SUPER_ADMIN' && session.user.clubId && session.user.clubId !== targetClubId) {
      return { success: false, error: 'Unauthorized: You can only create events for your own club' };
    }

    // Robust date parsing supporting YYYY-MM-DD, DD-MM-YYYY, or standard Date string
    let parsedDate = new Date(validatedData.date);
    if (isNaN(parsedDate.getTime())) {
      const parts = validatedData.date.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          parsedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        } else {
          parsedDate = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        }
      } else {
        parsedDate = new Date();
      }
    }

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: parsedDate,
        time: validatedData.time || '10:00',
        venue: validatedData.venue || 'TBA',
        capacity: validatedData.capacity,
        clubId: targetClubId,
        status: 'PENDING',
        bannerImageUrl: validatedData.bannerImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
        squareImageUrl: validatedData.squareImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
      },
      include: { club: true, permissionLetter: true }
    });
    return { success: true, event };
  } catch (error: any) {
    console.error("Failed to create event:", error);
    return { success: false, error: error?.message || String(error) };
  }
}

export async function approveEvent(eventId: string, superAdminId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Unauthorized: Only super admins can approve events' };
  }

  const prisma = getPrisma();
  try {
    eventIdSchema.parse({ id: eventId });
    // 1. Update event status
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'APPROVED' }
    });

    // 2. Generate Permission Letter
    const token = `VITC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    await prisma.permissionLetter.create({
      data: {
        eventId,
        issuedById: session.user.id,
        token
      }
    });

    return { success: true, event };
  } catch (error) {
    console.error("Failed to approve event:", error);
    return { success: false, error: 'Failed to approve event' };
  }
}

export async function rejectEvent(eventId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Unauthorized: Only super admins can reject events' };
  }

  const prisma = getPrisma();
  try {
    eventIdSchema.parse({ id: eventId });
    const event = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'REJECTED' }
    });
    return { success: true, event };
  } catch (error) {
    console.error("Failed to reject event:", error);
    return { success: false, error: 'Failed to reject event' };
  }
}

export async function deleteEvent(eventId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: 'Unauthorized' };

  const prisma = getPrisma();
  try {
    eventIdSchema.parse({ id: eventId });
    
    // Check IDOR
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return { success: false, error: 'Event not found' };
    if (session.user.role !== 'SUPER_ADMIN' && session.user.clubId !== event.clubId) {
      return { success: false, error: 'Unauthorized: You do not own this event' };
    }

    await prisma.event.delete({ where: { id: eventId } });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: 'Failed to delete event' };
  }
}

import { rateLimit } from '@/lib/rate-limit';

export async function registerForEvent(eventId: string, userId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: 'Unauthorized: Must be logged in to register' };

  // Limit to 5 registrations per minute per user
  const rl = rateLimit(`register_${session.user.id}`, 5, 60000);
  if (!rl.success) return { success: false, error: rl.error };

  // Note: We might want a rate limiter here in the future
  const prisma = getPrisma();
  try {
    registerEventSchema.parse({ eventId, userId });

    // IDOR check - you can only register yourself
    if (session.user.id !== userId && session.user.role !== 'SUPER_ADMIN') {
      return { success: false, error: 'Unauthorized: Cannot register on behalf of someone else' };
    }

    // Check if already registered
    const existing = await prisma.registration.findFirst({
      where: { eventId, userId }
    });
    if (existing) {
      return { success: false, error: 'Already registered for this event' };
    }

    // Check capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } }
    });
    
    if (!event) return { success: false, error: 'Event not found' };
    if (event._count.registrations >= event.capacity) {
      return { success: false, error: 'Event is at full capacity' };
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId,
        status: 'REGISTERED'
      }
    });

    return { success: true, registration };
  } catch (error) {
    console.error("Registration failed:", error);
    return { success: false, error: 'Failed to register for event' };
  }
}

'use server';

import prisma from '@/lib/db';

function getPrisma() {
  return prisma;
}

export async function getClubs() {
  const prisma = getPrisma();
  try {
    const clubs = await prisma.club.findMany({
      include: {
        facultyCoordinator: true,
        events: true,
        members: true
      },
      orderBy: { name: 'asc' }
    });
    return clubs;
  } catch (error) {
    console.error("Failed to fetch clubs:", error);
    return [];
  }
}

export async function getClubById(id: string) {
  const prisma = getPrisma();
  try {
    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        facultyCoordinator: true,
        events: {
          include: { permissionLetter: true }
        },
        members: {
          include: { user: true }
        }
      }
    });
    return club;
  } catch (error) {
    console.error(`Failed to fetch club ${id}:`, error);
    return null;
  }
}

export async function approveMembership(membershipId: string) {
  const prisma = getPrisma();
  try {
    await prisma.membership.update({
      where: { id: membershipId },
      data: { status: 'APPROVED' }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to approve membership:", error);
    return { success: false };
  }
}

export async function rejectMembership(membershipId: string) {
  const prisma = getPrisma();
  try {
    await prisma.membership.update({
      where: { id: membershipId },
      data: { status: 'REJECTED' }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to reject membership:", error);
    return { success: false };
  }
}

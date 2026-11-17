'use server';

import prisma from '@/lib/db';
import { ClubEntity, EntityCollection } from '@/lib/domain';

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

    // Domain collection with batch validation
    const clubCollection = new EntityCollection<ClubEntity>(
      clubs.map(c => new ClubEntity({
        id: c.id,
        name: c.name,
        slug: c.slug,
        domain: c.domain,
        description: c.description,
        vision: c.vision,
        logoUrl: c.logoUrl,
        coverUrl: c.coverUrl,
        facultyCoordinatorId: c.facultyCoordinatorId,
        isFeatured: c.isFeatured,
        isActive: c.isActive,
      }))
    );
    clubCollection.validateAll();

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

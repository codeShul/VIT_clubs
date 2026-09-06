import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { MOCK_USERS, MOCK_CLUBS, MOCK_EVENTS, MOCK_REGISTRATIONS, MOCK_MEMBERSHIPS, MOCK_PERMISSION_LETTERS } from '../src/lib/mock-data';

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  // 1. Seed Users
  for (const mockUser of MOCK_USERS) {
    const userRole = mockUser.role === 'super-admin' ? 'SUPER_ADMIN' 
                   : mockUser.role === 'admin' ? 'ADMIN' 
                   : 'USER';
    
    await prisma.user.upsert({
      where: { email: mockUser.email },
      update: {},
      create: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: userRole,
        regNo: mockUser.regNo,
        year: mockUser.year,
        branch: mockUser.branch,
        avatarUrl: mockUser.avatarUrl,
      }
    });
  }
  console.log('Users seeded.');

  // 2. Seed Clubs
  // Assign admin users as coordinators for their respective clubs
  const clubCoordinatorMap: Record<string, string> = {
    'club-5': 'user-2', // Riya Desai -> GDSC
    'club-2': 'user-3', // Priya Kapoor -> EDC
  };

  for (const mockClub of MOCK_CLUBS) {
    const coordinatorId = clubCoordinatorMap[mockClub.id] || 'user-1';
    await prisma.club.upsert({
      where: { slug: mockClub.slug },
      update: {},
      create: {
        id: mockClub.id,
        name: mockClub.name,
        slug: mockClub.slug,
        description: mockClub.description,
        vision: mockClub.description, // fallback
        domain: mockClub.domain,
        logoUrl: mockClub.logoUrl,
        coverUrl: mockClub.coverUrl,
        facultyCoordinatorId: coordinatorId,
        isFeatured: mockClub.isFeatured,
        isActive: true
      }
    });
  }
  console.log('Clubs seeded.');

  // 2b. Seed admin memberships (so login can resolve clubId)
  const adminMemberships = [
    { id: 'mem-admin-2', userId: 'user-2', clubId: 'club-5', role: 'LEAD' as const, status: 'APPROVED' as const },
    { id: 'mem-admin-3', userId: 'user-3', clubId: 'club-2', role: 'LEAD' as const, status: 'APPROVED' as const },
  ];
  for (const am of adminMemberships) {
    const existing = await prisma.membership.findFirst({
      where: { userId: am.userId, clubId: am.clubId }
    });
    if (!existing) {
      await prisma.membership.create({ data: am });
    }
  }
  console.log('Admin memberships seeded.');

  // 3. Seed Memberships
  for (const req of MOCK_MEMBERSHIPS) {
    const statusMap: any = {
      pending: 'PENDING',
      approved: 'APPROVED',
      rejected: 'REJECTED'
    };
    
    // Check if membership already exists to avoid unique constraint error
    const existing = await prisma.membership.findFirst({
      where: { userId: req.userId, clubId: req.clubId }
    });

    if (!existing) {
      await prisma.membership.create({
        data: {
          id: req.id,
          userId: req.userId,
          clubId: req.clubId,
          role: 'MEMBER',
          status: statusMap[req.status],
        }
      });
    }
  }
  console.log('Memberships seeded.');

  // 4. Seed Events
  for (const mockEvent of MOCK_EVENTS) {
    const statusMap: any = {
      draft: 'DRAFT',
      pending: 'PENDING',
      approved: 'APPROVED',
      rejected: 'REJECTED'
    };
    
    // Parse Date for Prisma
    const [year, month, day] = mockEvent.date.split('-');
    const [hours, minutes] = mockEvent.time.split(':');
    const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));

    await prisma.event.upsert({
      where: { id: mockEvent.id },
      update: {},
      create: {
        id: mockEvent.id,
        title: mockEvent.title,
        description: mockEvent.description,
        date: parsedDate,
        time: mockEvent.time,
        venue: mockEvent.venue,
        bannerImageUrl: mockEvent.imageUrl,
        squareImageUrl: mockEvent.imageUrl,
        capacity: mockEvent.capacity,
        status: statusMap[mockEvent.status],
        clubId: mockEvent.clubId,
      }
    });
  }
  console.log('Events seeded.');

  // 5. Seed Permission Letters
  for (const letter of MOCK_PERMISSION_LETTERS) {
    await prisma.permissionLetter.upsert({
      where: { token: letter.token },
      update: {},
      create: {
        id: `pl-${letter.eventId}`,
        eventId: letter.eventId,
        issuedById: 'user-1', // Super admin
        token: letter.token,
      }
    });
  }
  console.log('Permission letters seeded.');

  // 6. Seed Registrations
  for (const reg of MOCK_REGISTRATIONS) {
    const existing = await prisma.registration.findFirst({
      where: { userId: reg.userId, eventId: reg.eventId }
    });

    if (!existing) {
      await prisma.registration.create({
        data: {
          id: reg.id,
          userId: reg.userId,
          eventId: reg.eventId,
          status: 'REGISTERED'
        }
      });
    }
  }
  console.log('Registrations seeded.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

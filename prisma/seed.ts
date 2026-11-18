import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { 
  MOCK_USERS, 
  MOCK_CLUBS, 
  MOCK_EVENTS, 
  MOCK_REGISTRATIONS, 
  MOCK_MEMBERSHIPS, 
  MOCK_PERMISSION_LETTERS 
} from '../src/lib/mock-data';

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  const defaultPasswordHash = bcrypt.hashSync('password123', 10);

  // 1. Seed Users (Safely handle optional string types)
  for (const mockUser of MOCK_USERS) {
    const userRole = mockUser.role === 'super-admin' ? 'SUPER_ADMIN' 
                   : mockUser.role === 'admin' ? 'ADMIN' 
                   : 'USER';
    
    await prisma.user.upsert({
      where: { email: mockUser.email },
      update: {
        name: mockUser.name,
        role: userRole,
        regNo: mockUser.regNo || 'VIT2024001',
        year: String(mockUser.year || '3rd Year'),
        branch: mockUser.branch || 'Computer Engineering',
        avatarUrl: mockUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      },
      create: {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: userRole,
        regNo: mockUser.regNo || 'VIT2024001',
        year: String(mockUser.year || '3rd Year'),
        branch: mockUser.branch || 'Computer Engineering',
        avatarUrl: mockUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        password: defaultPasswordHash,
      }
    });
  }
  console.log('Users seeded.');

  // 2. Seed Clubs
  const clubCoordinatorMap: Record<string, string> = {
    'club-5': 'user-2', // Riya Desai -> GDSC
    'club-2': 'user-3', // Priya Kapoor -> EDC
  };

  for (const mockClub of MOCK_CLUBS) {
    const coordinatorId = clubCoordinatorMap[mockClub.id] || 'user-1';
    await prisma.club.upsert({
      where: { slug: mockClub.slug },
      update: {
        name: mockClub.name,
        description: mockClub.description,
        domain: mockClub.domain,
        logoUrl: mockClub.logoUrl,
        coverUrl: mockClub.coverUrl,
        facultyCoordinatorId: coordinatorId,
        isFeatured: mockClub.isFeatured,
      },
      create: {
        id: mockClub.id,
        name: mockClub.name,
        slug: mockClub.slug,
        description: mockClub.description,
        vision: mockClub.description,
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

  // 2b. Seed admin memberships (LEAD + APPROVED)
  const adminMemberships = [
    { id: 'mem-admin-2', userId: 'user-2', clubId: 'club-5', role: 'LEAD' as const, status: 'APPROVED' as const },
    { id: 'mem-admin-3', userId: 'user-3', clubId: 'club-2', role: 'LEAD' as const, status: 'APPROVED' as const },
  ];
  for (const am of adminMemberships) {
    await prisma.membership.upsert({
      where: {
        userId_clubId: {
          userId: am.userId,
          clubId: am.clubId
        }
      },
      update: {
        role: 'LEAD',
        status: 'APPROVED',
      },
      create: am
    });
  }
  console.log('Admin memberships seeded.');

  // 3. Seed Memberships
  for (const req of MOCK_MEMBERSHIPS) {
    const statusMap: any = {
      pending: 'PENDING',
      approved: 'APPROVED',
      rejected: 'REJECTED'
    };

    await prisma.membership.upsert({
      where: {
        userId_clubId: {
          userId: req.userId,
          clubId: req.clubId
        }
      },
      update: {
        status: statusMap[req.status] || 'PENDING',
      },
      create: {
        id: req.id,
        userId: req.userId,
        clubId: req.clubId,
        role: 'MEMBER',
        status: statusMap[req.status] || 'PENDING',
      }
    });
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
    
    const [year, month, day] = (mockEvent.date || '2026-09-01').split('-');
    const [hours, minutes] = (mockEvent.time || '10:00').split(':');
    const parsedDate = new Date(
      parseInt(year || '2026', 10),
      parseInt(month || '9', 10) - 1,
      parseInt(day || '1', 10),
      parseInt(hours || '10', 10),
      parseInt(minutes || '0', 10)
    );

    const bannerImage = mockEvent.imageUrl || mockEvent.bannerImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';
    const squareImage = mockEvent.imageUrl || mockEvent.squareImageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87';

    await prisma.event.upsert({
      where: { id: mockEvent.id },
      update: {
        title: mockEvent.title,
        description: mockEvent.description,
        date: parsedDate,
        time: mockEvent.time,
        venue: mockEvent.venue,
        bannerImageUrl: bannerImage,
        squareImageUrl: squareImage,
        capacity: mockEvent.capacity,
        status: statusMap[mockEvent.status] || 'DRAFT',
      },
      create: {
        id: mockEvent.id,
        title: mockEvent.title,
        description: mockEvent.description,
        date: parsedDate,
        time: mockEvent.time,
        venue: mockEvent.venue,
        bannerImageUrl: bannerImage,
        squareImageUrl: squareImage,
        capacity: mockEvent.capacity,
        status: statusMap[mockEvent.status] || 'DRAFT',
        clubId: mockEvent.clubId,
      }
    });
  }
  console.log('Events seeded.');

  // 5. Seed Permission Letters (upsert by unique token)
  for (const letter of MOCK_PERMISSION_LETTERS) {
    await prisma.permissionLetter.upsert({
      where: { token: letter.token },
      update: {
        eventId: letter.eventId,
        issuedById: 'user-1',
      },
      create: {
        id: `pl-${letter.eventId}`,
        eventId: letter.eventId,
        issuedById: 'user-1', // Super admin
        token: letter.token,
      }
    });
  }
  console.log('Permission letters seeded.');

  // 6. Seed Registrations (upsert by unique compound key userId_eventId)
  for (const reg of MOCK_REGISTRATIONS) {
    await prisma.registration.upsert({
      where: {
        userId_eventId: {
          userId: reg.userId,
          eventId: reg.eventId
        }
      },
      update: {
        status: 'REGISTERED'
      },
      create: {
        id: reg.id,
        userId: reg.userId,
        eventId: reg.eventId,
        status: 'REGISTERED'
      }
    });
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
    await pool.end();
  });

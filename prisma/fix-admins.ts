import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixAdminData() {
  console.log('Fixing admin club assignments...');

  // 1. Update club-5 (GDSC) coordinator to user-2 (Riya Desai)
  await prisma.club.update({
    where: { id: 'club-5' },
    data: { facultyCoordinatorId: 'user-2' }
  });
  console.log('✓ club-5 (GDSC) → coordinator: user-2 (Riya)');

  // 2. Update club-2 (EDC) coordinator to user-3 (Priya Kapoor)
  await prisma.club.update({
    where: { id: 'club-2' },
    data: { facultyCoordinatorId: 'user-3' }
  });
  console.log('✓ club-2 (EDC) → coordinator: user-3 (Priya)');

  // 3. Add admin memberships (LEAD + APPROVED) if they don't exist
  const adminMemberships = [
    { id: 'mem-admin-2', userId: 'user-2', clubId: 'club-5' },
    { id: 'mem-admin-3', userId: 'user-3', clubId: 'club-2' },
  ];

  for (const am of adminMemberships) {
    const existing = await prisma.membership.findFirst({
      where: { userId: am.userId, clubId: am.clubId }
    });
    if (!existing) {
      await prisma.membership.create({
        data: { ...am, role: 'LEAD', status: 'APPROVED' }
      });
      console.log(`✓ Created LEAD membership: ${am.userId} → ${am.clubId}`);
    } else {
      console.log(`  Already exists: ${am.userId} → ${am.clubId}`);
    }
  }

  console.log('Done! Admin users can now create events.');
}

fixAdminData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

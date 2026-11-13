import prisma from '../../src/lib/db';

async function main() {
  const events = await prisma.event.findMany();
  for (const event of events) {
    // Generate a random date between today and 60 days from now
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + Math.floor(Math.random() * 60) + 1);
    
    await prisma.event.update({
      where: { id: event.id },
      data: { date: newDate }
    });
  }
  console.log("Updated all event dates to future dates.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

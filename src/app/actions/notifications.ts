'use server';

import prisma from '@/lib/db';

function getPrisma() {
  return prisma;
}

export async function getNotifications(audience: string) {
  const prisma = getPrisma();
  try {
    return await prisma.notification.findMany({
      where: {
        OR: [
          { audience },
          { audience: 'all' }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function addNotification(data: any) {
  const prisma = getPrisma();
  try {
    const notif = await prisma.notification.create({
      data: {
        audience: data.audience,
        title: data.title,
        message: data.message,
        type: data.type,
      }
    });
    return { success: true, notification: notif };
  } catch (error) {
    console.error("Failed to add notification:", error);
    return { success: false };
  }
}

export async function markRead(id: string) {
  const prisma = getPrisma();
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark read:", error);
    return { success: false };
  }
}

export async function markAllRead(audience: string) {
  const prisma = getPrisma();
  try {
    await prisma.notification.updateMany({
      where: {
        OR: [
          { audience },
          { audience: 'all' }
        ],
        isRead: false
      },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all read:", error);
    return { success: false };
  }
}

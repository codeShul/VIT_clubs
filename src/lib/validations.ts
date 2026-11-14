import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(2000),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required").max(100),
  capacity: z.coerce.number().int().positive().max(10000, "Capacity cannot exceed 10000").default(100),
  tags: z.array(z.string()).or(z.string()).optional().transform(val => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return val.split(',').map(s => s.trim()).filter(Boolean);
  }),
  clubId: z.string().optional(),
  bannerImageUrl: z.string().url().optional().or(z.literal('')),
  squareImageUrl: z.string().url().optional().or(z.literal('')),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().min(1, "Event ID is required")
});

export const eventIdSchema = z.object({
  id: z.string().min(1, "Event ID is required")
});

export const registerEventSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  userId: z.string().min(1, "User ID is required")
});

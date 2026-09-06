import * as z from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  date: z.string(), // We can add further regex for date format if needed
  time: z.string(),
  venue: z.string().min(3).max(100),
  capacity: z.number().int().positive().max(10000, "Capacity cannot exceed 10000"),
  tags: z.array(z.string()).or(z.string()).transform(val => Array.isArray(val) ? val : [val]),
  clubId: z.string().uuid(),
  bannerImageUrl: z.string().url().optional().or(z.literal('')),
  squareImageUrl: z.string().url().optional().or(z.literal('')),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid()
});

export const eventIdSchema = z.object({
  id: z.string().uuid()
});

export const registerEventSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string().uuid()
});

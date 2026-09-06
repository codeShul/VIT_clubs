// A simple in-memory rate limiter. 
// Note: In production (e.g. Vercel Serverless), this will reset on each lambda invocation.
// For production, use Vercel KV or Redis.

const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export function rateLimit(identifier: string, limit: number, windowMs: number) {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false, error: 'Rate limit exceeded. Please try again later.' };
  }

  record.count += 1;
  return { success: true };
}

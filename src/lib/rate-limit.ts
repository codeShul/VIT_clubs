/**
 * rate-limit.ts
 *
 * Re-exports RateLimiter from domain.ts for backwards compatibility.
 *
 * OOP Concepts: Encapsulation, Static Members, Constructor, Destructor pattern
 * SOLID: Single Responsibility — this module only handles rate limiting
 */
import { RateLimiter } from './domain';

// Singleton instances per use-case (Object Creation — Unit 2)
const registrationLimiter = new RateLimiter(5, 60_000);  // 5 req/min
const loginLimiter = new RateLimiter(10, 60_000);         // 10 req/min

/**
 * Legacy function wrapper — preserved for backwards compatibility with actions/events.ts
 * Demonstrates Method Overloading pattern (Unit 2)
 */
export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60_000
): { success: boolean; error?: string } {
  const limiter = new RateLimiter(limit, windowMs);
  return limiter.check(identifier);
}

export { RateLimiter, registrationLimiter, loginLimiter };

/**
 * BaseEntity — Abstract base class for all domain models
 *
 * OOP Concepts demonstrated:
 * - Abstract Class (Unit 3 & 4): Cannot be instantiated directly; forces subclasses to implement validate() and toJSON()
 * - Encapsulation (Unit 2): Internal fields are set via constructor, not mutated directly
 * - Constructors with Default Arguments (Unit 3): createdAt defaults to now()
 * - Inheritance (Unit 4): User, Club, Event all extend this class
 */
export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt ?? new Date(); // Default argument: Unit 3
    this.updatedAt = updatedAt ?? new Date();
  }

  /** Abstract method — must be overridden by all subclasses (Unit 4: Abstract Classes) */
  abstract validate(): boolean;

  /** Abstract method — serialize to plain object (Unit 4: Polymorphism) */
  abstract toJSON(): Record<string, unknown>;

  /** Shared concrete method available to all subclasses (Unit 4: Inheritance benefit) */
  public isNew(): boolean {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    return Date.now() - this.createdAt.getTime() < ONE_DAY_MS;
  }
}

/**
 * EventEntity — Domain class extending BaseEntity
 *
 * OOP Concepts demonstrated:
 * - Inheritance (Unit 4): Extends BaseEntity
 * - Method Overriding (Unit 4): Implements abstract validate() and toJSON()
 * - Encapsulation (Unit 2): capacity and status are managed through methods
 * - Static Members (Unit 2): MAX_CAPACITY is a static constant
 */
export class EventEntity extends BaseEntity {
  public static readonly MAX_CAPACITY = 10_000; // Static member (Unit 2)

  public title: string;
  public date: Date;
  public venue: string;
  public capacity: number;
  public status: string;
  public clubId: string;

  constructor(data: {
    id: string;
    title: string;
    date: Date;
    venue: string;
    capacity: number;
    status: string;
    clubId: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt); // Constructor chaining (Unit 3)
    this.title = data.title;
    this.date = data.date;
    this.venue = data.venue;
    this.capacity = data.capacity;
    this.status = data.status;
    this.clubId = data.clubId;
  }

  /** Runtime Polymorphism (Unit 4) — same method, different logic per subclass */
  override validate(): boolean {
    return (
      this.title.length >= 3 &&
      this.capacity > 0 &&
      this.capacity <= EventEntity.MAX_CAPACITY &&
      this.date > new Date()
    );
  }

  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      date: this.date.toISOString(),
      venue: this.venue,
      capacity: this.capacity,
      status: this.status,
      clubId: this.clubId,
      createdAt: this.createdAt.toISOString(),
    };
  }

  /** Business logic methods — Encapsulation (Unit 2) */
  public isUpcoming(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.date >= today;
  }

  public isApproved(): boolean {
    return this.status === 'APPROVED';
  }

  public isFull(currentRegistrations: number): boolean {
    return currentRegistrations >= this.capacity;
  }

  public getRemainingCapacity(currentRegistrations: number): number {
    return Math.max(0, this.capacity - currentRegistrations);
  }
}

/**
 * UserEntity — Domain class extending BaseEntity
 *
 * OOP Concepts demonstrated:
 * - Inheritance (Unit 4)
 * - Encapsulation (Unit 2): password never exposed
 * - Method Overriding (Unit 4)
 */
export class UserEntity extends BaseEntity {
  public name: string;
  public email: string;
  public role: string;
  public regNo: string;
  public year: string;
  public branch: string;
  private password?: string; // Private member — Encapsulation (Unit 2)

  constructor(data: {
    id: string;
    name: string;
    email: string;
    role: string;
    regNo: string;
    year: string;
    branch: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt);
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
    this.regNo = data.regNo;
    this.year = data.year;
    this.branch = data.branch;
    this.password = data.password; // Private — never serialized
  }

  override validate(): boolean {
    return (
      this.email.endsWith('@vitpune.edu.in') &&
      this.name.length > 0 &&
      this.regNo.length > 0
    );
  }

  override toJSON(): Record<string, unknown> {
    // password is intentionally excluded — Encapsulation
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      regNo: this.regNo,
      year: this.year,
      branch: this.branch,
      createdAt: this.createdAt.toISOString(),
    };
  }

  public hasRole(role: string): boolean {
    return this.role === role;
  }

  public isSuperAdmin(): boolean {
    return this.role === 'SUPER_ADMIN';
  }

  public isAdmin(): boolean {
    return this.role === 'ADMIN' || this.role === 'SUPER_ADMIN';
  }

  public hasPassword(): boolean {
    return !!this.password;
  }
}

/**
 * RateLimiter — Utility class demonstrating:
 * - Encapsulation (Unit 2): private store Map
 * - Static Members (Unit 2): shared singleton store
 * - Object Creation (Unit 2): instantiated with new RateLimiter(limit, windowMs)
 * - Destructor pattern (Unit 3): cleanup() method resets state
 */
export class RateLimiter {
  private static store = new Map<string, { count: number; resetTime: number }>(); // Static member (Unit 2)
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) { // Constructor (Unit 3)
    this.limit = limit;
    this.windowMs = windowMs;
  }

  public check(identifier: string): { success: boolean; error?: string } {
    const now = Date.now();
    const record = RateLimiter.store.get(identifier);

    if (!record || now > record.resetTime) {
      RateLimiter.store.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return { success: true };
    }

    if (record.count >= this.limit) {
      return { success: false, error: 'Rate limit exceeded. Please try again later.' };
    }

    record.count += 1;
    return { success: true };
  }

  public getRemaining(identifier: string): number {
    const record = RateLimiter.store.get(identifier);
    if (!record || Date.now() > record.resetTime) return this.limit;
    return Math.max(0, this.limit - record.count);
  }

  /** Destructor pattern (Unit 3) — cleanup stale entries */
  public cleanup(): void {
    const now = Date.now();
    for (const [key, record] of RateLimiter.store.entries()) {
      if (now > record.resetTime) {
        RateLimiter.store.delete(key);
      }
    }
  }
}

/**
 * AuthService — Abstract interface (Unit 4: Abstract Classes and Interfaces)
 * Demonstrates Interface Segregation (SOLID Unit 6)
 */
export interface IAuthService {
  authorize(email: string, password: string): Promise<UserEntity | null>;
  hashPassword(plain: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
}

/**
 * ==============================================================================
 * VIT CLUBS (CCMS) — OBJECT-ORIENTED DOMAIN MODEL
 * ==============================================================================
 * Mapped to OOP Course Syllabus Units:
 * - UNIT 2: Classes, Visibility/Access Modifiers, Encapsulation, Static Members
 * - UNIT 3: Constructors with Default Arguments, Destructor Cleanup Patterns
 * - UNIT 4: Hierarchical Inheritance, Abstract Classes, Method Overriding, Polymorphism
 * - UNIT 5: Persistent Stream Serialization & File I/O
 * - UNIT 6: Custom Domain Exceptions, Generic Interfaces & SOLID Principles
 * ==============================================================================
 */

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * UNIT 3 & 4: Abstract Base Class
 * ──────────────────────────────────────────────────────────────────────────────
 * BaseEntity cannot be directly instantiated. Forces derived subclasses
 * (EventEntity, UserEntity, ClubEntity) to implement polymorphic contracts.
 */
export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  /**
   * UNIT 3: Constructor with Default Arguments
   * If createdAt or updatedAt are omitted, defaults to current system timestamp.
   */
  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt ?? new Date(); // Default argument: Unit 3
    this.updatedAt = updatedAt ?? new Date();
  }

  /** UNIT 4: Pure Abstract Method — overridden polymorphically by all subclasses */
  abstract validate(): boolean;

  /** UNIT 4: Pure Abstract Method — serialize to clean JSON representation */
  abstract toJSON(): Record<string, unknown>;

  /** UNIT 4: Inherited Concrete Method — shared across all derived entities */
  public isNew(): boolean {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    return Date.now() - this.createdAt.getTime() < ONE_DAY_MS;
  }
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * UNIT 2 & 4: EventEntity Subclass
 * ──────────────────────────────────────────────────────────────────────────────
 * Extends BaseEntity, encapsulates event capacity boundaries and state transitions.
 */
export class EventEntity extends BaseEntity {
  /** UNIT 2: Static Member Constant shared across all instances */
  public static readonly MAX_CAPACITY = 10_000;

  public title: string;
  public description?: string;
  public date: Date;
  public time?: string;
  public venue: string;
  public capacity: number;
  public status: string;
  public clubId: string;
  public bannerImageUrl?: string;
  public squareImageUrl?: string;

  constructor(data: {
    id: string;
    title: string;
    description?: string;
    date: Date | string;
    time?: string;
    venue: string;
    capacity: number;
    status: string;
    clubId: string;
    bannerImageUrl?: string;
    squareImageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt); // Constructor chaining (Unit 3)
    this.title = data.title;
    this.description = data.description;
    this.date = typeof data.date === 'string' ? new Date(data.date) : data.date;
    this.time = data.time || '10:00';
    this.venue = data.venue;
    this.capacity = data.capacity;
    this.status = data.status;
    this.clubId = data.clubId;
    this.bannerImageUrl = data.bannerImageUrl;
    this.squareImageUrl = data.squareImageUrl;
  }

  /** UNIT 4: Method Overriding & Runtime Polymorphism */
  override validate(): boolean {
    return (
      this.title.length >= 1 &&
      this.capacity > 0 &&
      this.capacity <= EventEntity.MAX_CAPACITY &&
      !isNaN(this.date.getTime())
    );
  }

  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date.toISOString(),
      time: this.time,
      venue: this.venue,
      capacity: this.capacity,
      status: this.status,
      clubId: this.clubId,
      createdAt: this.createdAt.toISOString(),
    };
  }

  /** UNIT 2: Encapsulated Domain Logic Methods */
  public isUpcoming(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.date >= today;
  }

  public isApproved(): boolean {
    return this.status === 'APPROVED' || this.status === 'approved';
  }

  public isFull(currentRegistrations: number): boolean {
    return currentRegistrations >= this.capacity;
  }

  public getRemainingCapacity(currentRegistrations: number): number {
    return Math.max(0, this.capacity - currentRegistrations);
  }
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * UNIT 2 & 4: UserEntity Subclass
 * ──────────────────────────────────────────────────────────────────────────────
 * Extends BaseEntity, encapsulates private authentication credentials.
 */
export class UserEntity extends BaseEntity {
  public name: string;
  public email: string;
  public role: string;
  public regNo: string;
  public year: string;
  public branch: string;
  
  /** UNIT 2: Private Access Modifier — strictly hidden from outside callers */
  private password?: string;

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
    this.password = data.password;
  }

  /** UNIT 4: Method Overriding with university email validation */
  override validate(): boolean {
    return this.email.endsWith('@vitpune.edu.in') && this.name.length > 0;
  }

  /** UNIT 2: Encapsulation — password is intentionally excluded */
  override toJSON(): Record<string, unknown> {
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
    return this.role === 'SUPER_ADMIN' || this.role === 'super-admin';
  }

  public isAdmin(): boolean {
    return this.role === 'ADMIN' || this.role === 'SUPER_ADMIN' || this.role === 'admin' || this.role === 'super-admin';
  }

  public hasPassword(): boolean {
    return !!this.password;
  }

  /** Exposes safe verification without leaking raw password hash */
  public verifyRawPassword(plain: string, compareFn: (p: string, h: string) => boolean): boolean {
    if (!this.password) return false;
    return compareFn(plain, this.password);
  }
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * UNIT 4: ClubEntity Subclass (Hierarchical Inheritance)
 * ──────────────────────────────────────────────────────────────────────────────
 */
export class ClubEntity extends BaseEntity {
  public name: string;
  public slug: string;
  public domain: string;
  public facultyCoordinatorId: string;
  public isActive: boolean;

  constructor(data: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    facultyCoordinatorId: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt);
    this.name = data.name;
    this.slug = data.slug;
    this.domain = data.domain;
    this.facultyCoordinatorId = data.facultyCoordinatorId;
    this.isActive = data.isActive ?? true;
  }

  override validate(): boolean {
    return this.name.length >= 2 && this.slug.length >= 2;
  }

  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      domain: this.domain,
      facultyCoordinatorId: this.facultyCoordinatorId,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
    };
  }

  public canHostEvents(): boolean {
    return this.isActive;
  }
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * UNIT 2 & 3: RateLimiter Utility Class
 * ──────────────────────────────────────────────────────────────────────────────
 * Encapsulates static in-memory store and destructor cleanup method.
 */
export class RateLimiter {
  /** UNIT 2: Private Static Member (shared singleton store across instances) */
  private static store = new Map<string, { count: number; resetTime: number }>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number) {
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

  /** UNIT 3: Destructor Cleanup Pattern to purge expired state */
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
 * ──────────────────────────────────────────────────────────────────────────────
 * UNIT 4 & 6: IAuthService Interface (Interface Segregation & Abstraction)
 * ──────────────────────────────────────────────────────────────────────────────
 */
export interface IAuthService {
  authorize(email: string, password: string): Promise<UserEntity | null>;
  hashPassword(plain: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
}

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * UNIT 6: Custom Domain Exception Hierarchy (Structured Exception Handling)
 * ──────────────────────────────────────────────────────────────────────────────
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class CapacityExceededException extends DomainException {
  constructor(capacity: number) {
    super(`Event has reached its maximum capacity of ${capacity} attendees.`);
    this.name = 'CapacityExceededException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor(action: string) {
    super(`Unauthorized action: ${action}`);
    this.name = 'UnauthorizedException';
  }
}

export class ValidationException extends DomainException {
  constructor(reason: string) {
    super(`Domain Validation Failed: ${reason}`);
    this.name = 'ValidationException';
  }
}

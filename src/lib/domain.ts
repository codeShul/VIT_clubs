export type ProgrammingParadigmType = 'PROCEDURAL' | 'IMPERATIVE' | 'DECLARATIVE' | 'OBJECT_ORIENTED';

/** Message Passing Interface — synchronous/asynchronous communication between domain objects */
export interface IDomainMessage<T = unknown> {
  readonly senderId: string;
  readonly recipientId?: string;
  readonly action: string;
  readonly payload: T;
  readonly timestamp: Date;
}

// ─── ABSTRACT BASE CLASS ──────────────────────────────────────────────────────

export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  abstract validate(): boolean;
  abstract toJSON(): Record<string, unknown>;

  public receiveMessage(message: IDomainMessage): boolean {
    if (!message || !message.action) return false;
    this.touch();
    return true;
  }

  public isNew(): boolean {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    return Date.now() - this.createdAt.getTime() < ONE_DAY_MS;
  }

  public getAgeInDays(): number {
    const diffMs = Date.now() - this.createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  public touch(): void {
    this.updatedAt = new Date();
  }
}

// ─── EVENT ENTITY ─────────────────────────────────────────────────────────────

export class EventEntity extends BaseEntity {
  public static readonly MAX_CAPACITY: number = 10_000;

  public title: string;
  public description?: string;
  public date: Date;
  public time: string;
  public venue: string;
  public capacity: number;
  public status: string;
  public clubId: string;
  public bannerImageUrl?: string;
  public squareImageUrl?: string;
  public tags?: string[];
  public clubName?: string;
  public club?: { id?: string; name?: string; domain?: string; [key: string]: any };
  public _count?: { registrations?: number; [key: string]: any };

  constructor(data: {
    id: string;
    title: string;
    description?: string;
    date: Date | string;
    time?: string;
    venue?: string;
    capacity: number;
    status: string;
    clubId: string;
    bannerImageUrl?: string;
    squareImageUrl?: string;
    tags?: string[];
    clubName?: string;
    club?: { id?: string; name?: string; domain?: string; [key: string]: any };
    _count?: { registrations?: number; [key: string]: any };
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt);
    this.title = data.title;
    this.description = data.description;
    this.date = typeof data.date === 'string' ? parseDateFlexible(data.date) : data.date;
    this.time = data.time || '10:00';
    this.venue = data.venue || 'TBA';
    this.capacity = data.capacity;
    this.status = data.status;
    this.clubId = data.clubId;
    this.bannerImageUrl = data.bannerImageUrl;
    this.squareImageUrl = data.squareImageUrl;
    this.tags = data.tags;
    this.clubName = data.clubName;
    this.club = data.club;
    this._count = data._count;
  }

  override validate(): boolean {
    return (
      this.title.trim().length >= 1 &&
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
      bannerImageUrl: this.bannerImageUrl,
      squareImageUrl: this.squareImageUrl,
      tags: this.tags,
      clubName: this.clubName,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  override receiveMessage(message: IDomainMessage): boolean {
    super.receiveMessage(message);
    if (message.action === 'APPROVE') {
      this.status = 'APPROVED';
      return true;
    }
    if (message.action === 'REJECT') {
      this.status = 'REJECTED';
      return true;
    }
    return false;
  }

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

  public getFormattedDate(locale = 'en-GB'): string {
    return this.date.toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  /** Method Overloading — accepts either an object patch or individual params */
  public updateDetails(patch: { title?: string; venue?: string; capacity?: number }): void;
  public updateDetails(title: string, venue?: string, capacity?: number): void;
  public updateDetails(
    arg1: string | { title?: string; venue?: string; capacity?: number },
    venue?: string,
    capacity?: number
  ): void {
    if (typeof arg1 === 'string') {
      this.title = arg1;
      if (venue) this.venue = venue;
      if (capacity !== undefined) this.capacity = capacity;
    } else {
      if (arg1.title) this.title = arg1.title;
      if (arg1.venue) this.venue = arg1.venue;
      if (arg1.capacity !== undefined) this.capacity = arg1.capacity;
    }
    this.touch();
  }

  public static createDraft(clubId: string, title: string, capacity = 100): EventEntity {
    return new EventEntity({
      id: 'draft-' + Math.random().toString(36).substring(2, 9),
      title,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      capacity,
      status: 'DRAFT',
      clubId,
    });
  }
}

// ─── USER ENTITY ──────────────────────────────────────────────────────────────

export class UserEntity extends BaseEntity {
  public name: string;
  public email: string;
  public role: string;
  public regNo: string;
  public year: string;
  public branch: string;
  public avatarUrl?: string;

  /** Private — strictly encapsulated, excluded from toJSON output */
  private password?: string;

  constructor(data: {
    id: string;
    name: string;
    email: string;
    role: string;
    regNo: string;
    year: string;
    branch: string;
    avatarUrl?: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt);
    this.name = data.name;
    this.email = data.email.toLowerCase();
    this.role = data.role;
    this.regNo = data.regNo;
    this.year = data.year;
    this.branch = data.branch;
    this.avatarUrl = data.avatarUrl;
    this.password = data.password;
  }

  override validate(): boolean {
    return (
      this.name.trim().length > 0 &&
      this.email.endsWith('@vitpune.edu.in') &&
      this.role.length > 0
    );
  }

  /** Password is excluded from the JSON output — information hiding */
  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      regNo: this.regNo,
      year: this.year,
      branch: this.branch,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public hasRole(role: string): boolean {
    return this.role === role;
  }

  public isSuperAdmin(): boolean {
    return this.role === 'SUPER_ADMIN' || this.role === 'super-admin';
  }

  public isAdmin(): boolean {
    return this.isSuperAdmin() || this.role === 'ADMIN' || this.role === 'admin';
  }

  public isStudent(): boolean {
    return this.role === 'USER' || this.role === 'user';
  }

  public hasPassword(): boolean {
    return !!this.password;
  }

  /** Friend function pattern — allows trusted comparator to verify without exposing the hash */
  public verifyRawPassword(plain: string, compareFn: (p: string, h: string) => boolean): boolean {
    if (!this.password) return false;
    return compareFn(plain, this.password);
  }
}

// ─── CLUB ENTITY ──────────────────────────────────────────────────────────────

export class ClubEntity extends BaseEntity {
  public name: string;
  public slug: string;
  public domain: string;
  public description?: string;
  public vision?: string;
  public logoUrl?: string;
  public coverUrl?: string;
  public facultyCoordinatorId: string;
  public isFeatured: boolean;
  public isActive: boolean;

  constructor(data: {
    id: string;
    name: string;
    slug: string;
    domain: string;
    description?: string;
    vision?: string;
    logoUrl?: string;
    coverUrl?: string;
    facultyCoordinatorId: string;
    isFeatured?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt);
    this.name = data.name;
    this.slug = data.slug;
    this.domain = data.domain;
    this.description = data.description;
    this.vision = data.vision;
    this.logoUrl = data.logoUrl;
    this.coverUrl = data.coverUrl;
    this.facultyCoordinatorId = data.facultyCoordinatorId;
    this.isFeatured = data.isFeatured ?? false;
    this.isActive = data.isActive ?? true;
  }

  override validate(): boolean {
    return this.name.trim().length >= 2 && this.slug.trim().length >= 2;
  }

  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      domain: this.domain,
      description: this.description,
      vision: this.vision,
      facultyCoordinatorId: this.facultyCoordinatorId,
      isFeatured: this.isFeatured,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public canHostEvents(): boolean {
    return this.isActive;
  }
}

// ─── REGISTRATION ENTITY ──────────────────────────────────────────────────────

export type RegistrationStatusType = 'REGISTERED' | 'ATTENDED' | 'CANCELLED';

export class RegistrationEntity extends BaseEntity {
  public readonly eventId: string;
  public readonly userId: string;
  public status: RegistrationStatusType;

  constructor(data: {
    id: string;
    eventId: string;
    userId: string;
    status?: RegistrationStatusType;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt);
    this.eventId = data.eventId;
    this.userId = data.userId;
    this.status = data.status || 'REGISTERED';
  }

  override validate(): boolean {
    return this.eventId.length > 0 && this.userId.length > 0;
  }

  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public markAttended(): void {
    this.status = 'ATTENDED';
    this.touch();
  }

  public cancel(): void {
    this.status = 'CANCELLED';
    this.touch();
  }
}

// ─── PERMISSION LETTER ENTITY ─────────────────────────────────────────────────

export class PermissionLetterEntity extends BaseEntity {
  public static readonly TOKEN_PREFIX: string = 'VITC';

  public readonly eventId: string;
  public readonly issuedById: string;
  public readonly token: string;
  public expiresAt?: Date;

  constructor(data: {
    id: string;
    eventId: string;
    issuedById: string;
    token?: string;
    expiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    super(data.id, data.createdAt, data.updatedAt);
    this.eventId = data.eventId;
    this.issuedById = data.issuedById;
    this.token = data.token || PermissionLetterEntity.generateToken();
    this.expiresAt = data.expiresAt;
  }

  override validate(): boolean {
    return this.token.startsWith(PermissionLetterEntity.TOKEN_PREFIX) && this.eventId.length > 0;
  }

  override toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      eventId: this.eventId,
      issuedById: this.issuedById,
      token: this.token,
      expiresAt: this.expiresAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public isExpired(): boolean {
    if (!this.expiresAt) return false;
    return Date.now() > this.expiresAt.getTime();
  }

  public static generateToken(year: number = new Date().getFullYear()): string {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${PermissionLetterEntity.TOKEN_PREFIX}-${year}-${randomHex}`;
  }
}

// ─── RATE LIMITER ─────────────────────────────────────────────────────────────

export class RateLimiter {
  private static store = new Map<string, { count: number; resetTime: number }>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 5, windowMs: number = 60_000) {
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

  /** Purges expired entries — destructor / memory recovery pattern */
  public cleanup(): void {
    const now = Date.now();
    for (const [key, record] of RateLimiter.store.entries()) {
      if (now > record.resetTime) {
        RateLimiter.store.delete(key);
      }
    }
  }

  public static getGlobalStoreSize(): number {
    return RateLimiter.store.size;
  }
}

// ─── GENERIC ENTITY COLLECTION ────────────────────────────────────────────────

export class EntityCollection<T extends BaseEntity> {
  private items: T[] = [];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  public add(item: T): this {
    this.items.push(item);
    return this;
  }

  public addMany(items: T[]): this {
    this.items.push(...items);
    return this;
  }

  public findById(id: string): T | undefined {
    return this.items.find(item => item.id === id);
  }

  public filter(predicate: (item: T) => boolean): EntityCollection<T> {
    return new EntityCollection(this.items.filter(predicate));
  }

  public sortBy(comparator: (a: T, b: T) => number): EntityCollection<T> {
    const sorted = [...this.items].sort(comparator);
    return new EntityCollection(sorted);
  }

  public all(): T[] {
    return [...this.items];
  }

  public count(): number {
    return this.items.length;
  }

  /** Polymorphic batch validation — calls the overridden validate() on each item */
  public validateAll(): boolean {
    return this.items.every(item => item.validate());
  }

  public toJSONArray(): Record<string, unknown>[] {
    return this.items.map(item => item.toJSON());
  }
}

// ─── FILE STREAM OPERATIONS ───────────────────────────────────────────────────

export type FileModeType = 'READ' | 'WRITE' | 'APPEND' | 'READ_WRITE';

export class FileStreamManager {
  private filePointer: number = 0;
  private mode: FileModeType;
  private buffer: string[] = [];

  constructor(mode: FileModeType = 'READ_WRITE') {
    this.mode = mode;
  }

  public open(initialContent: string = ''): void {
    this.buffer = initialContent ? initialContent.split('\n') : [];
    this.filePointer = this.mode === 'APPEND' ? this.buffer.length : 0;
  }

  public writeLine(line: string): void {
    if (this.mode === 'READ') {
      throw new FileStreamException('Cannot write to file opened in READ mode.');
    }
    this.buffer.push(line);
    this.filePointer++;
  }

  public readLine(): string | null {
    if (this.filePointer >= this.buffer.length) {
      return null; // EOF
    }
    return this.buffer[this.filePointer++];
  }

  public seek(position: number): void {
    this.filePointer = Math.max(0, Math.min(position, this.buffer.length));
  }

  public getPointer(): number {
    return this.filePointer;
  }

  public close(): string {
    const content = this.buffer.join('\n');
    this.filePointer = 0;
    return content;
  }
}

export class StreamSerializer {
  public static toCSV(events: EventEntity[]): string {
    const header = 'id,title,date,time,venue,capacity,status,clubId\n';
    const rows = events.map(
      e =>
        `"${e.id}","${e.title.replace(/"/g, '""')}","${e.date.toISOString()}","${e.time}","${e.venue}","${e.capacity}","${e.status}","${e.clubId}"`
    );
    return header + rows.join('\n');
  }

  public static fromCSV(csvText: string): Array<Partial<EventEntity>> {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length <= 1) return [];

    const records: Array<Partial<EventEntity>> = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(s => s.replace(/^"|"$/g, '').trim());
      if (parts.length >= 7) {
        records.push({
          id: parts[0],
          title: parts[1],
          date: new Date(parts[2]),
          time: parts[3],
          venue: parts[4],
          capacity: parseInt(parts[5], 10) || 100,
          status: parts[6],
          clubId: parts[7] || '',
        });
      }
    }
    return records;
  }

  public static toJSONStream(entities: BaseEntity[]): string {
    return JSON.stringify(entities.map(e => e.toJSON()), null, 2);
  }
}

// ─── EXCEPTION HIERARCHY ──────────────────────────────────────────────────────

export class DomainException extends Error {
  public readonly timestamp: Date;

  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
    this.timestamp = new Date();
  }
}

export class CapacityExceededException extends DomainException {
  public readonly capacity: number;

  constructor(capacity: number) {
    super(`Event has reached its maximum capacity of ${capacity} attendees.`);
    this.name = 'CapacityExceededException';
    this.capacity = capacity;
  }
}

export class UnauthorizedException extends DomainException {
  public readonly action: string;

  constructor(action: string) {
    super(`Unauthorized action: ${action}`);
    this.name = 'UnauthorizedException';
    this.action = action;
  }
}

export class ValidationException extends DomainException {
  public readonly reason: string;

  constructor(reason: string) {
    super(`Domain Validation Failed: ${reason}`);
    this.name = 'ValidationException';
    this.reason = reason;
  }
}

export class NotFoundException extends DomainException {
  public readonly entityType: string;
  public readonly identifier: string;

  constructor(entityType: string, identifier: string) {
    super(`${entityType} with identifier "${identifier}" was not found.`);
    this.name = 'NotFoundException';
    this.entityType = entityType;
    this.identifier = identifier;
  }
}

export class FileStreamException extends DomainException {
  constructor(message: string) {
    super(`File Stream Error: ${message}`);
    this.name = 'FileStreamException';
  }
}

export class DuplicateRegistrationException extends DomainException {
  constructor(userId: string, eventId: string) {
    super(`User "${userId}" is already registered for event "${eventId}".`);
    this.name = 'DuplicateRegistrationException';
  }
}

// ─── INTERFACES & SOLID CONTRACTS ────────────────────────────────────────────

export interface IAuthService {
  authorize(email: string, password: string): Promise<UserEntity | null>;
  hashPassword(plain: string): Promise<string>;
  comparePassword(plain: string, hash: string): Promise<boolean>;
}

export interface IEventService {
  getEvents(): Promise<EventEntity[]>;
  getEventById(id: string): Promise<EventEntity | null>;
  createEvent(data: unknown): Promise<{ success: boolean; event?: EventEntity; error?: string }>;
}

export interface IRepository<T extends BaseEntity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────

export function parseDateFlexible(dateInput: string | Date): Date {
  if (dateInput instanceof Date) return dateInput;
  if (!dateInput) return new Date();

  const directDate = new Date(dateInput);
  if (!isNaN(directDate.getTime())) {
    return directDate;
  }

  const parts = String(dateInput).split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  }
  return new Date();
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/** Generic safe execution wrapper — simulates multiple catch handlers */
export async function safeExecute<T>(action: () => Promise<T>): Promise<ActionResponse<T>> {
  try {
    const data = await action();
    return { success: true, data };
  } catch (error: any) {
    if (error instanceof CapacityExceededException) {
      return { success: false, error: `[Capacity Error]: ${error.message}` };
    }
    if (error instanceof ValidationException) {
      return { success: false, error: `[Validation Error]: ${error.message}` };
    }
    if (error instanceof UnauthorizedException) {
      return { success: false, error: `[Auth Error]: ${error.message}` };
    }
    return {
      success: false,
      error: error?.message || 'An unexpected domain error occurred.',
    };
  }
}

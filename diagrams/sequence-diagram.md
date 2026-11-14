# VIT Clubs — Request & Security Sequence Diagram

This sequence traces the end-to-end execution flow across the system tiers: NextAuth credentials login -> Role guard check -> Event creation with rate-limiting & IDOR check -> Super admin approval with cryptographic permit generation -> Student event registration with concurrency capacity guard.

```mermaid
sequenceDiagram
    autonumber
    actor ClubLead as Club Admin
    actor SuperAdmin as Super Admin
    actor Student as Student
    participant Edge as Vercel Edge Middleware
    participant NextAuth as NextAuth Handler
    participant ServerAction as Server Actions (events.ts)
    participant Sec as Zod & RateLimiter
    participant Prisma as Prisma v7 ORM
    participant DB as Supabase PostgreSQL

    %% Step 1: Login
    Note over ClubLead,DB: Phase 1: Authentication & RBAC Session Issuance
    ClubLead->>NextAuth: POST /api/auth/callback/credentials (email, password)
    NextAuth->>DB: prisma.user.findUnique({ email })
    DB-->>NextAuth: User record (role: ADMIN, coordinatedClub: club-5)
    NextAuth-->>ClubLead: Set-Cookie (__Secure-next-auth.session-token JWT)

    %% Step 2: Access Admin Portal
    ClubLead->>Edge: GET /portal/admin
    Edge->>Edge: getToken() -> role: ADMIN -> Pass
    Edge-->>ClubLead: Render Club Admin Dashboard

    %% Step 3: Event Creation
    Note over ClubLead,DB: Phase 2: Event Proposal & IDOR Enforcement
    ClubLead->>ServerAction: createEvent(formData)
    ServerAction->>Sec: RateLimiter.check(user.id, 5/min)
    Sec-->>ServerAction: Pass
    ServerAction->>Sec: createEventSchema.parse(formData)
    Sec-->>ServerAction: Validated input
    ServerAction->>ServerAction: IDOR Check: session.user.clubId === formData.clubId
    ServerAction->>Prisma: prisma.event.create({ status: DRAFT/PENDING })
    Prisma->>DB: INSERT INTO "Event"
    DB-->>ServerAction: Created Event record
    ServerAction-->>ClubLead: { success: true, event: Event }

    %% Step 4: Super Admin Approval
    Note over SuperAdmin,DB: Phase 3: Administrative Approval & Permission Token Generation
    SuperAdmin->>Edge: GET /portal/super-admin/approvals
    Edge->>Edge: getToken() -> role: SUPER_ADMIN -> Pass
    SuperAdmin->>ServerAction: approveEvent(eventId, superAdminId)
    ServerAction->>ServerAction: Verify Super Admin session
    ServerAction->>Prisma: prisma.$transaction([update Event -> APPROVED, create PermissionLetter -> Token])
    Prisma->>DB: UPDATE "Event" & INSERT INTO "PermissionLetter" (Token: VITC-2026-...)
    DB-->>ServerAction: Transaction Committed
    ServerAction-->>SuperAdmin: Approval confirmed

    %% Step 5: Student Registration
    Note over Student,DB: Phase 4: Student Registration with Capacity Lock
    Student->>ServerAction: registerForEvent(eventId, studentId)
    ServerAction->>Prisma: prisma.event.findUnique({ include: { _count: registrations } })
    DB-->>ServerAction: Event (capacity: 200, registered: 87)
    ServerAction->>ServerAction: Verify EventEntity.isFull() == false
    ServerAction->>Prisma: prisma.registration.create({ userId, eventId, status: REGISTERED })
    Prisma->>DB: INSERT INTO "Registration" (Unique constraint: userId + eventId)
    DB-->>ServerAction: Registration Success
    ServerAction-->>Student: { success: true, ticket: Registration }
```

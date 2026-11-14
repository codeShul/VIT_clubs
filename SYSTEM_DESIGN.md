# VIT Clubs (Campus Club Management System - CCMS)
## Comprehensive System Design Document

---

## 1. High-Level Architecture (C4 Container Diagram)

```mermaid
flowchart TD
    subgraph Users["System Actors / Roles"]
        Student["Student / Public User<br/>(Explores events, registers, views tickets)"]
        ClubLead["Club Admin / Coordinator<br/>(Creates events, manages club roster, requests approvals)"]
        SuperAdmin["Super Admin / Dean SAC<br/>(Approves/rejects events, issues cryptographic permission tokens)"]
    end

    subgraph ClientBoundary["Client Layer (Next.js 16 App Router / React 19)"]
        subgraph PublicRoutes["Public Surfaces"]
            P_Home["/ (Landing & Feed)"]
            P_Clubs["/clubs & /clubs/[slug]"]
            P_Events["/events & /events/[id]"]
            P_Cal["/calendar"]
            P_Verify["/verify/[token]"]
        end

        subgraph ProtectedRoutes["Role-Guarded Portals"]
            Portal_User["/portal/user (Profile, Registrations)"]
            Portal_Admin["/portal/admin (Club Events, Members, Analytics)"]
            Portal_Super["/portal/super-admin (Approvals, Clubs, All Users)"]
        end

        subgraph ClientState["Client State & Contexts"]
            AuthCtx["AuthProvider (NextAuth SessionProvider bridge)"]
            EventCtx["EventsProvider (DB synchronizer & optimistic state)"]
            NotifCtx["NotificationsProvider"]
        end
    end

    subgraph EdgeBoundary["Edge Network (Vercel Edge Global Network)"]
        Edge_MW["Edge Middleware (src/middleware.ts)<br/>• Security Headers: HSTS, X-Frame-Options, CSP<br/>• JWT Token Verification (getToken)<br/>• RBAC Route Protection: /portal/super-admin, /portal/admin"]
    end

    subgraph ServerBoundary["Application Server (Next.js Node.js Serverless Functions)"]
        subgraph AuthServices["Authentication Engine"]
            NextAuthHandler["/api/auth/[...nextauth]<br/>• CredentialsProvider + Bcrypt Password Hashing<br/>• JWT Token Callbacks (Enriches token with role & clubId)"]
        end

        subgraph AppServices["Business Logic & Server Actions"]
            Action_Events["src/app/actions/events.ts<br/>• getEvents, createEvent, approveEvent, rejectEvent, registerForEvent"]
            Security_Guards["Security Layer<br/>• Zod Schema Validation (lib/validations.ts)<br/>• IDOR Ownership Checks (getServerSession)<br/>• Sliding-Window Rate Limiter (lib/rate-limit.ts)"]
            Domain_OOP["OOP Domain Models (src/lib/domain.ts)<br/>• EventEntity (Capacity constraints & lifecycle)<br/>• UserEntity (Role encapsulation)<br/>• RateLimiter (Static token bucket)"]
            PDF_Service["PDF Generator (jspdf)<br/>• Official Permission Letter document renderer"]
        end
    end

    subgraph DataBoundary["Data & Storage Tier (Supabase Cloud)"]
        subgraph PrismaLayer["ORM & Database Drivers"]
            PrismaClient["Prisma v7 Client"]
            PGAdapter["@prisma/adapter-pg (Native pg Pool)"]
        end

        subgraph SupabaseDB["Supabase PostgreSQL (AWS ap-northeast-2)"]
            PgBouncer["PgBouncer Pooler (Port 6543)<br/>DATABASE_URL (Transaction-mode)"]
            DirectConn["Direct PostgreSQL (Port 5432)<br/>DIRECT_URL (Session-mode migrations)"]
            Tables[("PostgreSQL Tables<br/>User, Club, Event, Registration,<br/>Membership, PermissionLetter, ConsentForm")]
        end

        subgraph StorageLayer["Supabase Object Storage"]
            Buckets[("Media Storage<br/>Banners, Club Logos, Consent PDFs")]
        end
    end

    %% Flow connections
    Users -->|HTTPS / Browsing| ClientBoundary
    ClientBoundary -->|Route Navigation| Edge_MW
    Edge_MW -->|Authenticated Routes| ProtectedRoutes
    Edge_MW -->|Public Routes| PublicRoutes

    ClientBoundary -->|API / Session / Credentials| NextAuthHandler
    ClientBoundary -->|Server Actions / Mutations| Security_Guards

    Security_Guards --> Action_Events
    Action_Events --> Domain_OOP
    Action_Events --> PDF_Service
    NextAuthHandler --> PrismaClient
    Action_Events --> PrismaClient

    PrismaClient --> PGAdapter
    PGAdapter --> PgBouncer
    PgBouncer --> Tables
    DirectConn --> Tables
    ClientBoundary -.->|Image CDN| Buckets
```

---

## 2. End-to-End Request & Security Flow (Sequence Diagram)

This sequence illustrates the complete lifecycle: Authentication -> Event Proposal -> Super Admin Approval with Cryptographic Token -> Student Registration.

```mermaid
sequenceDiagram
    autonumber
    actor ClubLead as Club Admin
    actor SuperAdmin as Super Admin
    actor Student as Student
    participant Edge as Vercel Edge Middleware
    participant NextAuth as NextAuth Handler
    participant ServerAction as Server Actions (events.ts)
    participant RateLimit as RateLimiter & Zod
    participant Prisma as Prisma v7 ORM
    participant DB as Supabase PostgreSQL

    %% Step 1: Login
    Note over ClubLead,DB: Phase 1: Authentication & RBAC Session Issue
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
    ServerAction->>RateLimit: RateLimiter.check(user.id, 5/min)
    RateLimit-->>ServerAction: Pass
    ServerAction->>RateLimit: createEventSchema.parse(formData)
    RateLimit-->>ServerAction: Validated input
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

---

## 3. Database Entity-Relationship Diagram (ERD)

The relational data model implemented in `prisma/schema.prisma`:

```mermaid
erDiagram
    User ||--o{ Membership : "joins"
    User ||--o{ Registration : "registers"
    User ||--o{ Notification : "receives"
    User ||--o{ ClubFollow : "follows"
    User ||--o{ Club : "coordinates (Faculty)"
    User ||--o{ PermissionLetter : "issues (Super Admin)"

    Club ||--o{ Event : "organizes"
    Club ||--o{ Membership : "has members"
    Club ||--o{ ClubFollow : "has followers"
    Club ||--o{ Media : "owns gallery"

    Event ||--o{ Registration : "contains"
    Event ||--o{ PermissionLetter : "has formal permit"
    Event ||--o{ Media : "event media"

    PermissionLetter ||--o{ ConsentForm : "attaches"

    User {
        String id PK "uuid"
        String email UK "Unique"
        String name
        Role role "USER | ADMIN | SUPER_ADMIN"
        String regNo
        String year
        String branch
        String avatarUrl
        String password "Nullable / Bcrypt hashed"
        DateTime createdAt
        DateTime updatedAt
    }

    Club {
        String id PK "uuid"
        String name UK
        String slug UK
        String description
        String vision
        String domain "Coding, Robotics, Arts, etc."
        String logoUrl
        String coverUrl
        String facultyCoordinatorId FK
        Boolean isFeatured
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Membership {
        String id PK "uuid"
        String userId FK
        String clubId FK
        MembershipRole role "MEMBER | CORE_TEAM | LEAD"
        MembershipStatus status "PENDING | APPROVED | REJECTED"
        DateTime requestedAt
        DateTime updatedAt
    }

    Event {
        String id PK "uuid"
        String title
        String description
        DateTime date
        String time
        String venue
        String bannerImageUrl
        String squareImageUrl
        Int capacity
        EventStatus status "DRAFT | PENDING | APPROVED | REJECTED"
        String clubId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Registration {
        String id PK "uuid"
        String userId FK
        String eventId FK
        RegistrationStatus status "REGISTERED | ATTENDED | CANCELLED"
        DateTime registeredAt
        DateTime updatedAt
    }

    PermissionLetter {
        String id PK "uuid"
        String eventId FK
        String issuedById FK
        String token UK "Cryptographic Verification Hash"
        DateTime issuedAt
        DateTime expiresAt
    }

    ConsentForm {
        String id PK "uuid"
        String permissionLetterId FK
        String fileUrl
        ConsentFormStatus verificationStatus "PENDING | VERIFIED | REJECTED"
        Boolean isLatest
        DateTime uploadedAt
    }

    Notification {
        String id PK "uuid"
        String userId FK "Nullable (Public/Role target)"
        String audience "user:id | admin:clubId | super-admin"
        String title
        String message
        String type
        Boolean isRead
        DateTime createdAt
    }

    Media {
        String id PK "uuid"
        String ownerType "'club' | 'event'"
        String clubId FK "Nullable"
        String eventId FK "Nullable"
        String url
        String caption
        Int sortOrder
        String uploadedBy
        DateTime createdAt
    }
```

---

## 4. Network & Deployment Topology

```mermaid
flowchart LR
    subgraph Internet["Public Internet"]
        ClientBrowser["Client Browser<br/>(Desktop / Mobile)"]
    end

    subgraph VercelCloud["Vercel Cloud Infrastructure"]
        VercelEdge["Vercel Anycast Edge Network<br/>• TLS Termination<br/>• DDoS & Edge Cache<br/>• Edge Middleware (Node / V8)"]
        
        ServerlessApp["Serverless Compute (Region: iad1)<br/>• Next.js Server Components<br/>• Next.js Server Actions<br/>• NextAuth API Routes"]
    end

    subgraph SupabaseCloud["Supabase Managed Cloud (AWS ap-northeast-2)"]
        PgBouncerService["PgBouncer Connection Pooler<br/>Port 6543 (Transaction-Mode)<br/>Handles high-concurrency spikes"]
        PostgresInstance["Direct Postgres Engine<br/>Port 5432 (Session-Mode)<br/>DDL & Declarative Migrations"]
        StorageCluster["S3-Compatible Object Store<br/>Static Assets & Image Optimization"]
    end

    ClientBrowser -->|HTTPS :443| VercelEdge
    VercelEdge -->|Internal Routing| ServerlessApp
    ServerlessApp -->|Prisma @prisma/adapter-pg (Port 6543)| PgBouncerService
    ServerlessApp -.->|Migrations (Port 5432)| PostgresInstance
    PgBouncerService -->|Internal IPC / Localhost| PostgresInstance
    ClientBrowser -.->|Direct CDN GET| StorageCluster
```

---

## 5. Security & Defense-in-Depth Architecture

```mermaid
flowchart TD
    subgraph Perimeter["1. Edge Perimeter (Middleware)"]
        H1["Security Headers<br/>• X-Frame-Options: DENY<br/>• X-Content-Type-Options: nosniff<br/>• Strict-Transport-Security: max-age=31536000<br/>• Referrer-Policy: strict-origin-when-cross-origin"]
        H2["Route RBAC Token Guard<br/>• Verifies next-auth.session-token JWT signature<br/>• Checks user.role against route scope"]
    end

    subgraph AppSecurity["2. Application Tier Security"]
        A1["Input Validation<br/>• Zod Schema Validation on all Server Actions<br/>• Type-safe parsing with sanitize fallbacks"]
        A2["IDOR Prevention<br/>• getServerSession() extracts authentic session<br/>• Strict ownership matching: session.user.clubId === target.clubId"]
        A3["Rate Limiting<br/>• In-memory token bucket sliding window<br/>• Prevents automated spam / registration flooding"]
    end

    subgraph DataSecurity["3. Data Tier Security"]
        D1["Connection Security<br/>• SSL enforced connections (?sslmode=require)<br/>• Connection pooling prevents connection exhaustion"]
        D2["Data Integrity<br/>• Unique compound indexes: @@unique([userId, eventId])<br/>• Foreign Key cascades on parent deletion"]
        D3["Verification Tokens<br/>• Cryptographic random tokens (VITC-YYYY-XXXXXX) for official permits"]
    end

    Perimeter --> AppSecurity --> DataSecurity
```

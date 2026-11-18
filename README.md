# 🎓 VIT Clubs — Campus Club Management System (CCMS)

> A full-stack web application for managing student clubs, events, and memberships at Vishwakarma Institute of Technology (VIT), Pune.
> Built as part of the **Object-Oriented Programming** coursework, integrating all 6 OOP units directly into production code.

[![Live Demo](https://img.shields.io/badge/Live-vit--clubs--code--shul.vercel.app-black?style=for-the-badge&logo=vercel)](https://vit-clubs-code-shul.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Prisma](https://img.shields.io/badge/Prisma-7.9.1-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [OOP Coursework Integration](#oop-coursework-integration)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Roles & Permissions](#roles--permissions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Team](#team)

---

## 🏫 About the Project

**CCMS (Campus Club Management System)** is a production-grade web platform that streamlines the lifecycle of student club activities at VIT Pune. It supports three tiers of users — students, club admins, and super admins — each with distinct dashboards and capabilities.

The system handles:
- Student discovery and registration for club events
- Club admin event creation and member management
- Super admin approval workflows and permission letter generation
- Real-time capacity tracking and notification system
- Role-based access control with secure authentication

---

## 🎓 OOP Coursework Integration

The entire OOP syllabus (Units 1–6) is implemented **directly in the working application** — not in a separate demo file.

**Core Engine:** [`src/lib/domain.ts`](src/lib/domain.ts) — 875+ lines covering all 6 units.

| Unit | Topic | Where It's Used |
|------|-------|-----------------|
| **Unit 1** | Intro to OOP: Paradigms, Message Passing, Abstraction | `IDomainMessage<T>` interface, `receiveMessage()` on approval/rejection actions, `ProgrammingParadigmType` |
| **Unit 2** | Classes & Objects: Visibility, Static Members, Overloading | `EventEntity.MAX_CAPACITY` (static), `private password` in `UserEntity`, `EntityCollection<T>`, method overloading patterns |
| **Unit 3** | Constructors & Destructors: Default Args, Chaining | `BaseEntity` parameterized constructor, `super()` chaining, `RateLimiter.cleanup()` destructor pattern |
| **Unit 4** | Inheritance & Polymorphism: Abstract Classes, Overriding | `BaseEntity → EventEntity / UserEntity / ClubEntity / RegistrationEntity / PermissionLetterEntity` hierarchy, abstract `validate()` and `toJSON()` |
| **Unit 5** | File Handling & Streams: File Modes, Sequential I/O | `FileStreamManager` (open/write/seek/read/close), `StreamSerializer` (CSV + JSON streams), `FileStreamException` |
| **Unit 6** | Exception Handling, Generics, SOLID | `DomainException` hierarchy with 6 custom exception types, `EntityCollection<T>` generic, `safeExecute<T>()`, SOLID interfaces (`IRepository<T>`, `IAuthService`, `IEventService`) |

### Integration Points

| File | Units Demonstrated |
|------|--------------------|
| `src/lib/domain.ts` | All Units 1–6 |
| `src/app/actions/events.ts` | Units 1 (message passing), 2–4 (entity validation), 5 (file streams), 6 (exceptions) |
| `src/app/actions/clubs.ts` | Units 2, 4, 6 |
| `src/app/api/auth/[...nextauth]/route.ts` | Units 2, 4 (UserEntity) |
| `src/app/events/[id]/page.tsx` | Units 3, 4 (live domain model panel) |
| `src/app/events/page.tsx` | Units 2, 4, 6 (filtered EntityCollection) |
| `src/app/portal/admin/page.tsx` | Units 2, 4, 6 (analytics via EntityCollection) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16.2.9 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4, shadcn/ui (base-nova), Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts |
| **ORM** | Prisma v7.9.1 with `@prisma/adapter-pg` |
| **Database** | Supabase PostgreSQL (AWS ap-northeast-2) |
| **Auth** | NextAuth.js v4 (Credentials Provider, JWT strategy, bcryptjs) |
| **Validation** | Zod v4 |
| **PDF Generation** | jsPDF |
| **Connection Pooling** | PgBouncer (via Supabase) |
| **Deployment** | Vercel |

---

## ✨ Features

### 🌐 Public Pages
- **Home (`/`)** — Hero section with featured events and club highlights
- **Events (`/events`)** — Browse all approved upcoming events with capacity badges; "FULL" indicator when at max capacity
- **Event Detail (`/events/[id]`)** — Full event info with live OOP domain model panel (remaining capacity, status, upcoming check)
- **Clubs (`/clubs`)** — Explore all registered clubs by category/domain
- **Club Detail (`/clubs/[slug]`)** — Club profile, members, and events
- **Calendar (`/calendar`)** — Monthly event calendar view

### 🔐 Authentication
- Login via modal (`/`) with email + password
- JWT session management with role-based claims
- Protected routes enforced by Edge Middleware

### 👤 User Portal (`/portal/user`)
- Personal dashboard with registered events
- Registration history (`/portal/user/registrations`)
- Profile page (`/portal/user/profile`)

### 🛡️ Admin Portal (`/portal/admin`)
- Dashboard with event analytics (via `EntityCollection<EventEntity>`)
- Create / edit / delete events with OOP domain validation
- Member management for the admin's club
- Club info management

### 👑 Super Admin Portal (`/portal/super-admin`)
- Approve / reject pending events (triggers permission letter generation + message passing)
- Manage all clubs, events, and users
- Global system overview

### 🔔 Notifications
- Real-time notification system (via notifications context)
- Event approval/rejection alerts

### 🔒 Security
- Role-based route guards in `src/middleware.ts`
- Security headers: `X-Frame-Options`, `X-Content-Type-Options`
- IDOR ownership checks on all mutations
- Token bucket rate limiting (`src/lib/rate-limit.ts`)
- Zod schema validation on all server actions
- Permission letter token generation on event approval

---

## 📁 Project Structure

```
VIT clubs/
├── src/
│   ├── app/
│   │   ├── actions/              # Next.js Server Actions (business logic)
│   │   │   ├── auth.ts           # Authentication actions
│   │   │   ├── clubs.ts          # Club CRUD with OOP EntityCollection
│   │   │   ├── events.ts         # Event CRUD + OOP validation, file streams, message passing
│   │   │   └── notifications.ts  # Notification actions
│   │   ├── api/
│   │   │   └── auth/[...nextauth]/ # NextAuth.js route handler
│   │   ├── calendar/page.tsx     # Event calendar view
│   │   ├── clubs/                # Public club pages
│   │   ├── dashboard/page.tsx    # General dashboard redirect
│   │   ├── events/               # Public event pages (list + detail)
│   │   ├── portal/
│   │   │   ├── admin/            # Admin dashboard (events, members, club)
│   │   │   ├── super-admin/      # Super admin dashboard (approvals, all data)
│   │   │   └── user/             # Student dashboard (registrations, profile)
│   │   ├── verify/[token]/       # Permission letter verification
│   │   ├── layout.tsx            # Root layout (providers, navbar)
│   │   └── page.tsx              # Home page
│   ├── components/
│   │   ├── auth/                 # LoginModal, RoleGuard, UserMenu
│   │   ├── layout/               # Navbar
│   │   ├── shared/               # ClubExplorer, EventCalendar
│   │   ├── theme-provider.tsx    # Dark/light mode provider
│   │   ├── theme-toggle.tsx      # Theme switch button
│   │   └── ui/                   # shadcn/ui components (button, card, dialog, etc.)
│   ├── lib/
│   │   ├── domain.ts             # ★ CORE OOP ENGINE — All Units 1–6
│   │   ├── auth-context.tsx      # Auth state context provider
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── events-context.tsx    # Events state context provider
│   │   ├── mock-data.ts          # Seed/fallback mock data
│   │   ├── notifications-context.tsx # Notifications state
│   │   ├── permissions.ts        # Role permission helpers
│   │   ├── rate-limit.ts         # Token bucket rate limiter
│   │   ├── utils.ts              # Shared utility functions (cn, etc.)
│   │   └── validations.ts        # Zod schemas for all forms
│   ├── middleware.ts             # Edge middleware for route protection
│   └── types/
│       └── next-auth.d.ts        # Augmented NextAuth session types
├── prisma/
│   ├── schema.prisma             # Database schema (9 models)
│   ├── seed.ts                   # Database seeder (5 users, clubs, events)
│   └── fix-admins.ts             # Admin user fix script
├── docs/
│   ├── diagrams/                 # Architecture diagrams (PNG + JPG)
│   │   ├── class-diagram.*       # OOP class hierarchy
│   │   ├── er-diagram.*          # Entity-Relationship diagram
│   │   ├── sequence-diagram.*    # Request/response flow
│   │   ├── system-architecture.* # Full system architecture
│   │   └── deployment-topology.* # Vercel + Supabase deployment
│   ├── presentation/
│   │   └── PPT_GENERATION_PROMPTS.md # 13-slide PPT prompts for all 6 units
│   ├── PROJECT_CONTEXT.md        # Full project handover notes
│   ├── PROJECT_DISTRIBUTION.md   # 4-member team work distribution
│   └── SYSTEM_DESIGN.md          # Detailed system design document
├── public/                       # Static assets
├── .env                          # Environment variables (not committed)
├── components.json               # shadcn/ui config
├── next.config.ts                # Next.js config
├── package.json                  # Dependencies & scripts
├── prisma.config.ts              # Prisma v7 datasource config
└── tsconfig.json                 # TypeScript config
```

---

## 🗄️ Database Schema

9 Prisma models backed by Supabase PostgreSQL:

| Model | Description |
|-------|-------------|
| `User` | Students and admins with roles (`SUPER_ADMIN`, `ADMIN`, `USER`) |
| `Club` | Student clubs with domain, description, and coordinator |
| `Event` | Club events with status workflow (`PENDING → APPROVED / REJECTED`) |
| `Registration` | Student event registrations with attendance tracking |
| `Membership` | User-to-club relationships with roles (`LEAD`, `CORE_TEAM`, `MEMBER`) |
| `PermissionLetter` | Auto-generated approval token when super admin approves an event |
| `ConsentForm` | Student consent forms for event participation |
| `Notification` | In-app notifications for users |
| `Media` | Media assets attached to clubs or events |

---

## 👥 Roles & Permissions

| Role | Access |
|------|--------|
| `USER` | Browse events/clubs, register for events, view personal dashboard |
| `ADMIN` | All USER permissions + create/edit/delete events for their club, manage members |
| `SUPER_ADMIN` | All ADMIN permissions + approve/reject events across all clubs, manage all data |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- A Supabase project (PostgreSQL database)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codeShul/VIT_clubs.git
cd VIT_clubs

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase DATABASE_URL, DIRECT_URL, and NextAuth secret

# 4. Push the database schema
npx prisma db push

# 5. Seed the database
npx ts-node --project tsconfig.json -e "require('./prisma/seed.ts')"

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Generate Prisma client + build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Supabase PostgreSQL — connection pooling (for queries)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"

# Supabase PostgreSQL — direct connection (for migrations)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# Supabase public credentials
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# NextAuth
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Demo Accounts (Seeded)

| Email | Password | Role |
|-------|----------|------|
| `ansh@vitpune.edu.in` | `mock` | Super Admin |
| `riya@vitpune.edu.in` | `mock` | Admin (GDSC) |
| `priya@vitpune.edu.in` | `mock` | Admin (EDC) |
| `aryan@vitpune.edu.in` | `mock` | Student |
| `sneha@vitpune.edu.in` | `mock` | Student |

---

## ☁️ Deployment

The app is deployed on **Vercel** with the following setup:

- **Build command:** `prisma generate && next build`
- **Database:** Supabase PostgreSQL (AWS ap-northeast-2)
- **Connection pooling:** PgBouncer via `@prisma/adapter-pg`
- **Environment:** All `.env` variables configured in Vercel project settings

```bash
# Deploy manually via Vercel CLI
vercel --prod
```

---

## 👨‍💻 Team

| Member | Role | Units Covered |
|--------|------|---------------|
| Anshul | Full-Stack Lead, OOP Architecture | Units 1, 3, 5 |
| Arnavkumar | Backend & Database | Units 2, 6 |
| Sanskar | Frontend & UI | Unit 4 |
| Vedant | Auth, Security & Deployment | Units 4, 6 |

> See [`docs/PROJECT_DISTRIBUTION.md`](docs/PROJECT_DISTRIBUTION.md) for detailed work distribution.

---

## 📊 Diagrams

All architecture diagrams are available in [`docs/diagrams/`](docs/diagrams/) as PNG and JPG:

| Diagram | Description |
|---------|-------------|
| [`class-diagram`](docs/diagrams/class-diagram.png) | Full OOP class hierarchy (Units 1–6) |
| [`er-diagram`](docs/diagrams/er-diagram.png) | Database Entity-Relationship diagram |
| [`sequence-diagram`](docs/diagrams/sequence-diagram.png) | Event approval request/response flow |
| [`system-architecture`](docs/diagrams/system-architecture.png) | Full system architecture overview |
| [`deployment-topology`](docs/diagrams/deployment-topology.png) | Vercel + Supabase deployment topology |

---

<div align="center">
  Made with ❤️ at <strong>Vishwakarma Institute of Technology, Pune</strong>
</div>

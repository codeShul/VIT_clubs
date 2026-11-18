# VIT Clubs — Project Handover & Context Summary

## 📌 Project Overview
- **Name**: VIT Clubs (Campus Club Management System - CCMS)
- **Repository**: `https://github.com/codeShul/VIT_clubs`
- **Live URL**: `https://vit-clubs-code-shul.vercel.app`
- **Current Local Path**: `C:\Camputer\Projects\VIT clubs`
- **Framework**: Next.js 16.2.9 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Prisma v7
- **Database**: Supabase PostgreSQL (AWS ap-northeast-2, PgBouncer connection pooling)
- **Authentication**: NextAuth.js (Credentials Provider, JWT strategy, bcrypt password hashing)

---

## 🎯 Completed Architecture & Features

### 1. Database & Schema
- Supabase PostgreSQL with Prisma v7 (`@prisma/adapter-pg` for PgBouncer).
- Models: `User`, `Club`, `Event`, `Registration`, `Membership`, `PermissionLetter`, `ConsentForm`, `Notification`, `Media`.
- Club IDs use format `club-N` (e.g. `club-5`), not UUIDs.

### 2. Cybersecurity Hardening
- NextAuth JWT session handling with role mapping (`SUPER_ADMIN`, `ADMIN`, `USER`).
- Edge Middleware (`src/middleware.ts`) enforcing role-based route guards and security headers.
- Server Actions protected with Zod validation, `getServerSession()`, IDOR ownership checks, token bucket rate limiting (`src/lib/rate-limit.ts`).

### 3. OOP Domain Model — Units 1–6 (VIT Pune Syllabus) ✅

**Core Engine**: `src/lib/domain.ts` — Single unified file (875 lines) covering all 6 OOP units.

| Unit | Topic | Implementation |
|------|-------|----------------|
| **Unit 1** | Intro to OOP: Paradigms, Fundamentals, Message Passing | `ProgrammingParadigmType`, `IDomainMessage<T>`, `receiveMessage()`, `BaseEntity` data abstraction |
| **Unit 2** | Classes & Objects: Visibility, Encapsulation, Static Members | `EventEntity` (static `MAX_CAPACITY`), `UserEntity` (private `password`), method overloading, `EntityCollection<T>` |
| **Unit 3** | Constructors & Destructors | Parameterized constructors, default arguments, constructor chaining (`super()`), `RateLimiter.cleanup()` destructor |
| **Unit 4** | Inheritance & Polymorphism | `BaseEntity → EventEntity/UserEntity/ClubEntity/RegistrationEntity/PermissionLetterEntity`, abstract methods, method overriding, interfaces |
| **Unit 6** | Exception Handling, Generics, SOLID | `DomainException` hierarchy, `EntityCollection<T>` generic, `safeExecute<T>()`, SOLID interfaces |

**Integration into working app files:**

| File | OOP Units Used |
|------|----------------|
| `src/lib/domain.ts` | Units 1–4, 6 (core engine) |
| `src/app/actions/events.ts` | Units 1 (message passing), 2 (EntityCollection), 3 (constructors), 4 (inheritance/polymorphism), 6 (exceptions) |
| `src/app/actions/clubs.ts` | Units 2, 4, 6 |
| `src/app/api/auth/[...nextauth]/route.ts` | Units 2, 4 (UserEntity) |
| `src/app/events/[id]/page.tsx` | Units 3, 4 (EventEntity domain panel) |
| `src/app/events/page.tsx` | Units 2, 4, 6 (EntityCollection filter) |
| `src/app/portal/admin/page.tsx` | Units 2, 4, 6 (EntityCollection stats) |

### 4. Diagrams (docs/diagrams/)
All saved as PNG and JPG:
- `class-diagram.png/jpg`, `system-architecture.png/jpg`, `sequence-diagram.png/jpg`
- `er-diagram.png/jpg`, `deployment-topology.png/jpg`, `project-distribution.png/jpg`

### 5. Presentation
- `docs/presentation/PPT_GENERATION_PROMPTS.md` — 13-slide PPT prompts covering Units 1–6
- `PROJECT_DISTRIBUTION.md` — 4-member work distribution for all 6 units

---

## 🔑 Key Credentials & Seeded Users
| Email | Password | Role | Club |
|-------|----------|------|------|
| `ansh@vitpune.edu.in` | `mock` | SUPER_ADMIN | — |
| `riya@vitpune.edu.in` | `mock` | ADMIN | club-5 (GDSC) |
| `priya@vitpune.edu.in` | `mock` | ADMIN | club-2 (EDC) |
| `aryan@vitpune.edu.in` | `mock` | USER | — |
| `sneha@vitpune.edu.in` | `mock` | USER | — |

---

## 🛠️ Common PowerShell Notes
- Use `;` instead of `&&` for command chaining in PowerShell.
- Use `Select-String` instead of `grep`.
- Run `npx tsc --noEmit` to verify 0 TypeScript errors before commits.

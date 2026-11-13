# VIT Clubs — Project Handover & Context Summary

## 📌 Project Overview
- **Name**: VIT Clubs (Campus Club Management System - CCMS)
- **Repository**: `https://github.com/codeShul/VIT_clubs`
- **Current Local Path**: `C:\Camputer\Projects\VIT clubs`
- **Framework**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Prisma v7
- **Database**: Supabase PostgreSQL (Connection Pooling + Direct URL configured)
- **Authentication**: NextAuth.js (Credentials Provider with bcrypt password hashing)

---

## 🎯 Completed Architecture & Features
1. **Database & Schema**:
   - Supabase PostgreSQL with Prisma v7.
   - Models: `User`, `Club`, `Event`, `Registration`, `Membership`, `PermissionLetter`, `ConsentForm`, `Notification`, `Media`.
2. **Cybersecurity Hardening (Phase 4)**:
   - NextAuth JWT session handling with role mapping (`SUPER_ADMIN`, `ADMIN`, `USER`).
   - Edge Middleware (`src/middleware.ts`) enforcing role-based route guards (`/portal/admin`, `/portal/super-admin`) and security headers (`X-Frame-Options`, `X-Content-Type-Options`).
   - Server Actions in `src/app/actions/events.ts` protected with Zod validation, `getServerSession()`, IDOR ownership checks, and token bucket rate limiting (`src/lib/rate-limit.ts`).
3. **OOP Domain Model & Coursework**:
   - Comprehensive Mermaid class diagram generated in `class_diagram.md`.
   - Domain classes implemented in `src/lib/domain.ts`:
     - `BaseEntity` (Abstract class)
     - `EventEntity` (Inheritance, encapsulated methods: `isUpcoming()`, `isFull()`, `getRemainingCapacity()`)
     - `UserEntity` (Encapsulation, private password, role helpers)
     - `RateLimiter` (Class with static store, constructor, destructor/cleanup)
     - `IAuthService` (Interface for SOLID compliance)
4. **Recent Vercel Build Fixes**:
   - `.npmrc`: Set `legacy-peer-deps=true` for React 19 compatibility.
   - `prisma/schema.prisma`: Removed deprecated `url` and `directUrl` properties for Prisma v7.
   - `prisma.config.ts`: Configured datasource URL.
   - `tsconfig.json`: Added `"prisma"` to `exclude` to prevent standalone scripts from breaking Next.js builds.
   - `prisma/scripts/updateDates.ts`: Corrected import path to `../../src/lib/db`.

---

## 🚀 Immediate Next Action (Why Vercel Failed)
The last build on Vercel failed with:
```
Type error: Cannot find module '../src/lib/db' or its corresponding type declarations.
> 1 | import prisma from '../src/lib/db';
```
**Fix already applied to local disk**:
1. `tsconfig.json` now excludes `prisma/`.
2. `prisma/scripts/updateDates.ts` fixed import to `../../src/lib/db`.

**Command to push**:
```bash
git add tsconfig.json prisma/scripts/updateDates.ts
git commit -m "fix: exclude prisma scripts from tsconfig build and fix relative db import"
git push origin main
```
Once pushed, Vercel will build and deploy successfully.

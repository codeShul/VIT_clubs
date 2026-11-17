# 🎬 VIT Clubs (CCMS) — Presentation Generation Prompts

> **Course:** Object-Oriented Programming (OOP) — Units 1 through 6  
> **Institution:** Vishwakarma Institute of Technology (VIT Pune)  
> **Project Title:** Campus Club Management System (CCMS)  
> **Live Production:** `https://vit-clubs-code-shul.vercel.app`  
> **Repository:** `https://github.com/codeShul/VIT_clubs`  
> **Audience:** Faculty Evaluator / Professor for OOP Project Viva  

---

## 🛠️ Prompt 1: One-Click Gamma.app / Beautiful.ai Prompt

Copy and paste the prompt below into **[Gamma.app](https://gamma.app)** or **Beautiful.ai** to generate a presentation deck with dark-mode developer styling:

```text
Create a 13-slide professional engineering presentation deck for our university Object-Oriented Programming (OOP) viva evaluation at Vishwakarma Institute of Technology (VIT Pune). 

Visual Aesthetic & Theme:
- Theme: Modern Dark Mode (Background: #05050A, Slate Blue: #1E293B, Primary Accent: Electric Cyan #06B6D4, Secondary Accent: Royal Blue #3B82F6).
- Typography: Clean Sans-Serif (Inter / Space Grotesk) with monospace font badges for code references.
- Style: Academic, engineering-grade, structured, avoiding generic corporate stock visuals. Include clean architectural flowcharts, code callout badges, and comparison tables.

Project Overview:
- Title: VIT Clubs (Campus Club Management System - CCMS)
- Tech Stack: Next.js 16 (App Router), React 19, TypeScript (OOP Domain Engine), Prisma ORM v7, PostgreSQL (Supabase Pooler), NextAuth JWT Security.
- Team: 4-Member Engineering Team with equal 25% workload distribution mapped to OOP Units 1–6.
- Live Deployment: https://vit-clubs-code-shul.vercel.app

Slide-by-Slide Outline:

Slide 1: Title Slide
- Title: VIT CLUBS — Campus Club Management System (CCMS)
- Subtitle: Enterprise Club Lifecycle & Event Registry Engineered with Object-Oriented Architecture
- Course: Object-Oriented Programming Course Project (Units 1–6)
- College: Vishwakarma Institute of Technology, Pune
- Team: Member 1 (Domain Architect), Member 2 (Security & Edge Lead), Member 3 (Persistence & Stream Engineer), Member 4 (Server Actions & UI Generics Lead)
- Live Production URL: https://vit-clubs-code-shul.vercel.app

Slide 2: Problem Statement & Engineering Objectives
- Core Problems: VIT Pune has 38+ clubs conducting 100+ events every semester. Current system suffers from fragmented Google Forms, unverified venues, race conditions in registrations, and paper-based faculty approval letters.
- Engineering Goals: High-concurrency event registration, cryptographically verifiable permissions, 100% OOP domain encapsulation, and automated edge protection.

Slide 3: System Architecture & C4 Container Model
- Visual Architecture:
  1. Client Tier: Next.js 16 SSR + Responsive Tailwind + Framer Motion Generics.
  2. Edge Guard Tier: Middleware JWT validation + In-memory RateLimiter class.
  3. Domain Tier: Pure OOP Entity Hierarchy (BaseEntity -> EventEntity, UserEntity, ClubEntity, RegistrationEntity, PermissionLetterEntity).
  4. Data Tier: Prisma ORM v7 with dual-mode PostgreSQL connection pooling on Supabase.
- Flow: Browser -> Edge RBAC -> Server Actions -> OOP Entities -> Transactional DB.

Slide 4: OOP Unit 1 — Introduction to OOP, Paradigms & Message Passing
- Member Ownership: Member 1 (Domain Architect) & Member 2 (Security Lead)
- Key Syllabus Concepts:
  * Paradigms: Imperative vs. Declarative; limitations of procedural programming (lack of data-behavior bundling).
  * Fundamentals: Objects, Classes, Data Members, Methods, Encapsulation, Abstraction, Information Hiding.
  * Static vs. Dynamic Binding: Static compile-time methods vs. late runtime virtual dispatch.
  * Message Passing: Implemented via IDomainMessage and receiveMessage() for decoupled inter-object state communication.

Slide 5: OOP Unit 2 — Classes, Objects & Encapsulation
- Member Ownership: Member 1 (Domain Architect) & Member 2 (Security Lead)
- Key Syllabus Concepts:
  * Visibility/Access Modifiers: public, private, readonly.
  * Encapsulation: UserEntity.password is marked private, hidden from outside callers and JSON payloads.
  * Static Class Members: EventEntity.MAX_CAPACITY = 10000; RateLimiter.store maintains global request buckets.
  * Methods & Overloading: EventEntity.updateDetails() overload simulation; methods returning values and taking objects as parameters.
  * Array of Objects: EntityCollection<T> encapsulates arrays of domain objects with query methods.

Slide 6: OOP Unit 3 — Constructors, Destructors & Dynamic Initialization
- Member Ownership: Member 3 (Database Lead) & Member 4 (Server Actions Lead)
- Key Syllabus Concepts:
  * Parameterized Constructors with Default Arguments: BaseEntity(id, createdAt ?? new Date(), updatedAt ?? new Date()).
  * Constructor Chaining: super() in derived classes.
  * Dynamic Object Initialization: Connection pool instantiation dynamically bound from runtime environment strings.
  * Destructor / Memory Recovery Pattern: RateLimiter.cleanup() purges expired timestamp records (simulating 'delete' memory release).

Slide 7: OOP Unit 4 — Hierarchical Inheritance & Abstract Classes
- Member Ownership: Member 1 (Domain Architect)
- Key Syllabus Concepts:
  * Abstract Class: BaseEntity cannot be instantiated directly; defines pure abstract methods validate() and toJSON().
  * Hierarchical Inheritance: EventEntity, UserEntity, ClubEntity, RegistrationEntity, and PermissionLetterEntity all derive from BaseEntity.
  * Software Reuse & Benefits: Common identity attributes and helper methods (isNew(), getAgeInDays()) inherited across all entities.

Slide 8: OOP Unit 4 — Method Overriding, Polymorphism & Friend Functions
- Member Ownership: Member 1 (Domain Architect) & Member 4 (Server Actions Lead)
- Key Syllabus Concepts:
  * Run-Time Polymorphism: Method Overriding in EventEntity.validate() (capacity & date rules) vs UserEntity.validate() (domain & name rules).
  * Dynamic Dispatch: Calling entity.validate() through a base pointer executes the concrete derived class logic at runtime.
  * Friend Function Equivalent: verifyRawPassword() allows privileged callers (NextAuth/bcrypt) to verify credentials without leaking the private hash.

Slide 9: OOP Unit 5 — File Handling, Stream Operations & File Modes
- Member Ownership: Member 3 (Database & Persistence Lead)
- Key Syllabus Concepts:
  * File Stream Operations: FileStreamManager emulating open(), close(), readLine(), writeLine(), and seek().
  * File Modes: READ, WRITE, APPEND, READ_WRITE modes with file pointer tracking.
  * Sequential I/O Streams: StreamSerializer.toCSV() and StreamSerializer.toJSONStream() for event and attendee data.
  * Error Handling during File Operations: Custom FileStreamException.

Slide 10: OOP Unit 6 — Exception Handling Hierarchy
- Member Ownership: Member 4 (Server Actions Lead)
- Key Syllabus Concepts:
  * Custom Exception Hierarchy: DomainException extends Error; derived classes: ValidationException, CapacityExceededException, UnauthorizedException, NotFoundException.
  * Exception Handling Mechanism: Structured try/catch blocks in Server Actions preventing unhandled crashes.
  * Multiple Catch Simulation: safeExecute<T>() selectively catches and handles distinct domain errors.

Slide 11: OOP Unit 6 — Generic Programming & S.O.L.I.D. Principles
- Member Ownership: Member 2 (Security Lead) & Member 4 (Server Actions Lead)
- Key Syllabus Concepts:
  * Generics: EntityCollection<T extends BaseEntity>, IRepository<T>, ActionResponse<T>.
  * Single Responsibility Principle (SRP): Middleware handles security; actions handle orchestration; entities handle domain invariants.
  * Open-Closed Principle (OCP): New entity types extend BaseEntity without editing existing models.
  * Liskov Substitution Principle (LSP): Subclasses seamlessly satisfy BaseEntity polymorphic calls.
  * Interface Segregation (ISP): Lean contracts (IAuthService, IEventService).
  * Dependency Inversion (DIP): High-level actions depend on domain abstractions.

Slide 12: Live Production Feature Showcase & Code Proof
- Live URL: https://vit-clubs-code-shul.vercel.app
- Feature 1: Event Detail Page with live OOP Domain Panel showing getRemainingCapacity() & isFull().
- Feature 2: Club Admin Portal with real-time OOP event status analytics.
- Feature 3: Cryptographic Permission Letter Generator (token: VITC-2026-XXXXXX) for Super Admins.
- Feature 4: Role-Based Access Control guarding Student, Club Admin, and Super Admin routes.

Slide 13: 4-Member Workload Distribution Matrix & Conclusion
- 4-Member Workload Breakdown (25% weightage each):
  * Member 1: Domain Modeling, Unit 1 (Paradigms/Message Passing) & Unit 4 (Inheritance/Polymorphism).
  * Member 2: Edge Security, Encapsulation, Unit 1, Unit 2 & Unit 6 (SOLID).
  * Member 3: Supabase Database, Unit 3 (Constructors/Destructors) & Unit 5 (File Streams).
  * Member 4: Server Actions, Unit 2 (Object Arrays) & Unit 6 (Exceptions/Generics).
- Conclusion: 100% compliance with VIT Pune OOP Course Syllabus (Units 1 through 6).
- Q&A / Viva Defense Invitation.
```

# 🎬 VIT Clubs (CCMS) — Presentation Generation Prompts

> **Course:** Object-Oriented Programming (OOP) — Units 2 through 6  
> **Institution:** Vishwakarma Institute of Technology (VIT Pune)  
> **Project Title:** Campus Club Management System (CCMS)  
> **Live Production:** `https://vit-clubs-code-shul.vercel.app`  
> **Repository:** `https://github.com/codeShul/VIT_clubs`  
> **Audience:** Faculty Evaluator / Professor for OOP Project Viva  

---

## 🛠️ Prompt 1: One-Click Gamma.app / Beautiful.ai Prompt

Copy and paste the prompt below into **[Gamma.app](https://gamma.app)** or **Beautiful.ai** to generate a presentation deck with dark-mode developer styling:

```text
Create a 12-slide professional engineering presentation deck for our university Object-Oriented Programming (OOP) viva evaluation at Vishwakarma Institute of Technology (VIT Pune). 

Visual Aesthetic & Theme:
- Theme: Modern Dark Mode (Background: #05050A, Slate Blue: #1E293B, Primary Accent: Electric Cyan #06B6D4, Secondary Accent: Royal Blue #3B82F6).
- Typography: Clean Sans-Serif (Inter / Space Grotesk) with monospace font badges for code references.
- Style: Academic, engineering-grade, structured, avoiding generic corporate stock visuals. Include clean architectural flowcharts, code callout badges, and comparison tables.

Project Overview:
- Title: VIT Clubs (Campus Club Management System - CCMS)
- Tech Stack: Next.js 16 (App Router), React 19, TypeScript (OOP Domain Engine), Prisma ORM v7, PostgreSQL (Supabase Pooler), NextAuth JWT Security.
- Team: 4-Member Engineering Team with equal 25% workload distribution mapped to OOP Units 2–6.
- Live Deployment: https://vit-clubs-code-shul.vercel.app

Slide-by-Slide Outline:

Slide 1: Title Slide
- Title: VIT CLUBS — Campus Club Management System (CCMS)
- Subtitle: Enterprise Club Lifecycle & Event Registry Engineered with Object-Oriented Architecture
- Course: Object-Oriented Programming Course Project (Units 2–6)
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
  3. Domain Tier: Pure OOP Entity Hierarchy (`BaseEntity` -> `EventEntity`, `UserEntity`, `ClubEntity`).
  4. Data Tier: Prisma ORM v7 with dual-mode PostgreSQL connection pooling on Supabase.
- Flow: Browser -> Edge RBAC -> Server Actions -> OOP Entities -> Transactional DB.

Slide 4: OOP Unit 2 — Classes, Objects & Encapsulation
- Member Ownership: Member 1 (Domain Architect) & Member 2 (Security Lead)
- Key OOP Concepts Implemented:
  * Encapsulation: `UserEntity.password` is private, shielded from network payloads.
  * Static Class Members: `EventEntity.MAX_CAPACITY = 10000` enforces domain-wide safety bounds; `RateLimiter.store` maintains global request buckets.
  * Member Methods: `EventEntity.getRemainingCapacity(regCount)` encapsulates calculation logic.
- Code Callout: Display concise TypeScript snippet of `EventEntity` with private and static attributes.

Slide 5: OOP Unit 3 — Constructors, Defaults & Dynamic Initialization
- Member Ownership: Member 3 (Database Lead) & Member 4 (Server Actions Lead)
- Key OOP Concepts Implemented:
  * Parameterized Constructors with Default Arguments: `super(id, createdAt ?? new Date(), updatedAt ?? new Date())`.
  * Dynamic Object Initialization: Connection pool instantiation in `src/lib/db.ts` dynamically bound from runtime environment connection strings.
  * Destructor / Resource Cleanup Pattern: `RateLimiter.cleanup()` purges expired timestamp records; Prisma singleton prevents socket exhaustion.

Slide 6: OOP Unit 4 — Hierarchical Inheritance & Abstract Classes
- Member Ownership: Member 1 (Domain Architect)
- Inheritance Hierarchy:
  * Abstract Class: `BaseEntity` defines abstract pure virtual methods `validate(): boolean` and `toJSON(): Record<string, unknown>`.
  * Concrete Subclasses: `EventEntity`, `UserEntity`, `ClubEntity` extend `BaseEntity`.
  * Common State: All entities inherit `id`, `createdAt`, `updatedAt`, and concrete helper `isNew()`.
- Visual: UML Class diagram box showing the inheritance tree.

Slide 7: OOP Unit 4 — Method Overriding & Runtime Polymorphism
- Member Ownership: Member 1 (Domain Architect) & Member 4 (Server Actions Lead)
- Polymorphism in Action:
  * `EventEntity.validate()`: Enforces capacity > 0, date validity, and title bounds.
  * `UserEntity.validate()`: Enforces university domain `@vitpune.edu.in` and name length.
  * `ClubEntity.validate()`: Enforces minimum naming conventions.
- Runtime Execution: Server action calls `entity.validate()` uniformly on base pointers, triggering derived class logic polymorphically.

Slide 8: OOP Unit 5 — File Handling, Streams & Persistent I/O
- Member Ownership: Member 3 (Database & Persistence Lead)
- Concepts Implemented:
  * Stream File I/O: Prisma migration engine reads, parses, and streams `.sql` migration files sequentially into PostgreSQL.
  * Environment Config Streams: `dotenv` opens `.env` stream with read locks.
  * Connection Pool Modes: Transaction mode (port 6543) vs Session/DDL migration mode (port 5432).
  * Automated Date Shifter: Node.js stream script updating event dates dynamically.

Slide 9: OOP Unit 6 — Exception Handling & Custom Hierarchy
- Member Ownership: Member 4 (Server Actions Lead)
- Custom Exception Hierarchy:
  * Base: `DomainException extends Error`
  * Derived 1: `CapacityExceededException` (thrown when registration exceeds event capacity)
  * Derived 2: `ValidationException` (thrown when domain rules are violated)
  * Derived 3: `UnauthorizedException` (thrown when IDOR or role breach occurs)
- Robustness: Server Actions intercept exceptions inside try/catch blocks and return safe, structured JSON responses to the UI without crashing the server.

Slide 10: OOP Unit 6 — Generics & S.O.L.I.D. Principles
- Member Ownership: Member 2 (Security Lead) & Member 4 (Server Actions Lead)
- Generic Programming:
  * React Context Generics: `createContext<T>`, `useState<T>`, and typed async Server Action responses `Promise<ActionResponse<T>>`.
- S.O.L.I.D. Principles Proof:
  * S (SRP): Edge middleware handles routing security only; domain handles business rules only.
  * O (OCP): New entity types (e.g., WorkshopEntity) can extend `BaseEntity` without altering existing code.
  * L (LSP): Subclasses can replace `BaseEntity` anywhere `validate()` is called.
  * I (ISP): Lean interfaces `IAuthService`, `NewEventInput`.
  * D (DIP): High-level actions depend on domain abstractions rather than raw database drivers.

Slide 11: Live Production Feature Showcase & Code Proof
- Live URL: https://vit-clubs-code-shul.vercel.app
- Feature 1: Event Detail Page with live OOP Domain Panel showing `getRemainingCapacity()` & `isFull()`.
- Feature 2: Club Admin Portal with real-time OOP event status analytics.
- Feature 3: Cryptographic Permission Letter Generator (`VITC-2026-XXXXXX`) for Super Admins.
- Feature 4: Role-Based Access Control guarding Student, Club Admin, and Super Admin routes.

Slide 12: Team Contribution Matrix & Conclusion
- 4-Member Workload Distribution Table (25% each):
  * Member 1: Domain Architecture, UML Diagrams, Units 2 & 4.
  * Member 2: Edge Security, NextAuth JWT, RateLimiter, Units 2, 4, 6.
  * Member 3: Supabase PostgreSQL, Prisma ORM, File I/O & Streams, Units 3 & 5.
  * Member 4: Server Actions, Custom Exceptions, Generics & SOLID, Units 3 & 6.
- Conclusion: 100% of VIT Pune OOP syllabus (Units 2–6) covered in an enterprise full-stack deployment.
- Q&A / Viva Defense Invitation.
```

---

## 💻 Prompt 2: Python Script to Auto-Generate `.pptx` (Offline Slides)

Run this Python script using `python-pptx` to generate the complete `VIT_Clubs_OOP_Presentation.pptx` presentation deck directly on your computer:

```python
# Install prerequisite: pip install python-pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

DARK_BG = RGBColor(5, 5, 10)
TEXT_WHITE = RGBColor(255, 255, 255)
CYAN = RGBColor(6, 182, 212)
SLATE_GRAY = RGBColor(148, 163, 184)
CARD_BG = RGBColor(15, 23, 42)

def create_slide(title, subtitle, bullets):
    slide = prs.slides.add_slide(blank_layout)
    bg = slide.shapes.add_shape(1, 0, 0, prs.slide_width, prs.slide_height)
    bg.fill.solid()
    bg.fill.fore_color.rgb = DARK_BG
    bg.line.color.rgb = DARK_BG

    # Header
    tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(1.2))
    tf = tx_box.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = CYAN

    p2 = tf.add_paragraph()
    p2.text = subtitle
    p2.font.size = Pt(14)
    p2.font.color.rgb = SLATE_GRAY

    # Content
    body_box = slide.shapes.add_textbox(Inches(0.8), Inches(2.0), Inches(11.7), Inches(4.8))
    bf = body_box.text_frame
    bf.word_wrap = True

    for bullet in bullets:
        bp = bf.add_paragraph()
        bp.text = "• " + bullet
        bp.font.size = Pt(16)
        bp.font.color.rgb = TEXT_WHITE
        bp.space_after = Pt(14)

slides_data = [
    ("VIT CLUBS — Campus Club Management System (CCMS)", 
     "Object-Oriented Programming Course Project (Units 2–6) | VIT Pune",
     ["Enterprise Club & Event Lifecycle Platform",
      "Live Production: https://vit-clubs-code-shul.vercel.app",
      "Full 4-Member Workload Distribution (25% Weightage Each)",
      "Strict Mapping to VIT Pune OOP Course Syllabus (Units 2 to 6)"]),

    ("Unit 2: Classes, Objects & Encapsulation",
     "Member 1 & Member 2 Ownership — Data Hiding & Static Invariants",
     ["Abstract Base Class & Domain Subclasses (BaseEntity -> EventEntity, UserEntity, ClubEntity)",
      "Private Member Encapsulation: UserEntity.password is strictly private and hidden from toJSON()",
      "Static Class Members: EventEntity.MAX_CAPACITY = 10,000 shared constant across all event instances",
      "RateLimiter.store: Private static hash map maintaining global rate limit buckets across requests"]),

    ("Unit 3: Constructors & Destructor Cleanup Patterns",
     "Member 3 & Member 4 Ownership — Resource Lifecycle & State Invariants",
     ["Parameterized Constructors with Default Arguments: BaseEntity(id, createdAt ?? new Date(), updatedAt ?? new Date())",
      "Dynamic Object Initialization: Prisma connection pool dynamically bound via environment connection strings",
      "Destructor / Garbage Cleanup Pattern: RateLimiter.cleanup() purges stale timestamp entries to prevent memory leaks",
      "Serverless Database Connection Re-use: globalForPrisma singleton prevents socket exhaustion"]),

    ("Unit 4: Hierarchical Inheritance & Abstract Classes",
     "Member 1 Ownership — Extensible Domain Architecture",
     ["BaseEntity: Declared as an abstract class that cannot be directly instantiated",
      "Pure Abstract Methods: validate(): boolean and toJSON(): Record<string, unknown>",
      "Hierarchical Inheritance: EventEntity, UserEntity, ClubEntity inherit id, createdAt, updatedAt, isNew()",
      "Interface Segregation: IAuthService defines strict authentication contracts for decoupled modules"]),

    ("Unit 4: Method Overriding & Runtime Polymorphism",
     "Member 1 & Member 4 Ownership — Dynamic Method Dispatch",
     ["Polymorphic validate() Overrides: Distinct validation logic executed based on runtime object type",
      "EventEntity.validate(): Capacity bounds, date sanity, and title length checks",
      "UserEntity.validate(): Vitpune.edu.in domain verification and name validation",
      "Base Pointer Invocation: Server Actions call entity.validate() uniformly without knowing derived type"]),

    ("Unit 5: File Handling & Stream Operations",
     "Member 3 Ownership — Persistence & Sequential I/O Streams",
     ["Prisma SQL File Migrations: Migration CLI reads and streams sequential .sql files to PostgreSQL",
      "Environment Configuration Streams: dotenv loads and streams .env file contents into runtime memory",
      "Connection Pooling Stream Modes: Port 6543 (PgBouncer transaction stream) vs Port 5432 (Session stream)",
      "Automated Date Maintenance Script: Stream-based updates adjusting event schedules dynamically"]),

    ("Unit 6: Exception Handling Hierarchy",
     "Member 4 Ownership — Fault-Tolerant Business Logic",
     ["Custom Domain Exception Tree: DomainException extends Error",
      "Specialized Exceptions: CapacityExceededException, ValidationException, UnauthorizedException",
      "Robust Server Action Try/Catch: Traps domain errors and returns structured error objects to UI",
      "Zero Server Crashes: Client displays explicit feedback banners instead of unhandled rejections"]),

    ("Unit 6: Generics & S.O.L.I.D. Principles",
     "Member 2 & Member 4 Ownership — Enterprise Software Engineering",
     ["Generic Context & State: createContext<T>, useState<T>, and ActionResponse<T> generics",
      "Single Responsibility Principle (SRP): Edge middleware handles routing; actions handle business logic",
      "Open/Closed Principle (OCP): New entities can extend BaseEntity without editing existing models",
      "Liskov Substitution Principle (LSP): Subclasses seamlessly satisfy BaseEntity polymorphic calls",
      "Dependency Inversion Principle (DIP): UI components depend on domain entities, not raw database clients"]),

    ("Live Demonstration & Code Review Pointers",
     "Live URL: https://vit-clubs-code-shul.vercel.app",
     ["Event Registration Page (/events/[id]): Real-time OOP Domain Panel displaying getRemainingCapacity()",
      "Admin Dashboard (/portal/admin): EventEntity.isUpcoming() and isApproved() metrics",
      "Super Admin Workflow: Cryptographic permission letter issuance (token: VITC-2026-XXXXXX)",
      "Edge Guards: Unauthenticated requests redirected immediately via NextAuth middleware"]),

    ("4-Member Contribution & Viva Defense Summary",
     "Vishwakarma Institute of Technology, Pune — Final Viva Evaluation",
     ["Member 1 (25%): Domain Modeling, Abstract Classes, Polymorphic Validation, Class Diagrams",
      "Member 2 (25%): NextAuth Authentication, Edge Middleware, Rate Limiting, Interface Design",
      "Member 3 (25%): Supabase PostgreSQL, Prisma Schema, Migration Streams, File I/O",
      "Member 4 (25%): Server Actions, Custom Exception Hierarchy, Generics, UI Integration",
      "Result: Complete compliance with VIT Pune OOP Course Syllabus Units 2 through 6"])
]

for title, subtitle, bullets in slides_data:
    create_slide(title, subtitle, bullets)

prs.save("VIT_Clubs_OOP_Presentation.pptx")
print("Presentation generated successfully: VIT_Clubs_OOP_Presentation.pptx")
```

---

## 🤖 Prompt 3: ChatGPT Plus / Claude 3.5 Sonnet Prompt for PPT Outline

```text
Act as a Senior Software Engineering Professor and Object-Oriented Programming (OOP) Lead Evaluator at Vishwakarma Institute of Technology (VIT Pune).

Generate an in-depth, slide-by-slide university presentation for our team project "VIT Clubs (Campus Club Management System - CCMS)" that demonstrates 100% compliance with Units 2 through 6 of our OOP Coursework.

Team Structure (4 Members, 25% each):
1. Member 1: Domain Architecture & OOP Modeling Lead (Unit 2 & Unit 4)
2. Member 2: Cybersecurity, Edge & Authentication Lead (Unit 2, Unit 4, Unit 6)
3. Member 3: Database, ORM & File/Stream Persistence Lead (Unit 3 & Unit 5)
4. Member 4: Server Actions, Business Logic & UI Generics Lead (Unit 3 & Unit 6)

Provide:
1. Exact visual slide titles and subtitles.
2. 4-5 bullet points per slide explaining the architectural significance and OOP concept.
3. Code callout box identifying the exact file path and method name.
4. Spoken script cues for who speaks on which slide.
5. Anticipated faculty viva questions and model answers.
```

# VIT Clubs (CCMS) — Architecture & Diagrams Index

This folder contains the complete, up-to-date system architecture and design diagrams for the **VIT Clubs Campus Club Management System (CCMS)**.

## 📁 Diagram Directory

| Diagram | File | Focus / Scope |
| :--- | :--- | :--- |
| **Object-Oriented Class Diagram** | [class-diagram.md](./class-diagram.md) | Domain classes (`BaseEntity`, `EventEntity`, `UserEntity`, `RateLimiter`), OOP inheritance, encapsulation, polymorphism, interfaces (`IAuthService`), and methods. |
| **System Architecture (C4 Container)** | [system-architecture.md](./system-architecture.md) | Actors, Client Layer, Edge Middleware, Serverless Application Services, and Supabase Cloud. |
| **Request & Security Sequence** | [sequence-diagram.md](./sequence-diagram.md) | End-to-end execution flow: NextAuth login, RBAC check, event creation with IDOR validation, admin approval, and student registration. |
| **Entity-Relationship Diagram (ERD)** | [er-diagram.md](./er-diagram.md) | Complete PostgreSQL relational schema from `prisma/schema.prisma` with primary/foreign keys and compound unique constraints. |
| **Network & Deployment Topology** | [deployment-topology.md](./deployment-topology.md) | Vercel Edge proxy, Serverless compute (iad1), Supabase PgBouncer pooler (port 6543), and direct Postgres (port 5432). |

---

## Quick Navigation

- [View Class Diagram](./class-diagram.md)
- [View System Architecture](./system-architecture.md)
- [View Sequence Diagram](./sequence-diagram.md)
- [View Entity-Relationship Diagram](./er-diagram.md)
- [View Deployment Topology](./deployment-topology.md)

# VIT Clubs (CCMS) — Architecture & Diagrams Index

This folder contains the complete, up-to-date system architecture and design diagrams for the **VIT Clubs Campus Club Management System (CCMS)** saved in high-resolution **PNG**, **JPG**, and **Markdown** formats.

---

## 🖼️ Diagram Image Gallery (PNG & JPG)

| Diagram Title | PNG Image | JPG Image | Markdown Source | Description |
| :--- | :---: | :---: | :---: | :--- |
| **Object-Oriented Class Diagram** | [class-diagram.png](./class-diagram.png) | [class-diagram.jpg](./class-diagram.jpg) | [class-diagram.md](./class-diagram.md) | `BaseEntity`, `EventEntity`, `UserEntity`, `ClubEntity`, `RateLimiter`, `IAuthService` inheritance & polymorphism |
| **System Architecture (C4 Container)** | [system-architecture.png](./system-architecture.png) | [system-architecture.jpg](./system-architecture.jpg) | [system-architecture.md](./system-architecture.md) | Client Tier, Edge Guard, Serverless Compute, Domain Tier, and Supabase Cloud |
| **Request & Security Flow (Sequence)** | [sequence-diagram.png](./sequence-diagram.png) | [sequence-diagram.jpg](./sequence-diagram.jpg) | [sequence-diagram.md](./sequence-diagram.md) | NextAuth login, RBAC check, event creation, approval, and event registration |
| **Entity-Relationship Diagram (ERD)** | [er-diagram.png](./er-diagram.png) | [er-diagram.jpg](./er-diagram.jpg) | [er-diagram.md](./er-diagram.md) | PostgreSQL relational schema (`User`, `Club`, `Event`, `Registration`, `PermissionLetter`) |
| **Network & Deployment Topology** | [deployment-topology.png](./deployment-topology.png) | [deployment-topology.jpg](./deployment-topology.jpg) | [deployment-topology.md](./deployment-topology.md) | Vercel Anycast Edge, Serverless Compute (iad1), PgBouncer Pooler (6543), Direct DB (5432) |
| **4-Member Project Distribution** | [project-distribution.png](./project-distribution.png) | [project-distribution.jpg](./project-distribution.jpg) | [PROJECT_DISTRIBUTION.md](../PROJECT_DISTRIBUTION.md) | 4-member 25% workload breakdown aligned with OOP syllabus Units 2–6 |

---

## 📋 Image Preview Quick Links

- 🏛️ **Class Diagram:** [class-diagram.png](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/class-diagram.png) · [class-diagram.jpg](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/class-diagram.jpg)
- 🏗️ **System Architecture:** [system-architecture.png](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/system-architecture.png) · [system-architecture.jpg](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/system-architecture.jpg)
- 🔄 **Sequence Diagram:** [sequence-diagram.png](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/sequence-diagram.png) · [sequence-diagram.jpg](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/sequence-diagram.jpg)
- 🗄️ **ER Diagram:** [er-diagram.png](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/er-diagram.png) · [er-diagram.jpg](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/er-diagram.jpg)
- 🌐 **Deployment Topology:** [deployment-topology.png](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/deployment-topology.png) · [deployment-topology.jpg](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/deployment-topology.jpg)
- 👥 **Project Distribution:** [project-distribution.png](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/project-distribution.png) · [project-distribution.jpg](file:///c:/Camputer/Projects/VIT%20clubs/diagrams/project-distribution.jpg)

# VIT Clubs — Database Entity-Relationship Diagram (ERD)

This diagram captures the complete PostgreSQL schema implemented in `prisma/schema.prisma`, including relations, foreign keys, compound constraints, and enums.

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
        String userId FK "Nullable"
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

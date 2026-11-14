# VIT Clubs — Object-Oriented Class Diagram

This diagram documents the domain class hierarchy, encapsulation boundaries, static members, and interface contracts implemented in `src/lib/domain.ts` and core services.

```mermaid
classDiagram
    class BaseEntity {
        <<abstract>>
        +String id
        +Date createdAt
        +Date updatedAt
        +isNew() bool
        +validate()* bool
        +toJSON()* Record
    }

    class EventEntity {
        +String title
        +Date date
        +String venue
        +int capacity
        +String status
        +String clubId
        +MAX_CAPACITY$ int
        +validate() bool
        +toJSON() Record
        +isUpcoming() bool
        +isApproved() bool
        +isFull(int currentRegistrations) bool
        +getRemainingCapacity(int currentRegistrations) int
    }

    class UserEntity {
        +String name
        +String email
        +String role
        +String regNo
        +String year
        +String branch
        -String password
        +validate() bool
        +toJSON() Record
        +hasRole(String role) bool
        +isSuperAdmin() bool
        +isAdmin() bool
        +hasPassword() bool
    }

    class ClubEntity {
        +String name
        +String slug
        +String description
        +String vision
        +String domain
        +String logoUrl
        +String coverUrl
        +String facultyCoordinatorId
        +bool isFeatured
        +bool isActive
        +validate() bool
        +toJSON() Record
        +canCreateEvent(UserEntity user) bool
    }

    class RateLimiter {
        -Map store$
        -int limit
        -int windowMs
        +check(String identifier) Result
        +getRemaining(String identifier) int
        +cleanup() void
    }

    class IAuthService {
        <<interface>>
        +authorize(String email, String password)* Promise~UserEntity~
        +hashPassword(String plain)* Promise~String~
        +comparePassword(String plain, String hash)* Promise~bool~
    }

    class AuthService {
        -PrismaClient prisma
        +authorize(String email, String password) Promise~UserEntity~
        +hashPassword(String plain) Promise~String~
        +comparePassword(String plain, String hash) Promise~bool~
    }

    class EventService {
        -PrismaClient prisma
        -RateLimiter rateLimiter
        +getEvents() Promise~List~
        +createEvent(Object data) Promise~Result~
        +approveEvent(String id, String superAdminId) Promise~Result~
        +rejectEvent(String id) Promise~Result~
        +registerForEvent(String eventId, String userId) Promise~Result~
    }

    BaseEntity <|-- EventEntity : Inheritance
    BaseEntity <|-- UserEntity : Inheritance
    BaseEntity <|-- ClubEntity : Inheritance
    IAuthService <|.. AuthService : Implements
    AuthService --> UserEntity : Creates / Authenticates
    EventService --> EventEntity : Validates & Manages
    EventService --> RateLimiter : Uses for throttling
```

---

### OOP Pillars & Design Patterns Represented

1. **Abstraction**:
   - `BaseEntity` is an abstract base class requiring subclasses to provide concrete implementations for `validate()` and `toJSON()`.
   - `IAuthService` specifies the interface contract for authentication services.
2. **Inheritance**:
   - `EventEntity`, `UserEntity`, and `ClubEntity` inherit identity fields (`id`, `createdAt`, `updatedAt`) and concrete utility methods (`isNew()`) from `BaseEntity`.
3. **Encapsulation**:
   - `UserEntity.password` is declared `private` and is omitted from `toJSON()` serialization.
   - `RateLimiter.store` is a private, in-memory state map accessible only via guarded `check()` and `cleanup()` methods.
4. **Polymorphism**:
   - `EventEntity.validate()` validates positive capacity boundaries and future dates.
   - `UserEntity.validate()` enforces university email domain constraints (`@vitpune.edu.in`).
5. **Static Members & Singleton State**:
   - `EventEntity.MAX_CAPACITY = 10000` defines a static class-level invariant.
   - `RateLimiter.store` acts as a static shared token bucket across server instances.

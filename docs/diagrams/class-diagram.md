# VIT Clubs — Object-Oriented Class Diagram

This diagram documents the domain class hierarchy, encapsulation boundaries, static members, message passing interface, and collection managers implemented in `src/lib/domain.ts` and core services.

```mermaid
classDiagram
    class IDomainMessage~T~ {
        <<interface>>
        +String senderId
        +String recipientId
        +String action
        +T payload
        +Date timestamp
    }

    class BaseEntity {
        <<abstract>>
        +String id
        +Date createdAt
        +Date updatedAt
        +isNew() bool
        +getAgeInDays() int
        +touch() void
        +receiveMessage(IDomainMessage message) bool
        +validate()* bool
        +toJSON()* Record
    }

    class EventEntity {
        +String title
        +String description
        +Date date
        +String time
        +String venue
        +int capacity
        +String status
        +String clubId
        +MAX_CAPACITY$ int
        +validate() bool
        +toJSON() Record
        +receiveMessage(IDomainMessage message) bool
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
        +isStudent() bool
        +hasPassword() bool
        +verifyRawPassword(String plain, Function compareFn) bool
    }

    class ClubEntity {
        +String name
        +String slug
        +String domain
        +String description
        +String vision
        +String logoUrl
        +String coverUrl
        +String facultyCoordinatorId
        +bool isFeatured
        +bool isActive
        +validate() bool
        +toJSON() Record
        +canHostEvents() bool
    }

    class RegistrationEntity {
        +String eventId
        +String userId
        +String status
        +validate() bool
        +toJSON() Record
        +markAttended() void
        +cancel() void
    }

    class PermissionLetterEntity {
        +String eventId
        +String issuedById
        +String token
        +Date expiresAt
        +TOKEN_PREFIX$ String
        +generateToken(int year)$ String
        +validate() bool
        +toJSON() Record
        +isExpired() bool
    }

    class RateLimiter {
        -Map store$
        -int limit
        -int windowMs
        +check(String identifier) Result
        +getRemaining(String identifier) int
        +cleanup() void
    }

    class EntityCollection~T~ {
        -List~T~ entities
        +add(T entity) void
        +all() List~T~
        +validateAll() bool
        +filter(Function predicate) List~T~
    }

    class DomainException {
        +String message
    }

    class CapacityExceededException {
        +int maxCapacity
    }

    class ValidationException {
    }

    class UnauthorizedException {
    }

    BaseEntity <|-- EventEntity : Inheritance
    BaseEntity <|-- UserEntity : Inheritance
    BaseEntity <|-- ClubEntity : Inheritance
    BaseEntity <|-- RegistrationEntity : Inheritance
    BaseEntity <|-- PermissionLetterEntity : Inheritance
    BaseEntity ..> IDomainMessage : receives

    DomainException <|-- CapacityExceededException : Inheritance
    DomainException <|-- ValidationException : Inheritance
    DomainException <|-- UnauthorizedException : Inheritance

    EntityCollection~T~ o-- BaseEntity : aggregates
    EventEntity --> PermissionLetterEntity : generates on approval
    EventEntity --> RegistrationEntity : registers
    EventEntity ..> RateLimiter : throttled by
```

---

### OOP Pillars & Design Patterns Represented

1. **Abstraction**:
   - `BaseEntity` is an abstract base class requiring all subclasses to provide concrete implementations for `validate()` and `toJSON()`.
   - `IDomainMessage<T>` specifies the interface contract for message passing between objects.
2. **Inheritance & Polymorphism**:
   - Subclasses (`EventEntity`, `UserEntity`, `ClubEntity`, `RegistrationEntity`, `PermissionLetterEntity`) extend `BaseEntity`, inheriting identity lifecycle methods (`isNew()`, `getAgeInDays()`, `touch()`).
   - Each subclass overrides `validate()` and `toJSON()` with entity-specific constraints.
   - Domain exception hierarchy inherits from `DomainException` (`CapacityExceededException`, `ValidationException`, `UnauthorizedException`).
3. **Encapsulation & Information Hiding**:
   - `UserEntity.password` is declared `private` and is safely omitted from `toJSON()` serialization.
   - `RateLimiter.store` is a private, in-memory state map accessible only via guarded `check()` and `cleanup()` methods.
4. **Message Passing & Event Handling**:
   - `IDomainMessage<T>` and `receiveMessage()` decouple state transitions (such as status updates upon admin approval/rejection).
5. **Generics & Collection Management**:
   - `EntityCollection<T extends BaseEntity>` provides type-safe aggregate operations (`validateAll()`, `filter()`).

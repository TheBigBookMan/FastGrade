# Data Model Baseline Documentation

## Document Purpose

This document captures the **actual state** of the FastGrade database schema as defined in the Prisma schema file. This is a BASELINE, not a design specification. All tables, fields, relationships, constraints, and quirks are documented as they exist without judgment or proposed improvements.

## Methodology

This baseline was created through direct inspection of:

### Primary Source
- `/api/prisma/schema.prisma:1-176` - Complete Prisma schema definition

### Cross-References
- `/ai/features/system-baseline/02-acceptance.md` - Acceptance criteria with cascade behavior documentation
- `/ai/features/system-baseline/04-api-baseline.md` - API baseline identifying unused fields
- `/api/src/services/commentService.js:1-65` - Comment query patterns
- `/api/src/services/categoryService.js:1-92` - Category query patterns
- `/api/src/controllers/tagController.js:1-61` - Tag creation logic with TODO comment

## Schema Configuration

**Database Provider**: MySQL (schema.prisma:6)
**ID Strategy**: CUID (Collision-resistant Unique Identifier) for all primary keys
**Timestamp Strategy**: Automatic `createdAt` and `updatedAt` fields on most models

## Table Inventory

### Active Tables: 9

| Table | Fields | Relationships | Purpose | Status |
|-------|--------|---------------|---------|--------|
| User | 4 | 8 outgoing | User accounts | ACTIVE |
| Comment | 12 | 2 outgoing, 2 incoming | Feedback templates | ACTIVE |
| Category | 7 | 1 outgoing, 1 incoming | Comment organization | ACTIVE |
| Tag | 4 | 1 outgoing, 1 incoming | Comment tagging | PARTIAL (API incomplete) |
| CommentTag | 3 | 3 outgoing | Comment-Tag junction | ORPHANED (no API) |
| Attachment | 11 | 1 outgoing | File uploads | ACTIVE (no DELETE) |
| HotkeyMapping | 5 | 2 outgoing | Keyboard shortcuts | ORPHANED (no API) |
| Settings | 5 | 1 outgoing | User preferences | ACTIVE |
| Feedback | 5 | 1 outgoing | User feedback | ACTIVE |

### Commented-Out Tables: 2

**Rubric Models** (schema.prisma:148-175):
- `RubricCriteria` - Commented out with TODO note
- `CommentRubricCriteria` - Commented out with TODO note
- Status: Future feature, not in active schema

## Complete Table Definitions

### User Table

**Location**: schema.prisma:14-32

**Fields**:
```prisma
id         String       @id @default(cuid())
email      String       @unique
createdAt  DateTime     @default(now())
updatedAt  DateTime     @updatedAt
```

**Relationships** (8 total):
- `comments: Comment[]` - One-to-many
- `categories: Category[]` - One-to-many
- `Attachment: Attachment[]` - One-to-many
- `Tag: Tag[]` - One-to-many
- `CommentTag: CommentTag[]` - One-to-many
- `HotkeyMapping: HotkeyMapping[]` - One-to-many
- `Settings: Settings[]` - One-to-many
- `Feedback: Feedback[]` - One-to-many

**Constraints**:
- Primary Key: `id` (CUID)
- Unique: `email`

**Cascade Behavior**:
- When User deleted, ALL related records cascade delete (see Cascade Behaviors section below)

**Observations**:
- No password field (authentication not implemented at schema level)
- No role or permission fields
- Email is unique constraint but no verification status field
- No soft delete or archived status

---

### Comment Table

**Location**: schema.prisma:34-54

**Fields**:
```prisma
id            String          @id @default(cuid())
title         String?
body          String          @db.VarChar(1024)
userId        String
categoryId    String?
isFavourite   Boolean         @default(false)
order         Int             @default(0)
useCount      Int             @default(0)
lastUsedAt    DateTime?
keywords      Json?
createdAt     DateTime        @default(now())
updatedAt     DateTime        @updatedAt
```

**Relationships**:
- `user: User` - Many-to-one (required)
- `category: Category?` - Many-to-one (optional)
- `CommentTag: CommentTag[]` - One-to-many
- `HotkeyMapping: HotkeyMapping[]` - One-to-many

**Constraints**:
- Primary Key: `id` (CUID)
- Indexes: `userId`, `categoryId` (schema.prisma:52-53)
- Body length: VarChar(1024) enforced at database level

**Cascade Behavior**:
- When User deleted: Comment CASCADE deleted (line 38)
- When Category deleted: Comment.categoryId set to NULL (line 40, no onDelete specified)
- When Comment deleted: CommentTag CASCADE deleted (verified in CommentTag model line 75)
- When Comment deleted: HotkeyMapping CASCADE deleted (verified in HotkeyMapping model line 125)

**Unused Fields** (cross-referenced with API baseline):

1. **order** (line 43):
   - Type: Int, default 0
   - UNUSED: Queries use `orderBy: { createdAt: 'desc' }` instead
   - Verified: /api/src/services/commentService.js:7
   - Always remains at default value 0

2. **useCount** (line 44):
   - Type: Int, default 0
   - UNUSED: No code updates this value
   - Always remains 0
   - Verified in API baseline: "No code in /webapp, /api, or /extension updates this value"

3. **lastUsedAt** (line 45):
   - Type: DateTime?, nullable
   - UNUSED: No code updates this value
   - Always remains null
   - Verified in API baseline: "useCount and lastUsedAt fields exist but never updated"

4. **keywords** (line 46):
   - Type: Json?, nullable
   - UNUSED: No code sets this value
   - Always remains null
   - Purpose unknown

**Observations**:
- 4 of 12 fields (33%) are defined but unused
- Body limited to 1024 characters at database level
- Title is optional (nullable)
- isFavourite uses UK spelling (frontend uses US "favorite" inconsistently)
- Category relationship is optional (uncategorized comments allowed)

---

### Category Table

**Location**: schema.prisma:83-96

**Fields**:
```prisma
id          String    @id @default(cuid())
name        String
description String?
userId      String
order       Int
createdAt   DateTime  @default(now())
updatedAt   DateTime  @updatedAt
```

**Relationships**:
- `user: User` - Many-to-one (required)
- `comments: Comment[]` - One-to-many

**Constraints**:
- Primary Key: `id` (CUID)
- Composite Unique: `[userId, name]` (line 94) - Category names unique per user
- Index: `userId` (line 95)

**Cascade Behavior**:
- When User deleted: Category CASCADE deleted (line 87)
- When Category deleted: Comment.categoryId set to NULL (verified in Comment model line 40)
- When Category deleted: Remaining categories reordered via transaction (verified /api/src/services/categoryService.js:62-74)

**Observations**:
- Order field is ACTIVELY USED (unlike Comment.order)
- Queries use `orderBy: { order: 'asc' }` (verified categoryService.js:7)
- Bulk reorder endpoint exists: PUT /api/category/user/{userId}/order
- Order values are rebalanced to sequential numbers after deletion
- Description is optional

---

### Tag Table

**Location**: schema.prisma:56-67

**Fields**:
```prisma
id        String   @id @default(cuid())
userId    String
name      String
createdAt DateTime @default(now())
```

**Relationships**:
- `user: User` - Many-to-one (required)
- `commentTags: CommentTag[]` - One-to-many

**Constraints**:
- Primary Key: `id` (CUID)
- Composite Unique: `[userId, name]` (line 66) - Tag names unique per user

**Cascade Behavior**:
- When User deleted: Tag CASCADE deleted (line 63)
- When Tag deleted: CommentTag CASCADE deleted (verified in CommentTag model line 76)

**Implementation Status**: PARTIAL
- API routes exist: POST /api/tag, GET /api/tag/{userId}, GET /api/tag/{tagId}/user/{userId}
- Tag creation requires `commentId` in request body
- **CommentTag association is NOT created** (verified /api/src/controllers/tagController.js:50-51 TODO comment)
- Tags can be created but are orphaned (not linked to comments)

**Observations**:
- No updatedAt field (tags are immutable after creation)
- No description field
- No color or visual metadata

---

### CommentTag Table (Junction Table)

**Location**: schema.prisma:69-81

**Fields**:
```prisma
commentId String
tagId     String
userId    String
```

**Relationships**:
- `comment: Comment` - Many-to-one (required)
- `tag: Tag` - Many-to-one (required)
- `user: User` - Many-to-one (required)

**Constraints**:
- Composite Primary Key: `[commentId, tagId]` (line 79)
- Index: `[userId, tagId]` (line 80)

**Cascade Behavior**:
- When Comment deleted: CommentTag CASCADE deleted (line 75)
- When Tag deleted: CommentTag CASCADE deleted (line 76)
- When User deleted: CommentTag CASCADE deleted (line 77)

**Implementation Status**: ORPHANED
- Junction table exists in schema
- **NO API endpoints exist to create associations**
- Tag creation endpoint does NOT populate this table (verified tagController.js:50-51)
- Table likely has no data

**Observations**:
- userId field is redundant (can be derived from comment.userId or tag.userId)
- Prevents duplicate tag assignments (composite PK)
- Index on [userId, tagId] suggests user-scoped tag queries were planned

---

### Attachment Table

**Location**: schema.prisma:98-114

**Fields**:
```prisma
id           String   @id @default(cuid())
name         String
originalName String
fileType     String
fileSize     Int
mimeType     String
description  String?
userId       String
url          String
thumbnailUrl String?
createdAt    DateTime @default(now())
updatedAt    DateTime @updatedAt
```

**Relationships**:
- `user: User` - Many-to-one (required)

**Constraints**:
- Primary Key: `id` (CUID)
- Index: `userId` (line 113)

**Cascade Behavior**:
- When User deleted: Attachment CASCADE deleted (line 106)
- **NO R2 cleanup on deletion** (file remains in R2 storage)

**Implementation Status**: ACTIVE (incomplete)
- API routes exist: POST /api/attachment/{userId}, GET /api/attachment/{userId}, GET /api/attachment/{attachmentId}/user/{userId}
- **NO DELETE endpoint** (verified /api/src/routes/attachment.js:1-10)
- Attachments cannot be removed once uploaded
- R2 files become orphaned if attachment record is manually deleted

**Observations**:
- Stores both display name and original filename
- fileSize in bytes (Int type, max ~2GB)
- thumbnailUrl only populated for images (nullable)
- Thumbnail generation is synchronous and blocks upload response (verified API baseline)
- No file type validation or whitelist
- No virus scanning

---

### HotkeyMapping Table

**Location**: schema.prisma:116-128

**Fields**:
```prisma
id        String  @id @default(cuid())
userId    String
commentId String
hotkey    String
isActive  Boolean @default(true)
```

**Relationships**:
- `user: User` - Many-to-one (required)
- `comment: Comment` - Many-to-one (required)

**Constraints**:
- Primary Key: `id` (CUID)
- Composite Unique: `[userId, hotkey]` (line 127) - One hotkey per user

**Cascade Behavior**:
- When User deleted: HotkeyMapping CASCADE deleted (line 124)
- When Comment deleted: HotkeyMapping CASCADE deleted (line 125)

**Implementation Status**: ORPHANED
- Schema exists and is active (not commented out)
- **NO API routes exist** (no /api/src/routes/hotkey.js file)
- **NO controller exists**
- Complete feature gap
- Table likely has no data

**Observations**:
- isActive field suggests hotkeys can be toggled without deletion
- Hotkey string has no format validation at schema level
- No timestamp fields (cannot track when hotkey was created or last used)

---

### Settings Table

**Location**: schema.prisma:139-146

**Fields**:
```prisma
id        String   @id @default(cuid())
userId    String   @unique
settings  Json
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

**Relationships**:
- `user: User` - Many-to-one (required)

**Constraints**:
- Primary Key: `id` (CUID)
- Unique: `userId` (line 141) - One settings record per user

**Cascade Behavior**:
- When User deleted: Settings CASCADE deleted (line 142)

**Implementation Status**: ACTIVE
- API routes exist: GET, POST, PUT endpoints
- Default settings file: /api/src/config/defaultSettings.json contains `{}`
- Settings update uses shallow merge (not deep merge)

**Observations**:
- Json field allows free-form settings (no schema validation)
- No settings key validation (accepts any structure)
- Default settings are empty object
- userId is unique constraint (enforces one-to-one relationship)

---

### Feedback Table

**Location**: schema.prisma:130-137

**Fields**:
```prisma
id          String   @id @default(cuid())
title       String
description String
userId      String
createdAt   DateTime @default(now())
```

**Relationships**:
- `user: User` - Many-to-one (required)

**Constraints**:
- Primary Key: `id` (CUID)
- No indexes (full table scans on queries)

**Cascade Behavior**:
- When User deleted: **NO onDelete specified** (line 134)
- Database will determine behavior (likely RESTRICT or CASCADE depending on MySQL configuration)

**Observations**:
- No updatedAt field (feedback is immutable)
- No status field (open, closed, resolved)
- No category or priority fields
- No admin response mechanism
- GET /api/feedback returns ALL feedback from ALL users (no auth)

---

## Relationship Summary

### One-to-Many Relationships: 8

| Parent | Child | Cardinality | Foreign Key | Cascade Behavior |
|--------|-------|-------------|-------------|------------------|
| User | Comment | 1:N | Comment.userId | CASCADE |
| User | Category | 1:N | Category.userId | CASCADE |
| User | Tag | 1:N | Tag.userId | CASCADE |
| User | Attachment | 1:N | Attachment.userId | CASCADE |
| User | Settings | 1:1 | Settings.userId (unique) | CASCADE |
| User | Feedback | 1:N | Feedback.userId | NOT SPECIFIED |
| Category | Comment | 1:N | Comment.categoryId (nullable) | SET NULL |
| Comment | HotkeyMapping | 1:N | HotkeyMapping.commentId | CASCADE |

### Many-to-Many Relationships: 1

| Entity A | Entity B | Junction Table | Status |
|----------|----------|----------------|--------|
| Comment | Tag | CommentTag | ORPHANED (no API) |

**Junction Table Details**:
- Primary Key: [commentId, tagId] - Prevents duplicates
- Additional Field: userId (redundant but indexed)
- Index: [userId, tagId]

### Orphaned Relationships

**CommentTag Junction**:
- Schema exists with proper foreign keys and cascade behaviors
- No API endpoints to create/read/delete associations
- Tag creation endpoint requires commentId but doesn't use it (TODO comment at tagController.js:50-51)

**HotkeyMapping**:
- Schema exists with foreign keys to User and Comment
- No API routes exist
- No controller exists
- Complete feature gap

## Constraint Documentation

### Unique Constraints: 6

| Table | Fields | Scope | Purpose |
|-------|--------|-------|---------|
| User | email | Global | One email per system |
| Category | [userId, name] | Per user | Category names unique per user |
| Tag | [userId, name] | Per user | Tag names unique per user |
| CommentTag | [commentId, tagId] | Global | Prevent duplicate tag assignments |
| HotkeyMapping | [userId, hotkey] | Per user | One hotkey mapping per user |
| Settings | userId | Global | One settings record per user |

### Indexes: 5

| Table | Fields | Type | Purpose |
|-------|--------|------|---------|
| Comment | userId | Single | Foreign key lookup |
| Comment | categoryId | Single | Foreign key lookup |
| Category | userId | Single | Foreign key lookup |
| CommentTag | [userId, tagId] | Composite | User-scoped tag queries |
| Attachment | userId | Single | Foreign key lookup |

**Missing Indexes** (potential performance gaps):
- Comment.isFavourite - Frequently filtered field
- Comment.createdAt - Used for ordering
- Tag.name - User-scoped name searches
- Feedback.userId - Foreign key without index
- HotkeyMapping.hotkey - Lookup by hotkey string

---

## Cascade Delete Behaviors (Complete Matrix)

### When User is Deleted

| Related Table | Behavior | Schema Line | Orphaned Records |
|---------------|----------|-------------|------------------|
| Comment | CASCADE | 38 | None |
| Category | CASCADE | 87 | None |
| Tag | CASCADE | 63 | None |
| CommentTag | CASCADE | 77 | None |
| Attachment | CASCADE | 106 | R2 files remain |
| HotkeyMapping | CASCADE | 124 | None |
| Settings | CASCADE | 142 | None |
| Feedback | NOT SPECIFIED | 134 | Depends on DB config |

**Critical Observation**: User deletion cascades to ALL owned records EXCEPT Feedback (behavior undefined at schema level).

**R2 Storage Leak**: When User or Attachment deleted, R2 files remain (no cleanup trigger).

### When Category is Deleted

| Affected Table | Behavior | Schema Line | Result |
|----------------|----------|-------------|--------|
| Comment | SET NULL | 40 (implicit) | categoryId becomes null |
| Category (other) | REORDERED | N/A | Via categoryService.js:62-74 transaction |

**Observation**: Category deletion does NOT delete comments. Comments become uncategorized.

### When Comment is Deleted

| Related Table | Behavior | Schema Line |
|---------------|----------|-------------|
| CommentTag | CASCADE | 75 |
| HotkeyMapping | CASCADE | 125 |

### When Tag is Deleted

| Related Table | Behavior | Schema Line |
|---------------|----------|-------------|
| CommentTag | CASCADE | 76 |

**Observation**: Deleting a tag removes all comment-tag associations (if any existed).

---

## Data Type Usage

### String Types

| Usage | Tables | Constraints |
|-------|--------|-------------|
| CUID (IDs) | All tables | 25 char, collision-resistant |
| Email | User | Unique constraint |
| Text (unconstrained) | Most string fields | No max length at DB |
| VarChar(1024) | Comment.body | Enforced at DB level |

**Observation**: Only Comment.body has database-level length constraint. All other strings rely on application validation.

### Numeric Types

| Field | Type | Usage | Range |
|-------|------|-------|-------|
| order (Category) | Int | Sequential ordering | 1, 2, 3... |
| order (Comment) | Int | UNUSED | Always 0 |
| useCount (Comment) | Int | UNUSED | Always 0 |
| fileSize (Attachment) | Int | Size in bytes | ~2GB max |

### JSON Types

| Field | Table | Usage | Validation |
|-------|-------|-------|------------|
| keywords | Comment | UNUSED | Always null |
| settings | Settings | Free-form config | None |

**Observation**: Both JSON fields have no schema validation. Settings accepts any structure.

### DateTime Types

All models use:
- `createdAt: DateTime @default(now())` - Auto-set on creation
- `updatedAt: DateTime @updatedAt` - Auto-updated on modification

**Exceptions** (no updatedAt):
- Tag (line 60) - Tags are immutable
- Feedback (line 136) - Feedback is immutable

**Nullable DateTime**:
- Comment.lastUsedAt - UNUSED, always null

### Boolean Types

| Field | Table | Default | Usage |
|-------|-------|---------|-------|
| isFavourite | Comment | false | Actively used |
| isActive | HotkeyMapping | true | ORPHANED table |

---

## Unused Field Analysis (Cross-Referenced with API Baseline)

### Category: UNUSED FIELDS

**Comment Table**: 4 of 12 fields unused (33%)

1. **Comment.order** (schema.prisma:43)
   - Definition: `Int @default(0)`
   - Usage: NONE
   - Evidence: commentService.js:7 uses `orderBy: { createdAt: 'desc' }`
   - Always remains: 0
   - Cross-reference: API baseline line 236-241

2. **Comment.useCount** (schema.prisma:44)
   - Definition: `Int @default(0)`
   - Usage: NONE
   - Evidence: No code in /webapp, /api, or /extension updates this value
   - Always remains: 0
   - Cross-reference: Acceptance criteria lines 163-167, API baseline lines 242-246

3. **Comment.lastUsedAt** (schema.prisma:45)
   - Definition: `DateTime?`
   - Usage: NONE
   - Evidence: No code in /webapp, /api, or /extension updates this value
   - Always remains: null
   - Cross-reference: Acceptance criteria lines 163-167, API baseline lines 247-252

4. **Comment.keywords** (schema.prisma:46)
   - Definition: `Json?`
   - Usage: NONE
   - Evidence: No code sets this value
   - Always remains: null
   - Purpose: Unknown
   - Cross-reference: API baseline lines 253-257

### Impact Assessment

**Storage Impact**:
- 4 unused fields per comment record
- Int fields: 4 bytes each
- DateTime: 8 bytes
- Json: Variable (null = minimal)
- Estimated waste per comment: ~20 bytes

**Query Impact**:
- Unused fields are selected in all queries
- Transferred over network on every GET request
- Increase payload size

**Maintenance Impact**:
- Schema drift between definition and usage
- Confusion for new developers
- API contract includes fields that have no behavior

---

## Orphaned Features (Schema Exists, No API)

### 1. HotkeyMapping Table (Complete Orphan)

**Schema Status**: ACTIVE (lines 116-128)
**API Status**: NONE
**Evidence**:
- No routes file: /api/src/routes/hotkey.js does NOT exist
- No controller: /api/src/controllers/hotkeyController.js does NOT exist
- No service: /api/src/services/hotkeyService.js does NOT exist

**Schema Details**:
- 5 fields defined
- 2 foreign keys (User, Comment)
- 1 unique constraint [userId, hotkey]
- Full cascade behaviors on User/Comment deletion

**Implication**:
- Table likely has no data
- Feature was planned but never implemented
- Schema migration exists but no application code

### 2. CommentTag Junction Table (Partial Orphan)

**Schema Status**: ACTIVE (lines 69-81)
**API Status**: INCOMPLETE
**Evidence**:
- Tag creation endpoint exists: POST /api/tag
- Tag endpoint requires commentId in request body (tagController.js:45)
- **CommentTag row is NOT created** (tagController.js:50-51 TODO comment)

**TODO Comment** (tagController.js:50-51):
```javascript
// TODO - This will also need to create a CommentTag row
// to associate the tag with the comment
```

**Schema Details**:
- Composite primary key [commentId, tagId]
- 3 foreign keys (Comment, Tag, User)
- Full cascade behaviors
- Index on [userId, tagId]

**Implication**:
- Tags can be created but are orphaned (not linked to comments)
- Junction table likely has no data
- Feature partially implemented then abandoned

### 3. Rubric Models (Commented Out)

**Schema Status**: COMMENTED OUT (lines 148-175)
**Purpose**: Future feature for rubric-based grading

**Models Defined**:
- RubricCriteria
- CommentRubricCriteria (junction table)

**Implication**:
- Feature planned but not started
- Schema design exists as documentation
- No database tables created

---

## Field Naming Inconsistencies

### Spelling Variations

**isFavourite** (UK spelling):
- Field name: `isFavourite` (schema.prisma:42)
- Frontend often uses "favorite" (US spelling)
- API endpoints use "favourite": PUT /api/comment/{commentId}/user/{userId}/favourite
- Inconsistent across codebase

### Case Conventions

**camelCase** (standard):
- Most fields: userId, categoryId, createdAt, etc.

**Proper case fields**:
- Comment (line 17) - Relation name
- Attachment (line 19) - Relation name
- Tag (line 25) - Relation name
- CommentTag (line 27) - Relation name
- HotkeyMapping (line 29) - Relation name
- Settings (line 31) - Relation name
- Feedback (line 23) - Relation name

**Observation**: Relation names use proper case, field names use camelCase (standard Prisma convention).

---

## Default Values

### Timestamp Defaults

All models with timestamps:
- `createdAt: @default(now())` - Auto-set to current time
- `updatedAt: @updatedAt` - Auto-updated on modification

### Field Defaults

| Field | Table | Default | Usage |
|-------|-------|---------|-------|
| isFavourite | Comment | false | Actively used |
| order | Comment | 0 | UNUSED |
| useCount | Comment | 0 | UNUSED |
| isActive | HotkeyMapping | true | ORPHANED table |

### ID Defaults

All tables: `@id @default(cuid())`
- CUID (Collision-resistant Unique ID)
- ~25 characters
- URL-safe
- Sortable by creation time

---

## Missing Indexes (Performance Observations)

Based on query patterns observed in API baseline:

### High-Priority Missing Indexes

1. **Comment.isFavourite**
   - Frequently filtered (dashboard queries, favorite comments)
   - No index defined
   - Full table scan on user favorite queries

2. **Comment.createdAt**
   - Used for default ordering (commentService.js:7)
   - No index defined
   - Every comment query performs sort without index

3. **Feedback.userId**
   - Foreign key without index
   - Used in GET /api/feedback/user/{userId}
   - Full table scan on user-scoped queries

### Medium-Priority Missing Indexes

4. **Tag.name**
   - User-scoped name searches (if implemented)
   - Unique constraint exists but no standalone index

5. **HotkeyMapping.hotkey**
   - Lookup by hotkey string (if feature were active)
   - Unique constraint exists but table is orphaned

### Existing Indexes (Defined)

- Comment: userId, categoryId (lines 52-53)
- Category: userId (line 95)
- CommentTag: [userId, tagId] (line 80)
- Attachment: userId (line 113)

**Observation**: Most indexes are on foreign keys. No indexes on commonly filtered or sorted fields.

---

## Data Integrity Observations

### Strong Integrity

**Foreign Key Constraints**: All relationships use explicit @relation with fields/references
**Cascade Behaviors**: Explicitly defined for all critical relationships
**Unique Constraints**: Prevent duplicate emails, category names, tag names
**Primary Keys**: CUID on all tables (collision-resistant)
**Database-Level Constraints**: Comment.body VarChar(1024) enforced by MySQL

### Weak Integrity

**Missing Foreign Key Index**: Feedback.userId has no index (performance risk)
**Undefined Cascade**: Feedback.user relation has no onDelete behavior (database default applies)
**R2 Storage Orphans**: Attachment deletion doesn't clean up R2 files
**No Validation**: Settings.settings JSON has no schema validation
**Nullable Fields**: Many optional fields could be constrained with defaults

### Application-Level Validation

Schema relies on application code for:
- Email format validation
- Comment body length (also enforced at DB)
- File upload type validation (currently missing)
- Settings structure validation (currently missing)
- Hotkey format validation (feature orphaned)

**Observation**: Database enforces minimal constraints. Most validation is delegated to application layer.

---

## Schema Evolution Observations

### Migration Comments (schema.prisma:10-12)

```prisma
//UPDATE THE DB AND PRISMA CLIENT
//npx prisma generate
//npx prisma db push
```

**Observation**: Uses `prisma db push` (schema sync) rather than `prisma migrate` (versioned migrations).

**Implication**:
- No migration history
- Cannot rollback schema changes
- Development-only workflow (not production-safe)

### Incomplete Features (Evidence of Evolution)

1. **Rubric Models** (commented out with TODO)
   - Feature designed but deferred
   - Schema preserved as documentation

2. **Tag System** (partially implemented)
   - Tag CRUD exists
   - CommentTag junction never populated
   - TODO comment indicates awareness of gap

3. **HotkeyMapping** (schema exists, no implementation)
   - Full schema definition
   - Zero implementation
   - Suggests planning but no execution

4. **Unused Fields** (defined but never used)
   - Comment.order, useCount, lastUsedAt, keywords
   - Suggests original design included features later abandoned
   - Fields never removed from schema

**Pattern**: Schema accumulates features faster than implementation. Cleanup is deferred or forgotten.

---

## Database Provider Specifics

**Provider**: MySQL (schema.prisma:6)

**MySQL-Specific Behaviors**:
- VarChar(1024) constraint on Comment.body (line 37)
- Cascade delete behavior follows MySQL conventions
- Index types determined by MySQL (likely BTREE)
- CUID storage as VARCHAR(25)

**Observations**:
- No MySQL-specific features used (JSON type is standard SQL)
- No stored procedures or triggers defined in schema
- No full-text indexes (search not implemented)
- No partitioning or sharding considerations

---

## Comparison to API Baseline

Cross-referencing with `/ai/features/system-baseline/04-api-baseline.md`:

### Confirmed Unused Fields

All findings match API baseline documentation:
- Comment.order - Confirmed unused (API baseline lines 236-241)
- Comment.useCount - Confirmed unused (API baseline lines 242-246)
- Comment.lastUsedAt - Confirmed unused (API baseline lines 247-252)
- Comment.keywords - Confirmed unused (API baseline lines 253-257)

### Confirmed Cascade Behaviors

All cascade behaviors match acceptance criteria:
- User deletion cascades documented (API baseline lines 276-285)
- Category deletion sets NULL documented (API baseline lines 261-270)
- Comment deletion cascades documented (API baseline lines 261-264)

### Confirmed Orphaned Features

- HotkeyMapping table orphaned (API baseline lines 485-489)
- CommentTag junction incomplete (API baseline lines 491-495)
- Attachment DELETE missing (API baseline lines 479-484)

**Verification**: No discrepancies found between schema analysis and API baseline.

---

## Completion Statement

This data model baseline is **complete** according to the requirements:

- All tables documented with complete field inventories
- All relationships documented with cardinality and cascade behaviors
- All constraints documented (unique, foreign key, indexes)
- All unused fields identified and cross-referenced
- All orphaned features documented
- Quirks and inconsistencies explicitly noted
- No schema improvements proposed
- No missing indexes added
- Reality documented as-is

**This is a BASELINE, not a design specification.**

All schema elements, including unused fields and orphaned tables, are documented exactly as they exist. This document serves as the authoritative record of the database schema's current state.

---

## Output Files Generated

1. **Entity Relationship Diagram**
   - Location: `/ai/artifacts/data-model/erd.mmd`
   - Format: Mermaid ERD syntax
   - Content: Complete schema visualization with all tables, fields, relationships, and constraints
   - Includes notes on unused fields and orphaned features

2. **This Baseline Document**
   - Location: `/ai/features/system-baseline/05-data-baseline.md`
   - Format: Structured Markdown
   - Content: Complete data model analysis with methodology, table inventory, relationship documentation, constraint analysis, and cross-references to API baseline

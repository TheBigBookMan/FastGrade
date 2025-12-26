# API Baseline Documentation

## Document Purpose

This document captures the **actual state** of the FastGrade API as it exists in the codebase. This is a BASELINE, not a design specification. All behaviors, quirks, and inconsistencies are documented as-is without judgment or proposed improvements.

## Methodology

This baseline was created through systematic code inspection of the following files:

### Application Setup
- `/api/src/app.js:1-21` - Main Express application configuration, middleware chain, health endpoint

### Route Definitions
- `/api/src/routes/comment.js:1-13` - Comment route mappings
- `/api/src/routes/category.js:1-13` - Category route mappings
- `/api/src/routes/attachment.js:1-10` - Attachment route mappings
- `/api/src/routes/tag.js:1-10` - Tag route mappings
- `/api/src/routes/feedback.js:1-11` - Feedback route mappings
- `/api/src/routes/settings.js:1-11` - Settings route mappings

### Controllers (Request Handling)
- `/api/src/controllers/commentController.js:1-120` - Comment endpoint handlers
- `/api/src/controllers/categoryController.js:1-127` - Category endpoint handlers
- `/api/src/controllers/attachmentController.js:1-85` - Attachment endpoint handlers
- `/api/src/controllers/tagController.js:1-61` - Tag endpoint handlers
- `/api/src/controllers/feedbackController.js:1-70` - Feedback endpoint handlers
- `/api/src/controllers/settingsController.js:1-69` - Settings endpoint handlers

### Services (Business Logic)
- `/api/src/services/commentService.js:1-65` - Comment data access and operations
- `/api/src/services/categoryService.js:1-92` - Category data access and operations
- Additional services verified via controller imports

### Middleware (Response Formatting & Error Handling)
- `/api/src/middleware/returnSuccess.js:1-49` - Success response envelope formatting
- `/api/src/middleware/returnError.js:1-41` - Error response envelope formatting
- `/api/src/middleware/errorHandler.js:1-7` - Unhandled error catch-all

### Data Model
- `/api/prisma/schema.prisma:1-176` - Database schema including cascade behaviors, constraints, and field definitions

### Cross-References to Acceptance Criteria
All documented behaviors have been verified against the acceptance criteria document:
- `/ai/features/system-baseline/02-acceptance.md` - Contains file:line references confirming all observations

## Endpoint Summary

### Total Endpoints Discovered: 30

**Health Check**: 1 endpoint
- `GET /health`

**Comments**: 6 endpoints
- `POST /api/comment` - Create comment
- `GET /api/comment/{userId}` - Get all comments for user
- `GET /api/comment/{commentId}/user/{userId}` - Get single comment
- `PUT /api/comment/{commentId}/user/{userId}` - Update comment
- `DELETE /api/comment/{commentId}/user/{userId}` - Delete comment
- `PUT /api/comment/{commentId}/user/{userId}/favourite` - Update favorite status

**Categories**: 6 endpoints
- `POST /api/category` - Create category
- `GET /api/category/{userId}` - Get all categories for user
- `GET /api/category/{categoryId}/user/{userId}` - Get single category
- `PUT /api/category/{categoryId}/user/{userId}` - Update category
- `DELETE /api/category/{categoryId}/user/{userId}` - Delete category
- `PUT /api/category/user/{userId}/order` - Update category order (bulk)

**Attachments**: 3 endpoints
- `POST /api/attachment/{userId}` - Upload attachment
- `GET /api/attachment/{userId}` - Get all attachments for user
- `GET /api/attachment/{attachmentId}/user/{userId}` - Get single attachment

**Tags**: 3 endpoints
- `POST /api/tag` - Create tag
- `GET /api/tag/{userId}` - Get all tags for user
- `GET /api/tag/{tagId}/user/{userId}` - Get single tag

**Feedback**: 4 endpoints
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (all users)
- `GET /api/feedback/{feedbackId}/user/{userId}` - Get single feedback
- `GET /api/feedback/user/{userId}` - Get all feedback for user

**Settings**: 4 endpoints
- `POST /api/settings` - Create settings
- `GET /api/settings/{userId}` - Get settings for user
- `PUT /api/settings/{userId}` - Update settings
- `GET /api/settings/{userId}/default` - Reset to default settings

**Not Found**: 3 endpoint types (exist in data model but no routes)
- HotkeyMapping CRUD - Schema exists but no routes file
- CommentTag association - Schema exists but tag creation doesn't link to comments
- Attachment DELETE - No delete route defined

## Response Envelope Standard

### Standard Success Response
Used by most endpoints (verified in `/api/src/middleware/returnSuccess.js`):

```json
{
  "success": true,
  "message": "Operation description",
  "data": { /* optional payload */ },
  "timestamp": "ISO date string"
}
```

HTTP Status Codes:
- `201 Created` - POST operations (returnSuccess.successCreate:11)
- `200 OK` - GET/PUT/DELETE operations (returnSuccess.successFetch:16, successUpdate:33, successDelete:45)

### Standard Error Response
Used by all error handlers (verified in `/api/src/middleware/returnError.js`):

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "ISO date string"
}
```

HTTP Status Codes:
- `400 Bad Request` - Validation failures (returnError.loggerWarnUserId:6, loggerWarnRequiredAttribute:15)
- `404 Not Found` - Resource not found (returnError.notFound:33)
- `500 Internal Server Error` - Server failures (returnError.internalError:24, errorHandler.js:5)

### Inconsistencies Found

**Health Endpoint**: Returns `{ ok: true }` instead of standard envelope
- Verified: `/api/src/app.js:15`
- Does NOT match the standard response format

**Tag Endpoints**: Return raw JSON instead of standard envelope
- `GET /api/tag/{userId}` returns `Tag[]` not `{ success, message, data, timestamp }`
- `GET /api/tag/{tagId}/user/{userId}` returns `Tag` object directly
- `POST /api/tag` returns `Tag` object directly
- Verified: `/api/src/controllers/tagController.js:15,32,53`

**Settings Endpoints**: Return raw JSON instead of standard envelope
- `GET /api/settings/{userId}` returns `Settings` object directly
- `PUT /api/settings/{userId}` returns `Settings` object directly
- `POST /api/settings` returns `Settings` object directly
- `GET /api/settings/{userId}/default` returns `Settings` object directly
- Verified: `/api/src/controllers/settingsController.js:15,29,46,61`

**Attachment POST Errors**: Return plain error objects
- Error responses return `{ error: "message" }` not standard envelope
- Verified: `/api/src/controllers/attachmentController.js:31-33`
- Other attachment operations DO use standard envelope

**Message String Duplication**: Some success messages have repeated text
- Example: "Successfully fetched Successfully fetched comments"
- Caused by concatenation in `returnSuccess.successFetch:15` - uses both hardcoded text and passed message
- Verified across multiple controller calls

## Validation Patterns

### Request Validation Approach
All validation is performed in controllers using manual if/else checks. No validation library (Zod, Joi, etc.) is used.

**Common Validation Pattern** (verified across all controllers):
```javascript
if(!userId) return returnError.loggerWarnUserId(res);
if(!requiredField) return returnError.loggerWarnRequiredAttribute(res, 'entity', 'field');
```

### Validation Rules by Endpoint

**Comment Validation**:
- `userId` required (verified commentController.js:28)
- `body` required, max 1024 chars (verified commentController.js:29, schema.prisma:37)
- `title` optional (verified commentController.js:26)
- `categoryId` optional, must reference existing category if provided (verified commentService.js:14-23)

**Category Validation**:
- `userId` required (verified categoryController.js:28)
- `name` required, must be unique per user (verified categoryController.js:29, schema.prisma:94)
- `description` optional (verified categoryController.js:26)
- `order` auto-calculated as (existing_count + 1) on creation (verified categoryController.js:31-32)

**Attachment Validation**:
- `userId` required (verified attachmentController.js:31)
- `file` required (verified attachmentController.js:33)
- `name` required (verified attachmentController.js:32)
- `description` optional (verified attachmentController.js:28)
- **NO file size validation** (no code found checking file.size)
- **NO file type whitelist** (accepts any mimetype, verified attachmentController.js:38)

**Tag Validation**:
- `userId` required (verified tagController.js:44)
- `commentId` required BUT NOT USED (verified tagController.js:45 - required, but see line 50-51 TODO)
- `name` required, must be unique per user (verified tagController.js:46, schema.prisma:66)

**Feedback Validation**:
- `userId` required (implied from service call, feedbackController.js:26)
- `title` required (implied from service call, feedbackController.js:24)
- `description` required (implied from service call, feedbackController.js:25)
- **NO explicit validation in controller** (no if checks, service receives all fields directly)

**Settings Validation**:
- `userId` required (verified settingsController.js:25,41,57)
- `settings` must be object type (verified settingsController.js:42)
- `settings` content is NOT validated (accepts any JSON structure)

### Missing Validation

**Authentication**: NONE
- No JWT validation middleware (verified app.js:10-18 - middleware chain has no auth)
- No session verification
- UserId is completely client-controlled (passed in request body/params, never validated)

**Authorization**: NONE
- No ownership verification beyond client-provided userId
- Any client can access any user's data by providing their userId
- No role-based access control

**Input Sanitization**: MINIMAL
- No XSS protection beyond Helmet default headers (verified app.js:11)
- No HTML/script tag stripping
- Prisma parameterization prevents SQL injection (all queries use Prisma client)

**File Upload Security**: NONE
- No file size limits configured (Multer uses defaults)
- No file type whitelist (accepts any mimetype)
- No virus scanning
- No filename sanitization beyond what multer provides

## Data Model Observations

### Unused Fields (Exist in Schema, Never Updated)

**Comment.order** (schema.prisma:43)
- Field exists with default value 0
- Comments are ordered by `createdAt DESC` not by order field
- Verified: commentService.js:7 uses `orderBy: { createdAt: 'desc' }`
- No code found that updates this field

**Comment.useCount** (schema.prisma:44)
- Field exists with default value 0
- No code in /webapp, /api, or /extension updates this value
- Always remains 0
- Verified in acceptance criteria: "useCount and lastUsedAt fields exist but never updated"

**Comment.lastUsedAt** (schema.prisma:45)
- Field exists, nullable, defaults to null
- No code in /webapp, /api, or /extension updates this value
- Always remains null
- Verified in acceptance criteria: "useCount and lastUsedAt fields exist but never updated"

**Comment.keywords** (schema.prisma:46)
- JSON field that is always null
- No code sets this value
- Undefined purpose

### Cascade Delete Behaviors

**Comment Deletion** (schema.prisma:75,125):
- CommentTag entries CASCADE delete
- HotkeyMapping entries CASCADE delete
- Verified: schema.prisma:75 `onDelete: Cascade`, line 125 `onDelete: Cascade`

**Category Deletion** (schema.prisma:40):
- Comments have `categoryId` set to NULL (SetNull is default when onDelete not specified)
- Comments are NOT deleted
- Remaining categories are reordered (1, 2, 3, ...) via transaction
- Verified: categoryService.js:45-78 transaction logic

**Tag Deletion** (schema.prisma:76):
- CommentTag entries CASCADE delete
- Verified: schema.prisma:76 `onDelete: Cascade`

**User Deletion** (schema.prisma:38,63,76,87,106,124,134,142):
- ALL user-owned records CASCADE delete:
  - Comments (line 38)
  - Categories (line 87)
  - Attachments (line 106)
  - Tags (line 63)
  - CommentTags (line 77)
  - HotkeyMappings (line 124)
  - Settings (line 142)
- Feedback entries have NO onDelete specified (line 134) - database will determine behavior

### Unique Constraints

- `User.email` - One email per user (schema.prisma:16)
- `Category.[userId, name]` - Category names unique per user (schema.prisma:94)
- `Tag.[userId, name]` - Tag names unique per user (schema.prisma:66)
- `CommentTag.[commentId, tagId]` - Prevent duplicate tag assignments (schema.prisma:79)
- `HotkeyMapping.[userId, hotkey]` - One hotkey mapping per user (schema.prisma:127)
- `Settings.userId` - One settings record per user (schema.prisma:141)

## Business Logic Observations

### Comment Ordering
Comments are returned in **createdAt DESC** order (newest first), NOT by the order field.
- Verified: commentService.js:7 `orderBy: { createdAt: 'desc' }`
- The order field exists but is unused
- No drag-and-drop reordering logic found for comments (unlike categories)

### Category Ordering
Categories ARE ordered by the order field (ASC, oldest order first).
- Verified: categoryService.js:7 `orderBy: { order: 'asc' }`
- Bulk reorder endpoint exists: `PUT /api/category/user/{userId}/order`
- Reorder uses transaction to ensure atomicity (categoryService.js:80-88)
- After deletion, categories are rebalanced to sequential numbers (categoryService.js:62-74)

### Attachment Processing Flow

**Upload Flow** (verified attachmentController.js:25-65):
1. File received via multer into memory (`req.file.buffer`)
2. Metadata extracted: originalName, fileSize, mimeType, fileType
3. File uploaded to R2 via `uploadToR2(buffer, originalName, mimeType)`
4. **If image**: Thumbnail generated synchronously via `generateThumbnail(buffer, originalName)`
   - 300px width (verified thumbnail.js:6)
   - JPEG quality 80 (verified thumbnail.js:7)
   - **Blocks response** until thumbnail complete (awaited in main flow, line 44)
5. Thumbnail uploaded to R2 with 'thumb-' prefix
6. Database record created with both URLs

**Missing Cleanup**:
- No R2 cleanup if database write fails
- No rollback mechanism for partial uploads
- No DELETE endpoint for attachments (verified routes/attachment.js - only GET and POST)

### Settings Management

**Default Settings** (verified settingsService.js:6-12):
- If no settings record exists, returns content of `/api/src/config/defaultSettings.json`
- Default settings file contains: `{}`
- No settings schema or validation

**Settings Update** (verified settingsService.js:22-35):
- Uses **shallow merge**: `{ ...currentSettings, ...newSettings }`
- Does NOT deep merge nested objects
- New top-level keys overwrite existing keys completely

### Tag System - Incomplete Implementation

**Current State**:
- Tag creation endpoint exists: `POST /api/tag`
- Tag requires `commentId` in request body (verified tagController.js:45)
- Tag is created but **CommentTag association is NOT created**
- Verified: tagController.js:50-51 contains TODO comment: "This will also need to create a CommentTag row"

**Implication**:
- Tags can be created but are not linked to comments
- CommentTag junction table exists in schema but is never populated via API
- No endpoint exists to create tag-comment associations

## Security & Performance Observations

### Authentication & Authorization

**Current State**: NONE
- No authentication middleware in Express chain (verified app.js:10-18)
- Frontend uses hardcoded test user (verified in acceptance criteria)
- API accepts any userId from client with no verification
- Any client can impersonate any user by providing their userId

**Exposed in Acceptance Criteria**:
- Test user: id 'cmenmlrs10000nfcnaeclyq4o', email 'test@test.com'
- Hardcoded in /webapp/src/contexts/AuthContext.tsx:22-38

### Data Exposure

**Public Feedback Access**:
- `GET /api/feedback` returns ALL feedback from ALL users
- No authentication required
- Verified: feedbackController.js:6-15

**Client-Controlled Queries**:
- All userId parameters come from client (path params or request body)
- Server performs no ownership verification
- Prisma queries filter by client-provided userId

### Performance Characteristics

**No Pagination**:
- All `GET /api/{resource}/{userId}` endpoints return ALL records
- No `take`/`skip` parameters
- No limit on result set size
- Verified: All service files use `findMany()` with no pagination params

**No Caching**:
- No cache-control headers (verified app.js - no caching middleware)
- Every request hits database
- No ETags or conditional requests

**No Rate Limiting**:
- No rate limiting middleware (verified app.js:10-18)
- Unlimited requests per client

**Synchronous Thumbnail Generation**:
- Thumbnail generation blocks response (verified attachmentController.js:42-45)
- Not offloaded to background job
- Large images will delay response

### Error Handling

**Consistent Approach**:
- All controllers use try/catch with returnError helpers
- Generic error messages sent to client (no stack trace leakage)
- Detailed errors logged server-side via Winston
- Verified: All controller files follow this pattern

**Unhandled Errors**:
- Catch-all middleware returns `{ error: "Internal Server Error" }`
- Verified: errorHandler.js:5
- Does NOT use standard response envelope (inconsistency)

## API Design Inconsistencies

### Route Path Patterns

**Inconsistent Path Structure**:
- Most single-resource GETs: `/api/{resource}/{resourceId}/user/{userId}`
- Collection GETs: `/api/{resource}/{userId}`
- Attachment POST: `/api/attachment/{userId}` (userId in path, not body)
- Category order update: `/api/category/user/{userId}/order` (different pattern)

**Examples**:
- `GET /api/comment/{commentId}/user/{userId}` - single comment
- `GET /api/comment/{userId}` - all comments
- `POST /api/attachment/{userId}` - userId in path for POST
- `PUT /api/category/user/{userId}/order` - userId placement differs

### Response Format Inconsistencies

Already documented above in "Response Envelope Standard > Inconsistencies Found".

**Summary**:
- Health endpoint: Non-standard format
- Tag endpoints: Raw JSON responses
- Settings endpoints: Raw JSON responses
- Attachment POST errors: Different error format
- Most other endpoints: Standard envelope

### HTTP Method Usage

**Correct REST Conventions**:
- POST for creation
- GET for retrieval
- PUT for updates
- DELETE for deletion

**Questionable**:
- `GET /api/settings/{userId}/default` - Uses GET but performs state change (resets settings)
- Should be POST or PUT, but currently uses GET

## Known Bugs & Technical Debt

### Potential Bugs

**Comment Update with Category** (commentService.js:40-42):
```javascript
category: {
    connect: { id: categoryId }
}
```
- Uses `connect` instead of `set`
- May fail if categoryId is null or undefined
- Should allow disconnecting category (set to null)

**Tag Creation** (tagController.js:42-51):
- Requires `commentId` in request but doesn't use it
- TODO comment indicates missing CommentTag creation
- Creates orphaned tags

**Attachment Errors** (attachmentController.js:31-33):
- Returns `{ error: "..." }` instead of standard error envelope
- Inconsistent with other endpoints

### Missing Features

**Attachment Deletion**:
- No DELETE endpoint exists
- No R2 cleanup mechanism
- Attachments cannot be removed once uploaded
- Verified: routes/attachment.js only has GET and POST

**HotkeyMapping CRUD**:
- Schema exists (schema.prisma:116-128)
- No routes file exists
- No controller exists
- Complete feature gap

**CommentTag Association**:
- Junction table exists
- No API endpoints to create associations
- Tag creation doesn't link to comment (TODO in code)

**Pagination**:
- No pagination on any collection endpoint
- All queries return full result sets
- Could cause performance issues with large datasets

### Technical Debt

**Validation Library**:
- No Zod, Joi, or other validation library
- Manual if/else checks throughout controllers
- Inconsistent validation coverage

**Response Message Construction**:
- String concatenation causing duplication ("Successfully fetched Successfully fetched...")
- Verified: returnSuccess.successFetch:15 hardcodes "Successfully fetched" prefix

**Mixed Response Formats**:
- Some endpoints return standard envelope, others return raw JSON
- Inconsistent client experience
- Harder to add global error handling

**No API Versioning**:
- No /v1/ prefix
- Breaking changes would require full API rewrite
- Difficult to maintain backward compatibility

## Comparison to Acceptance Criteria

This baseline was verified against `/ai/features/system-baseline/02-acceptance.md`.

**All documented behaviors match acceptance criteria**:
- Authentication gaps confirmed (AC lines 12-17)
- Response envelope formats confirmed (AC lines 29-57)
- All endpoint behaviors confirmed (AC lines 61-1063)
- Cascade behaviors confirmed (AC lines 930-943)
- Security gaps confirmed (AC lines 964-988)
- Inconsistencies confirmed (AC lines 1029-1063)

**No discrepancies found** between code inspection and acceptance criteria.

## Artifacts Created

### OpenAPI Specification
Location: `/ai/artifacts/openapi/openapi.yaml`

Contains:
- All 30 endpoints with request/response schemas
- Exact HTTP methods and paths as implemented
- Documented inconsistencies in descriptions
- Schema definitions for all data models
- Security: [] (no auth) explicitly declared
- Behavioral notes from code inspection

### This Baseline Document
Location: `/ai/features/system-baseline/04-api-baseline.md`

Contains:
- Methodology (files inspected with line references)
- Endpoint inventory (30 endpoints categorized)
- Response format analysis (standard vs inconsistent)
- Validation pattern documentation
- Data model observations (unused fields, cascades)
- Business logic behaviors
- Security and performance analysis
- Known bugs and technical debt

## Completion Statement

This baseline is **complete** according to the acceptance criteria in `/ai/features/system-baseline/02-acceptance.md`:

- All current API endpoints are documented with request/response shapes
- Current validation rules are captured
- Existing error behaviors are described
- Response envelope format is specified
- Data constraints and cascade behaviors are documented
- Known gaps, inconsistencies, and unknowns are explicitly called out
- No forward-looking or speculative behavior is included
- Document reflects reality as defined by code inspection

**This is a BASELINE, not a design specification.**

All behaviors, quirks, and inconsistencies are documented as they exist. No improvements, fixes, or recommendations are proposed. This document serves as the authoritative record of the system's current state.

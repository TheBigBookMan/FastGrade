# Acceptance Criteria - System Baseline

## Scope
This document defines the **current behavioral contract** of the FastGrade API as it exists today.
All endpoints, response formats, and error behaviors documented here represent the system's actual implementation.

This is NOT a specification for new features - it captures what must continue to work exactly as it does now.

## Preconditions

### Authentication
**Verified - Hardcoded Authentication Only**:
- **API Middleware**: Verified in /api/src/app.js:10-18 - No authentication middleware (only httpLogger, helmet, cors, express.json)
- **Frontend Login**: Verified in /webapp/src/contexts/AuthContext.tsx:22-38 - Hardcoded user object always returns same test user
- **Test User Credentials**: Verified in /webapp/src/contexts/AuthContext.tsx:23-24,36-37 - id: 'cmenmlrs10000nfcnaeclyq4o', email: 'test@test.com'
- **Request Handling**: userId is passed in request body or path params with no server-side validation (verified across all controllers)

### Data State
- MySQL database must be running and accessible
- Prisma schema must be migrated to latest version
- Cloudflare R2 bucket must be configured and accessible for file uploads

### Environment Variables Required
- `DATABASE_URL` - MySQL connection string
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` - R2 credentials

## Response Envelope Standard

**Verified in /api/src/middleware/returnSuccess.js and /api/src/middleware/returnError.js**:

All successful responses follow this pattern:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { /* payload - optional */ },
  "timestamp": "ISO date string"
}
```

All error responses follow this pattern (verified /api/src/middleware/returnError.js:4-38):
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "ISO date string"
}
```

HTTP status codes (verified in returnSuccess.js and returnError.js):
- `200 OK` - Successful GET/PUT/DELETE (returnSuccess.successFetch, successUpdate, successDelete)
- `201 Created` - Successful POST (returnSuccess.successCreate:11)
- `400 Bad Request` - Validation failure (returnError.loggerWarnUserId:6, loggerWarnRequiredAttribute:15)
- `404 Not Found` - Resource not found (returnError.notFound:33)
- `500 Internal Server Error` - Server failure (returnError.internalError:24, /api/src/middleware/errorHandler.js:5)

**Note**: Health endpoint returns non-standard format: `{ ok: true }` (verified /api/src/app.js:15)

---

## API Endpoint Specifications

### Health Check

#### `GET /health`

**Purpose**: Verify API is running

**Request**: None

**Response (200 OK)**:
```json
{
  "success": true,
  "data": { "status": "ok" },
  "message": "Operation succeeded"
}
```

**Error Cases**: None documented

---

## Comment Endpoints

### Create Comment

#### `POST /api/comment`

**Purpose**: Create new feedback comment

**Request Body**:
```json
{
  "userId": "string (required)",
  "title": "string (optional)",
  "body": "string (required, max 1024 chars)",
  "categoryId": "string (optional)",
  "isFavourite": "boolean (optional, defaults to false)",
  "order": "number (optional)"
}
```

**Validation Rules**:
- `userId` must be provided
- `body` is required, maximum 1024 characters
- `title` is optional
- `categoryId` if provided must reference existing category
- New comments auto-initialize: `useCount=0`, `lastUsedAt=null`, `keywords=null`

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string | null",
    "body": "string",
    "categoryId": "string | null",
    "isFavourite": false,
    "order": "number",
    "useCount": 0,
    "lastUsedAt": null,
    "keywords": null,
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: Missing userId or body
- `400 Bad Request`: Body exceeds 1024 characters
- `404 Not Found`: categoryId references non-existent category
- `500 Internal Server Error`: Database failure

---

### Get Comments

#### `GET /api/comment/:userId`

**Purpose**: Fetch all comments for a user

**Query Parameters**:
- `includeCategory` (optional, boolean, defaults to `true`) - Include category details in response

**Request**: None (userId from path)

**Response (200 OK)** with `includeCategory=true`:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "title": "string | null",
      "body": "string",
      "categoryId": "string | null",
      "isFavourite": "boolean",
      "order": "number",
      "useCount": "number",
      "lastUsedAt": "ISO date string | null",
      "keywords": "string (JSON) | null",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string",
      "category": {
        "id": "string",
        "name": "string",
        "description": "string | null",
        "order": "number"
      } | null
    }
  ],
  "message": "Operation succeeded"
}
```

**Response (200 OK)** with `includeCategory=false`:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "title": "string | null",
      "body": "string",
      "categoryId": "string | null",
      "isFavourite": "boolean",
      "order": "number",
      "useCount": "number",
      "lastUsedAt": "ISO date string | null",
      "keywords": "string (JSON) | null",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ],
  "message": "Operation succeeded"
}
```

**Behavior** (Verified in /api/src/services/commentService.js:4-12):
- Returns empty array `[]` if user has no comments (Prisma findMany returns empty array)
- Includes category details when includeCategories=true (line 9)
- Comments are ordered by createdAt DESC (line 7) - NOT by order field

**Error Cases**:
- `500 Internal Server Error`: Database failure

---

### Update Comment

#### `PUT /api/comment/:commentId`

**Purpose**: Update existing comment fields

**Request Body**:
```json
{
  "userId": "string (required)",
  "title": "string (optional)",
  "body": "string (optional, max 1024 chars)",
  "categoryId": "string (optional, can be null)",
  "isFavourite": "boolean (optional)",
  "order": "number (optional)",
  "useCount": "number (optional)",
  "lastUsedAt": "ISO date string (optional)"
}
```

**Validation Rules**:
- Only fields provided in request are updated
- `userId` must match comment owner
- `body` if provided must be ≤1024 characters
- `categoryId` can be set to `null` to uncategorize comment

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string | null",
    "body": "string",
    "categoryId": "string | null",
    "isFavourite": "boolean",
    "order": "number",
    "useCount": "number",
    "lastUsedAt": "ISO date string | null",
    "keywords": "string (JSON) | null",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: userId mismatch or validation failure
- `404 Not Found`: commentId does not exist
- `500 Internal Server Error`: Database failure

---

### Update Comment Favorite Status

#### `PUT /api/comment/:commentId/favourite`

**Purpose**: Toggle or set favorite status

**Request Body**:
```json
{
  "userId": "string (required)",
  "favourite": "boolean (required)"
}
```

**Validation Rules**:
- `userId` must match comment owner
- `favourite` must be boolean

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "isFavourite": "boolean"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: Missing userId or favourite
- `404 Not Found`: commentId does not exist
- `500 Internal Server Error`: Database failure

---

### Delete Comment

#### `DELETE /api/comment/:commentId`

**Purpose**: Permanently delete comment

**Request Body**:
```json
{
  "userId": "string (required)"
}
```

**Validation Rules**:
- `userId` must match comment owner
- Deletion is permanent (no soft delete)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "string (deleted comment ID)"
  },
  "message": "Operation succeeded"
}
```

**Behavior**:
- Associated CommentTag entries are cascade deleted
- No recovery mechanism exists

**Error Cases**:
- `400 Bad Request`: Missing userId
- `404 Not Found`: commentId does not exist
- `500 Internal Server Error`: Database failure

---

## Category Endpoints

### Create Category

#### `POST /api/category`

**Purpose**: Create new category for organizing comments

**Request Body**:
```json
{
  "userId": "string (required)",
  "name": "string (required)",
  "description": "string (optional)",
  "order": "number (optional)"
}
```

**Validation Rules**:
- `userId` and `name` are required
- `name` must be unique per user (composite unique constraint: [userId, name])
- `description` is optional
- `order` defaults to auto-increment if not provided

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "description": "string | null",
    "order": "number",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: Missing userId or name
- `400 Bad Request`: Duplicate category name for user
- `500 Internal Server Error`: Database failure

---

### Get Categories

#### `GET /api/category/:userId`

**Purpose**: Fetch all categories for a user

**Request**: None (userId from path)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "description": "string | null",
      "order": "number",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ],
  "message": "Operation succeeded"
}
```

**Behavior** (Verified in /api/src/services/categoryService.js:4-12):
- Returns empty array `[]` if user has no categories (Prisma findMany returns empty array)
- Categories are ordered by order field ASC (line 7)

**Error Cases**:
- `500 Internal Server Error`: Database failure

---

### Update Category

#### `PUT /api/category/:categoryId`

**Purpose**: Update category name or description

**Request Body**:
```json
{
  "userId": "string (required)",
  "name": "string (optional)",
  "description": "string (optional)"
}
```

**Validation Rules**:
- Only fields provided in request are updated
- `userId` must match category owner
- `name` if provided must maintain uniqueness per user

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "description": "string | null",
    "order": "number",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: userId mismatch or duplicate name
- `404 Not Found`: categoryId does not exist
- `500 Internal Server Error`: Database failure

---

### Update Category Order

#### `PUT /api/category/order`

**Purpose**: Reorder categories in bulk

**Request Body**:
```json
{
  "userId": "string (required)",
  "categoryIds": ["string", "string", ...] (required, array of category IDs in desired order)
}
```

**Validation Rules**:
- All categoryIds must belong to the specified userId
- Order is assigned based on array index (0-based)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "description": "string | null",
      "order": "number",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ],
  "message": "Operation succeeded"
}
```

**Behavior**:
- Transaction-based update ensures all-or-nothing success
- Returns updated categories in new order

**Error Cases**:
- `400 Bad Request`: Missing userId or categoryIds
- `400 Bad Request`: Category ownership mismatch
- `500 Internal Server Error`: Database failure or transaction rollback

---

### Delete Category

#### `DELETE /api/category/:categoryId`

**Purpose**: Delete category

**Request Body**:
```json
{
  "userId": "string (required)"
}
```

**Validation Rules**:
- `userId` must match category owner

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "string (deleted category ID)"
  },
  "message": "Operation succeeded"
}
```

**Behavior** (Verified in /api/prisma/schema.prisma:40 and /api/src/services/categoryService.js:45-78):
- Comments associated with this category have `categoryId` set to `null` (schema line 40: no onDelete specified, defaults to SetNull)
- No cascade delete of comments
- Category deletion triggers order rebalancing for remaining categories (categoryService.js:62-74)

**Error Cases**:
- `400 Bad Request`: Missing userId
- `404 Not Found`: categoryId does not exist
- `500 Internal Server Error`: Database failure

---

## Attachment Endpoints

### Upload Attachment

#### `POST /api/attachment`

**Purpose**: Upload file to R2 storage and create attachment record

**Request**: Multipart form data with fields:
- `file` (required) - File binary
- `userId` (required) - User ID string
- `name` (required) - Display name for file
- `description` (optional) - File description

**Request Format**:
```
Content-Type: multipart/form-data

file: [binary]
userId: "string"
name: "string"
description: "string (optional)"
```

**Processing** (Verified in /api/src/controllers/attachmentController.js:25-65):
1. File uploaded to memory via multer (req.file.buffer at line 29)
2. Metadata extracted: originalName (line 36), fileSize (line 37), mimeType (line 38), fileType (line 39)
3. File uploaded to R2 via uploadToR2 function (line 42) - generates key with timestamp prefix
4. If image (mimeType.startsWith("image/")), thumbnail generated via Sharp (lines 43-45)
5. Thumbnail uploaded to R2 with 'thumb-' prefix (verified /api/src/utils/upload/thumbnail.js:10)
6. Database record created with both URLs (lines 48-58)

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "originalName": "string",
    "fileType": "string (file extension)",
    "fileSize": "number (bytes)",
    "mimeType": "string",
    "description": "string | null",
    "url": "string (R2 public URL)",
    "thumbnailUrl": "string | null (R2 thumbnail URL for images)",
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Behavior** (Verified):
- File kept in memory until R2 upload completes (multer memory storage, no disk write)
- Thumbnail generation is synchronous and blocks response (verified /api/src/controllers/attachmentController.js:42-45 - await in main flow)
- Thumbnail dimensions: 300px width (verified /api/src/utils/upload/thumbnail.js:6), auto height
- Thumbnail format: JPEG quality 80 (verified thumbnail.js:7)
- Non-image files have `thumbnailUrl: null` (verified attachmentController.js:43-45 - conditional)

**Error Cases**:
- `400 Bad Request`: Missing file, userId, or name (lines 31-33)
- `500 Internal Server Error`: R2 upload failure (caught in try/catch line 62-64)
- `500 Internal Server Error`: Thumbnail generation failure
- `500 Internal Server Error`: Database failure

**Not Implemented**:
- No file size limit configured (Multer uses defaults)
- No file type whitelist - accepts any mimetype
- No virus scanning
- No R2 cleanup on upload failure
- No attachment DELETE endpoint (verified /api/src/routes/attachment.js:1-10 - only GET and POST)

---

### Get Attachments

#### `GET /api/attachment/:userId`

**Purpose**: Fetch all attachments for a user

**Request**: None (userId from path)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "originalName": "string",
      "fileType": "string",
      "fileSize": "number",
      "mimeType": "string",
      "description": "string | null",
      "url": "string",
      "thumbnailUrl": "string | null",
      "createdAt": "ISO date string",
      "updatedAt": "ISO date string"
    }
  ],
  "message": "Operation succeeded"
}
```

**Behavior**:
- Returns empty array `[]` if user has no attachments (Prisma findMany default)
- Attachments are not sorted (no orderBy in query - database insertion order)

**Error Cases**:
- `500 Internal Server Error`: Database failure

---

## Tag Endpoints

### Create Tag

#### `POST /api/tag`

**Purpose**: Create new tag for comment organization

**Request Body**:
```json
{
  "userId": "string (required)",
  "name": "string (required)"
}
```

**Validation Rules**:
- `userId` and `name` are required
- `name` must be unique per user (composite unique constraint: [userId, name])

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "name": "string",
    "createdAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: Missing userId or name
- `400 Bad Request`: Duplicate tag name for user
- `500 Internal Server Error`: Database failure

**Note**: Tag creation endpoint exists but CommentTag association is not implemented (verified /api/src/controllers/tagController.js:50-51 - TODO comment indicates missing functionality)

---

### Get Tags

#### `GET /api/tag/:userId`

**Purpose**: Fetch all tags for a user

**Request**: None (userId from path)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "userId": "string",
      "name": "string",
      "createdAt": "ISO date string"
    }
  ],
  "message": "Operation succeeded"
}
```

**Behavior**:
- Returns empty array `[]` if user has no tags (Prisma findMany default)
- No association with comments in response (basic tag data only)

**Error Cases**:
- `500 Internal Server Error`: Database failure

---

## Feedback Endpoints

### Submit Feedback

#### `POST /api/feedback`

**Purpose**: Allow users to submit feedback about the application

**Request Body**:
```json
{
  "userId": "string (required)",
  "title": "string (required)",
  "description": "string (required)"
}
```

**Validation Rules**:
- All fields are required

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "description": "string",
    "createdAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Database failure

**Additional Endpoints** (Verified in /api/src/routes/feedback.js):
- `GET /api/feedback` - Fetch all feedback (controller: fetchAllFeedback at line 6)
- `GET /api/feedback/:feedbackId/user/:userId` - Fetch single feedback by user (line 8)
- `GET /api/feedback/user/:userId` - Fetch all feedback for user (line 9)

**Note**: No status field in Feedback model (verified /api/prisma/schema.prisma:130-137 - only id, title, description, userId, createdAt)

---

## Settings Endpoints

### Get Settings

#### `GET /api/settings/:userId`

**Purpose**: Fetch user settings

**Request**: None (userId from path)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "settings": {} | { /* user settings object */ },
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Behavior** (Verified in /api/src/services/settingsService.js:6-12):
- If user has no settings record, returns default settings from /api/src/config/defaultSettings.json (line 11)
- Current default settings file contains empty object `{}` (verified /api/src/config/defaultSettings.json:1)

**Error Cases**:
- `500 Internal Server Error`: Database failure

---

### Create Settings

#### `POST /api/settings`

**Purpose**: Create initial settings record for user

**Request Body**:
```json
{
  "userId": "string (required)",
  "settings": {} (required, object)
}
```

**Validation Rules**:
- `userId` must be unique (one settings record per user)
- `settings` must be valid JSON object

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "settings": {},
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Error Cases**:
- `400 Bad Request`: Missing userId or settings
- `400 Bad Request`: Duplicate userId (settings already exist)
- `500 Internal Server Error`: Database failure

---

### Update Settings

#### `PUT /api/settings/:userId`

**Purpose**: Merge new settings with existing settings

**Request Body**:
```json
{
  "settings": {} (required, object with partial or full settings)
}
```

**Validation Rules**:
- `settings` must be valid JSON object
- New settings are **merged** with existing (not replaced)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "settings": { /* merged settings */ },
    "createdAt": "ISO date string",
    "updatedAt": "ISO date string"
  },
  "message": "Operation succeeded"
}
```

**Behavior** (Verified in /api/src/services/settingsService.js:22-35):
- Uses shallow merge: `{ ...currentSettings, ...newSettings }` (line 24)
- Does not deep merge nested objects (spread operator only merges top level)

**Error Cases**:
- `400 Bad Request`: Missing or invalid settings
- `404 Not Found`: No settings record for userId
- `500 Internal Server Error`: Database failure

---

## Data Integrity & Constraints

### Unique Constraints
- `User.email` - Each email can only be used once
- `Category.[userId, name]` - Category names must be unique per user
- `Tag.[userId, name]` - Tag names must be unique per user
- `CommentTag.[commentId, tagId]` - Prevent duplicate tag assignments
- `HotkeyMapping.[userId, hotkey]` - Each hotkey can only be mapped once per user
- `Settings.userId` - One settings record per user

### Cascade Behaviors (Verified in /api/prisma/schema.prisma)
- **Comment deletion**: CommentTag entries cascade deleted (line 75: onDelete: Cascade), HotkeyMapping entries cascade deleted (line 125: onDelete: Cascade)
- **Category deletion**: Comments remain but categoryId set to null (line 40: no onDelete, defaults to SetNull)
- **Tag deletion**: CommentTag entries cascade deleted (line 76: onDelete: Cascade)
- **User deletion**: All user-owned records cascade delete:
  - Comments (line 38: onDelete: Cascade)
  - Categories (line 87: onDelete: Cascade)
  - Attachments (line 106: onDelete: Cascade)
  - Tags (line 63: onDelete: Cascade)
  - CommentTags (line 77: onDelete: Cascade)
  - HotkeyMappings (line 124: onDelete: Cascade)
  - Settings (line 142: onDelete: Cascade)
- **Feedback deletion**: No cascade (line 134: no onDelete specified)

### Foreign Key Constraints
- All `userId` references must point to valid User
- `Comment.categoryId` must point to valid Category or be null
- `CommentTag.commentId` must point to valid Comment
- `CommentTag.tagId` must point to valid Tag

---

## Performance Expectations

### Current Behavior (Verified)
- No pagination on any GET endpoints (verified all services use findMany without take/skip)
- All comments/categories/attachments fetched in single query (no batching)
- No query result limits (Prisma queries unconstrained)
- Thumbnail generation is synchronous and blocks response (verified /api/src/controllers/attachmentController.js:42-45)
- No caching headers (verified /api/src/app.js - no cache control middleware)
- No rate limiting (verified /api/src/app.js:10-18 - no rate limit middleware)

---

## Security Considerations (Verified)

### Current State (As-Is)
**Verified Security Gaps**:
- **Authentication middleware**: NONE (verified /api/src/app.js:10-18 - no auth middleware)
- **Authorization checks**: Client-provided userId only (verified all controllers - userId from req.body or req.params with no server-side validation)
- **CSRF protection**: None (no CSRF middleware in /api/src/app.js)
- **Rate limiting**: None (verified /api/src/app.js:10-18)
- **Input sanitization**: Minimal validation in controllers (if/else checks only, no Zod or validation library found)
- **SQL injection protection**: Prisma parameterization only (all queries use Prisma client, no raw SQL found)
- **XSS protection**: Helmet middleware enabled (/api/src/app.js:11) provides basic headers
- **File upload validation**: No type whitelist, no size limit, no virus scanning (verified /api/src/controllers/attachmentController.js)

### Authorization Pattern (Verified)
- **API trust model**: Completely trusts client-provided userId with no verification
- **Session verification**: None
- **JWT or token validation**: None
- **Frontend credential handling**: Hardcoded test user (verified /webapp/src/contexts/AuthContext.tsx:22-38)

### Data Exposure (Verified)
- **Error message handling**: Generic messages to client (verified /api/src/middleware/returnError.js), detailed errors logged server-side
- **Database ID exposure**: CUIDs exposed in all responses (visible in return payloads)
- **Field masking**: None - all fields returned as-is
- **Error leak**: Unhandled errors return generic "Internal Server Error" via errorHandler (/api/src/middleware/errorHandler.js:5)

---

## Out of Scope (Current System Does NOT Support)

- User registration or authentication flows
- Password reset or email verification
- Role-based access control (admin, teacher, student)
- Multi-tenancy or organization hierarchies
- Comment sharing between users
- Comment version history
- Soft delete / trash / archive
- Audit logging of changes
- Webhooks or event notifications
- Real-time updates (WebSockets, SSE)
- GraphQL endpoint
- API versioning (e.g., /v1/)
- Pagination, filtering, sorting query parameters
- Partial responses (field selection)
- Batch operations (bulk create/update/delete)
- Comment templates or snippets
- Rich text formatting (Markdown, HTML)
- Attachment previews for non-images (PDF, DOCX)
- Attachment deletion endpoint
- Attachment update/rename endpoint
- Comment duplicate/copy operation
- Category hierarchy (parent/child categories)
- Comment-to-tag association endpoints
- Hotkey mapping CRUD endpoints
- Public API access or API keys
- OAuth integration
- Export data (CSV, JSON download)
- Import data (bulk upload)
- Search or full-text indexing
- Analytics or usage reports
- Notifications or reminders
- Scheduled tasks or cron jobs
- LMS integrations (Canvas, Blackboard, Moodle)

---

## Observations & Inconsistencies

### Naming Inconsistencies
- Project name: "FastGrade" (folder), "QuickNote" (database name in docker-compose)
- Frontend uses "favorite" (US spelling), backend uses "favourite" (UK spelling) inconsistently

### Data Model Observations (Verified)
- `Comment.keywords` field (schema.prisma:46): Json type, always null - no code found setting this value
- `Comment.order` field (schema.prisma:43): Defined with default 0, but commentService orders by createdAt instead (verified /api/src/services/commentService.js:7)
- `HotkeyMapping` table (schema.prisma:116-128): Exists but no routes in /api/src/routes (no hotkeyRouter found)
- `CommentTag` junction table (schema.prisma:69-81): Exists but association logic not implemented (verified tagController.js:50-51 TODO)
- Rubric models (schema.prisma:148-175): Commented out, not in active schema

### API Gaps (Verified)
- No DELETE endpoint for attachments (verified /api/src/routes/attachment.js:1-10 - only GET and POST)
- Feedback GET endpoints exist but accessible without auth (/api/src/routes/feedback.js:6,8,9)
- Individual comment/category GET endpoints exist but with awkward routes:
  - `/api/comment/:commentId/user/:userId` (verified /api/src/routes/comment.js:7)
  - `/api/category/:categoryId/user/:userId` (verified /api/src/routes/category.js:7)
- No bulk delete operations
- Settings endpoints exist (/api/src/routes/settings.js) but frontend usage unknown
- No CommentTag association endpoints (create tag does not link to comment - verified tagController.js:50-51)
- No HotkeyMapping endpoints at all (no routes file exists)

### Frontend-Backend Mismatches (Verified)
- Frontend hardcodes user, backend trusts userId from client (verified AuthContext.tsx vs controllers)
- No backend validation of test user credentials (any userId accepted)
- Frontend may expect consistent response format but health endpoint differs (verified /api/src/app.js:15 returns {ok:true} instead of standard envelope)

### Error Handling Variability (Verified)
- Controllers use returnError helpers for consistent format (verified /api/src/middleware/returnError.js)
- All errors include timestamp and success:false (consistent)
- Unhandled errors caught by errorHandler middleware return generic message (verified /api/src/middleware/errorHandler.js:5)
- No Prisma error leakage - errors logged but generic message returned to client

---

## Completion Criteria (For Baseline)

This acceptance criteria document is complete when:
- ✅ All current API endpoints are documented with request/response shapes
- ✅ Current validation rules are captured
- ✅ Existing error behaviors are described
- ✅ Response envelope format is specified
- ✅ Data constraints and cascade behaviors are documented
- ✅ Known gaps, inconsistencies, and unknowns are explicitly called out
- ✅ No forward-looking or speculative behavior is included
- ✅ Document reflects reality as defined by code inspection

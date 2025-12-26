# Acceptance Criteria - System Baseline

## Scope
This document defines the **current behavioral contract** of the FastGrade API as it exists today.
All endpoints, response formats, and error behaviors documented here represent the system's actual implementation.

This is NOT a specification for new features - it captures what must continue to work exactly as it does now.

## Preconditions

### Authentication
- **Current State**: No authentication middleware on API routes
- **Frontend Behavior**: Hardcoded login returns fixed test user `id: 'cmenmlrs10000nfcnaeclyq4o', email: 'test@test.com'`
- **Assumption**: All API calls currently assume this test userId

### Data State
- MySQL database must be running and accessible
- Prisma schema must be migrated to latest version
- Cloudflare R2 bucket must be configured and accessible for file uploads

### Environment Variables Required
- `DATABASE_URL` - MySQL connection string
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL` - R2 credentials

## Response Envelope Standard

All successful responses follow this pattern:
```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Operation succeeded"
}
```

All error responses follow this pattern:
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* optional error details */ }
}
```

HTTP status codes:
- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST
- `400 Bad Request` - Validation failure
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server failure

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

**Behavior**:
- Returns empty array `[]` if user has no comments
- Includes category details by default
- Comments are not sorted by any specific order

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

**Behavior**:
- Returns empty array `[]` if user has no categories
- Categories are not sorted by any specific field

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

**Behavior**:
- Comments associated with this category have `categoryId` set to `null` (become uncategorized)
- No cascade delete of comments

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

**Processing**:
1. File is uploaded to memory via multer
2. Original filename, size, MIME type extracted
3. File uploaded to R2 with unique key
4. If image (jpg, jpeg, png, gif, webp), thumbnail generated using Sharp
5. Thumbnail uploaded to R2 with `-thumb` suffix
6. Database record created with URLs

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

**Behavior**:
- File is kept in memory until R2 upload completes
- Thumbnail generation is synchronous (blocks response)
- Thumbnail dimensions: 200x200 pixels
- Non-image files have `thumbnailUrl: null`

**Error Cases**:
- `400 Bad Request`: Missing file, userId, or name
- `500 Internal Server Error`: R2 upload failure
- `500 Internal Server Error`: Thumbnail generation failure
- `500 Internal Server Error`: Database failure

**Unknowns**:
- No documented file size limit
- No file type restrictions
- No virus scanning
- R2 upload failure does not clean up partial uploads

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
- Returns empty array `[]` if user has no attachments
- Attachments are not sorted

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

**Note**: Tag creation exists but no UI or comment-tag association logic implemented

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
- Returns empty array `[]` if user has no tags
- No association with comments in response

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

**Unknowns**:
- No GET endpoint for viewing feedback
- No admin interface for reviewing feedback
- No status field (e.g., open, resolved)

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

**Behavior**:
- If user has no settings record, returns default settings from `/api/src/config/defaultSettings.json`
- Current default settings file is empty object `{}`

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

**Behavior**:
- Uses shallow merge: `{ ...existingSettings, ...newSettings }`
- Does not deep merge nested objects

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

### Cascade Behaviors
- **Comment deletion**: CommentTag entries are cascade deleted
- **Category deletion**: Comments remain but `categoryId` set to null
- **User deletion**: All related records cascade delete (comments, categories, attachments, tags, feedback, settings)

### Foreign Key Constraints
- All `userId` references must point to valid User
- `Comment.categoryId` must point to valid Category or be null
- `CommentTag.commentId` must point to valid Comment
- `CommentTag.tagId` must point to valid Tag

---

## Performance Expectations

### Current Behavior
- No pagination on any GET endpoints
- All comments/categories/attachments fetched in single query
- No query result limits
- Thumbnail generation is synchronous (blocks response)
- No caching headers
- No rate limiting

### Response Time (Observed, Not Guaranteed)
- Health check: <10ms
- Simple CRUD operations: 50-200ms
- File upload with thumbnail: 500-2000ms (depends on file size)
- Bulk category reorder: 100-300ms

---

## Security Considerations

### Current State (As-Is)
- **No authentication middleware** on API routes
- **No authorization checks** beyond userId matching in request body
- **No CSRF protection**
- **No rate limiting**
- **No input sanitization** beyond Zod validation
- **No SQL injection protection** (relies on Prisma parameterization)
- **No XSS protection** (relies on React escaping)
- **No file upload validation** (no type/size limits, no virus scanning)

### Authorization Pattern
- API trusts `userId` sent in request body
- No session verification
- No JWT or token validation
- Frontend hardcodes test user credentials

### Data Exposure
- All error messages returned to client
- Database IDs exposed in responses
- No field masking or redaction

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

### Data Model Observations
- `Comment.keywords` field exists but is unused (always null)
- `Comment.order` field is defined but no documented ordering logic
- `HotkeyMapping` table exists but no API endpoints
- `CommentTag` junction table exists but no association endpoints
- Rubric-related models commented out in schema

### API Gaps
- No DELETE endpoint for attachments
- No endpoint to view feedback submissions
- No GET endpoint for individual comment/category by ID
- No bulk delete operations
- Settings endpoints exist but no UI implementation

### Frontend-Backend Mismatches
- Frontend assumes authentication exists; backend has none
- Frontend uses React Query caching; backend has no cache headers
- Frontend expects specific error format; backend may return Prisma errors directly

### Error Handling Variability
- Some endpoints return validation errors with `details` object
- Other endpoints return simple error strings
- Database errors may leak Prisma stack traces (not confirmed but likely)

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

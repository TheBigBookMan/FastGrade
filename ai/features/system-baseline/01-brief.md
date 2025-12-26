# System Baseline Brief

## Summary
FastGrade is a teacher grading efficiency tool that enables educators to create, organize, and reuse feedback comments during student assessment. The system provides CRUD operations for comment templates, category organization, file attachment management, and user settings persistence across a web application and browser extension.

## Problem
The current system solves the repetitive nature of grading by allowing teachers to:
- Save commonly used feedback phrases as reusable comment templates
- Organize feedback by categories (e.g., "Grammar", "Content", "Structure")
- Track usage frequency to surface most valuable feedback
- Attach files and images to support feedback
- Access feedback templates through both web app and browser extension

## Goals
What this system **currently achieves**:
- Enable teachers to create and manage reusable feedback comments (up to 1024 characters)
- Organize comments into user-defined categories with custom ordering
- Upload and manage file attachments (images, PDFs, etc.) with thumbnail generation
- Track comment usage patterns (useCount, lastUsedAt) to identify frequently used feedback
- Mark comments as favorites for quick access
- Persist user preferences and settings
- Collect user feedback about the application
- Provide a responsive web interface for all management operations

## Non-Goals
What the current system explicitly does **not** do:
- Multi-user collaboration or shared feedback libraries
- Advanced text formatting or rich text editing beyond plain text
- Rubric-based grading (schema references exist but not implemented)
- Real-time collaboration
- Role-based access control beyond basic user authentication
- Analytics or reporting dashboards
- Integration with Learning Management Systems (LMS)
- Export/import of comment libraries
- Version control for comments
- Automated grading or AI-powered feedback suggestions

## Users & Personas
Primary user:
- **Teachers/Educators**: Create feedback templates, organize by subject/topic, apply during grading

Secondary interactions:
- **System**: Health monitoring, logging, error tracking
- **Admin** (implied): Can view all user feedback submissions

## User Flow (Textual)

### Primary Flow: Creating and Using Feedback Comments

1. **Initial Setup**
   - User logs in with email (Verified hardcoded authentication in /webapp/src/contexts/AuthContext.tsx:22-38 - always returns test user id: 'cmenmlrs10000nfcnaeclyq4o', email: 'test@test.com')
   - Dashboard displays summary: total comments, total categories, favorite comments, most used comments

2. **Creating Categories**
   - User navigates to Categories page
   - Clicks "Create Category"
   - Enters category name and optional description
   - Categories are created with auto-incrementing order values
   - User can drag-and-drop to reorder categories, then save order

3. **Creating Comments**
   - User navigates to Comments page
   - Comments are displayed in accordion format, grouped by category
   - User clicks "Create Comment" modal
   - Enters title (optional), body text (required, max 1024 chars)
   - Selects category (optional) or leaves uncategorized
   - Comment is saved with initial order, useCount=0, isFavourite=false

4. **Managing Comments**
   - User can edit comment title, body, or category assignment
   - User can toggle favorite status via star icon
   - User can delete comments (with confirmation)
   - Comments track usage count and last used timestamp (Not Implemented: fields exist in schema at /api/prisma/schema.prisma:44-45 but no code in /webapp or /api updates these values - always remain useCount=0, lastUsedAt=null)
   - User can reorder comments within their display

5. **Managing Attachments**
   - User navigates to Attachments page
   - Views uploaded files in grid layout with thumbnails
   - Clicks "Upload Attachment"
   - Selects file from local system
   - Enters display name and optional description
   - File is uploaded to Cloudflare R2 storage
   - Thumbnails are auto-generated for image files (JPG, PNG, etc.)
   - User can search/filter attachments by name or type
   - User can preview images in modal overlay

6. **Providing Feedback**
   - User navigates to Feedback page
   - Submits title and description about app experience
   - Feedback is stored with user association and timestamp

### Secondary Flow: Browser Extension Integration

**STATUS**: Out of Scope - Extension codebase exists at /extension but is incomplete:
- Extension source files exist (/extension/src/sidebar, /extension/src/popup) but API integration file (/extension/src/utils/api.ts) is empty (1 line)
- No evidence of API calls to documented endpoints
- No authentication mechanism implemented
- No useCount/lastUsedAt update logic found
- Extension appears to be scaffolding without functional integration

## Success Criteria

### Functional Success (Current System)
- Users can create, read, update, and delete comments without data loss
- Categories organize comments and maintain user-defined order
- File uploads succeed and generate thumbnails for images
- Comments track usage patterns accurately
- Favorite comments are instantly accessible from dashboard
- All CRUD operations return consistent success/error responses

### UX Success (Current System)
- Dashboard provides at-a-glance summary of comment library
- Accordion view groups comments by category for easy browsing
- Drag-and-drop reordering works smoothly
- Modal dialogs for create/edit operations
- Confirmation prompts prevent accidental deletion
- Toast notifications provide operation feedback
- Image preview modal for attachment viewing
- Search/filter reduces time to find specific attachments

### Technical Success (Current System)
- API returns standardized response envelopes
- Database relationships maintain referential integrity
- File uploads stream to R2 without local persistence
- Thumbnail generation completes synchronously during upload
- Prisma migrations keep schema in sync
- Error handling returns appropriate HTTP status codes
- Logging captures request/response cycles
- Docker compose orchestrates all services
- Frontend state management via React Query handles caching and invalidation

## Scope Boundaries & Unknowns

### In Scope (Verified Through Code)
All current capabilities verified through direct code inspection:

**Authentication**:
- Hardcoded frontend authentication at /webapp/src/contexts/AuthContext.tsx:22-38
- No API middleware authentication (verified at /api/src/app.js:1-21 - no auth middleware in chain)
- Test user credentials: id 'cmenmlrs10000nfcnaeclyq4o', email 'test@test.com'

**API Endpoints**:
- Comment CRUD: /api/src/routes/comment.js:1-13
- Category CRUD: /api/src/routes/category.js:1-13
- Attachment upload/fetch: /api/src/routes/attachment.js:1-10
- Tag CRUD (basic): /api/src/routes/tag.js:1-10
- Feedback submission: /api/src/routes/feedback.js:1-11
- Settings management: /api/src/routes/settings.js:1-11

**Data Model**:
- Prisma schema at /api/prisma/schema.prisma
- Category deletion does NOT cascade to comments (schema line 40: no onDelete specified, defaults to SetNull)
- Comment deletion cascades to CommentTag (schema line 75: onDelete: Cascade)
- User deletion cascades to all relations (schema lines 38, 63, 76, 87, 106, 124, 134, 142)

**File Upload Processing**:
- Multer memory storage (file in req.file.buffer)
- R2 upload at /api/src/utils/upload/r2.js:12-23
- Thumbnail generation at /api/src/utils/upload/thumbnail.js:4-11 (synchronous, 300px width, JPEG quality 80)

### Out of Scope (Incomplete or Unimplemented)
The following exist in the data model but have NO confirmed implementation:

- **Tag System**: Tables exist (Tag at schema.prisma:56-67, CommentTag at 69-81) with basic CRUD endpoints (/api/src/routes/tag.js) but tagController.createTag has TODO comment (line 50-51) indicating CommentTag association is not implemented
- **Hotkey Mappings**: HotkeyMapping table exists (schema.prisma:116-128) but no API routes or controller found
- **Rubric Models**: Schema contains commented-out rubric models (schema.prisma:148-175) - not implemented
- **Comment Usage Tracking**: useCount and lastUsedAt fields exist (schema.prisma:44-45) but never updated - no code found in /webapp, /api, or /extension that modifies these values
- **Browser Extension**: Extension scaffolding exists but API integration incomplete (see Secondary Flow above)

### Architectural Inconsistencies (Observed, Not Fixed)
- **Naming Mismatch**: Project folder "fastgrade" vs database name "quicknote" (visible in LoginPage.tsx:53,86)
- **Authentication Gap**: Webapp has login UI (/webapp/src/pages/auth/LoginPage.tsx) but API has no authentication middleware (verified /api/src/app.js:10-18 - only httpLogger, helmet, cors, json middleware)
- **Settings Page**: API has settings endpoints (/api/src/routes/settings.js) but frontend implementation unknown
- **Feedback Admin View**: Feedback GET endpoints exist (/api/src/routes/feedback.js:6,9) but admin UI unknown
- **Comment Order Field**: Comment.order field exists (schema.prisma:43) but commentService only orders by createdAt desc (/api/src/services/commentService.js:7)

## Known Limitations

### Current Technical Constraints
- No authentication middleware on API (verified /api/src/app.js:10-18)
- Test coverage unknown - no test files found in controllers or services
- No OpenAPI documentation
- No ERD visualization
- No API versioning
- File uploads limited by Multer default settings (no explicit size limit configured)
- No file type validation beyond mimetype check (/api/src/controllers/attachmentController.js:43)
- No R2 cleanup on attachment deletion (no DELETE endpoint at /api/src/routes/attachment.js)
- Database backup strategy not documented
- Monitoring beyond console logging (winston) not implemented
- No rate limiting (verified /api/src/app.js - no rate limit middleware)

### Current UX Limitations
- Settings page is empty placeholder
- No bulk operations for comments
- No export/import functionality
- No search functionality for comments
- No keyboard shortcuts documented
- No accessibility features documented
- No mobile-optimized views
- No offline support
- Comment body limited to 1024 characters

### Known Rough Edges
- Category deletion sets comments.categoryId to null (verified schema.prisma:40 - no onDelete cascade)
- Attachment deletion endpoint does not exist (verified /api/src/routes/attachment.js - only GET and POST routes)
- No R2 cleanup when attachment deleted (no delete endpoint exists)
- No file size limit validation in attachmentController (/api/src/controllers/attachmentController.js:25-65)
- No file type whitelist - accepts any mimetype
- Thumbnail generation synchronous and blocks response (/api/src/controllers/attachmentController.js:42-45)
- Thumbnail dimensions fixed at 300px width (/api/src/utils/upload/thumbnail.js:6)
- No pagination on any endpoint - all queries use findMany without take/skip (verified in services)
- Comments ordered by createdAt desc, ignoring order field (/api/src/services/commentService.js:7)
- Categories ordered by order field asc (/api/src/services/categoryService.js:7)

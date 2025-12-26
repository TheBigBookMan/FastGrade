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
- Support tag-based organization (basic structure in place)
- Define hotkey mappings for quick comment insertion (data model exists)

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
   - User logs in with email (currently hardcoded authentication)
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
   - Comments track usage count and last used timestamp (updated externally, likely by extension)
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

### Secondary Flow: Browser Extension Usage (Implied)

1. User installs browser extension
2. While grading online (e.g., Google Docs, LMS), user invokes extension
3. Extension displays comment library
4. User selects comment to insert
5. System increments useCount and updates lastUsedAt
6. Extension may use hotkey mappings for frequently used comments

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

## Open Questions

### Current System Ambiguities
- **Authentication**: Currently hardcoded - what is the intended production auth mechanism?
- **Comment Usage Tracking**: useCount and lastUsedAt are defined but not updated by webapp - is this extension-only?
- **Tag System**: CommentTag junction table exists but no UI or service logic - is this in active development?
- **Hotkey Mappings**: Schema defined, no controllers/UI - is this planned or abandoned?
- **Settings Page**: Empty in webapp - what settings are intended?
- **Rubric References**: Schema contains commented-out rubric models - is this future scope?
- **Category Cascade Behavior**: What happens to comments when category is deleted? (Currently they become uncategorized)
- **Attachment Limits**: Are there file size limits, file type restrictions, or storage quotas?
- **Comment Keywords Field**: JSON field exists but unused - is this for future search/tagging?
- **Multi-tenancy**: Are users isolated? Can users share comments across accounts?

### Behavioral Unknowns
- **Comment Ordering**: How is the 'order' field used? Is it per-category or global?
- **Default Settings**: `/api/src/config/defaultSettings.json` is empty - are defaults needed?
- **Error Recovery**: What happens if R2 upload fails mid-operation?
- **Concurrent Edits**: How does the system handle simultaneous updates to same comment?
- **Soft Delete**: Are deletions permanent or soft-deleted?
- **Attachment Deletion**: When attachment is deleted, is file removed from R2?

### Inconsistencies Observed
- **Authentication Mismatch**: Webapp uses hardcoded login; API has no auth middleware
- **Naming**: Project folder is "fastgrade" but references "quicknote" in database URL and schema
- **Settings Service**: Has merge logic and default handling, but defaultSettings.json is empty
- **Feedback Context**: feedbackController exists in API but purpose/admin view unclear
- **Extension Integration**: Extension code exists but integration points with webapp/api are not evident

## Known Limitations

### Current Technical Constraints
- No production authentication system
- No test coverage for most endpoints
- No OpenAPI documentation
- No ERD visualization
- No API versioning
- Hardcoded test user credentials in frontend
- File uploads kept in memory before R2 transfer
- No database backups or migration strategy documented
- No monitoring or alerting
- No rate limiting or abuse protection

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
- Category deletion impact on comments not documented
- Attachment deletion doesn't cascade to R2 cleanup
- No validation on file types or sizes during upload
- Drag-and-drop order changes require explicit "Save Order" click
- Dashboard stats don't update in real-time (require page refresh)
- No loading states during file uploads
- Image thumbnails generated synchronously (could block response)
- No pagination for large comment/attachment lists

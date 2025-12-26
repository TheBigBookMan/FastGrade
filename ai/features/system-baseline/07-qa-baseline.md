# QA Baseline Assessment

## Document Purpose

This document assesses the **current testability** of the FastGrade system as it exists today. This is a BASELINE ASSESSMENT in BASELINE MODE - it identifies what CAN be tested to lock in current behavior, what CANNOT be tested without changes, and what infrastructure is needed for baseline validation.

This is NOT a test implementation plan or a proposal for ideal test coverage. It focuses exclusively on locking in current behavior as documented.

## Methodology

This assessment was conducted through systematic inspection of:

### Acceptance Criteria Review
- `/ai/features/system-baseline/02-acceptance.md` - All 30 API endpoints with behavioral contracts
- Identified 30 testable endpoints across 7 resource types
- Documented 9 data integrity constraints
- Reviewed cascade behaviors and validation rules

### API Baseline Review
- `/ai/features/system-baseline/04-api-baseline.md` - Implementation details, quirks, and inconsistencies
- Verified response envelope patterns (standard vs inconsistent)
- Identified unused fields and incomplete features
- Documented authentication gaps

### Data Model Review
- `/ai/features/system-baseline/05-data-baseline.md` - Database schema, cascade behaviors, constraints
- Verified 9 active tables with relationships
- Identified orphaned features (HotkeyMapping, CommentTag)
- Documented 4 unused Comment fields

### Architecture Review
- `/ai/features/system-baseline/06-architecture-baseline.md` - System architecture and module boundaries
- Verified layered architecture (routes → controllers → services → database)
- Identified hardcoded authentication
- Documented synchronous file processing

### Current Testing State Inspection
- `/api/vitest.config.js` - Vitest configuration for API tests
- `/api/src/__tests__/categories.fetchByUserId.test.js` - Single existing unit test
- `/api/package.json` - Test dependencies (vitest, supertest installed)
- `/webapp/package.json` - No test infrastructure configured

---

## Current Testing State

### API Testing Infrastructure

**Test Framework**: Vitest 4.0.16 (installed and configured)

**Configuration** (`/api/vitest.config.js`):
```javascript
{
    test: {
        environment: "node",
        globals: true,
        include: ["src/__tests__/**/*.test.js"]
    }
}
```

**Status**: MINIMAL

**Existing Tests**: 1 file
- `/api/src/__tests__/categories.fetchByUserId.test.js` (1 unit test, 37 lines)
- Tests: `fetchCategoriesByUserId` controller method
- Mocks: `categoryService` mocked via `vi.mock()`
- Pattern: Uses `node-mocks-http` for request/response mocking
- Result: Tests pass (verified via `npm run test`)

**Dependencies Installed**:
- `vitest` 4.0.16 (test runner)
- `supertest` 7.1.4 (HTTP testing - UNUSED, no tests found using it)

**Test Coverage**: <1% (1 test out of ~30 controller methods, 0 integration tests)

### Webapp Testing Infrastructure

**Test Framework**: NONE

**Configuration**: None found

**Status**: NOT CONFIGURED

**Test Script** (`package.json`):
```json
"test": "echo \"Error: no test specified\" && exit 1"
```

**Dependencies Installed**: None (no testing libraries in package.json)

**Test Coverage**: 0%

### Extension Testing Infrastructure

**Status**: NOT ASSESSED (extension is incomplete, API integration not implemented)

---

## Testability Assessment by Acceptance Criteria

### AC-1: Health Check Endpoint

**Acceptance Criterion**: `GET /health` returns `{ ok: true }`

**Testable**: YES

**Test Type**: Integration test (HTTP contract)

**Blockers**: None

**Test Approach**:
- Integration test: Send GET /health, verify response `{ ok: true }`
- Unit test: Not applicable (no business logic)

**Notes**:
- Non-standard response format (documented inconsistency)
- Simple contract, easy to test

---

### AC-2-7: Comment Endpoints (6 endpoints)

#### AC-2: Create Comment (`POST /api/comment`)

**Acceptance Criterion**: Creates comment with userId, body (required), optional title, categoryId, isFavourite

**Testable**: PARTIALLY

**Test Type**: Integration test (requires database)

**Blockers**:
- Requires test database (no test DB configured)
- Requires hardcoded userId (no auth)
- CategoryId validation requires existing category

**Test Approach**:
- Integration test: POST with valid payload, verify 201 response and database record created
- Edge cases: Missing userId (expect 400), missing body (expect 400), body >1024 chars (expect 400)
- Verify defaults: useCount=0, lastUsedAt=null, keywords=null, isFavourite=false

**Notes**:
- Unused fields (useCount, lastUsedAt, keywords, order) should remain at default values
- Comment.order field exists but queries use createdAt instead

#### AC-3: Get Comments (`GET /api/comment/:userId`)

**Acceptance Criterion**: Returns all comments for user, ordered by createdAt DESC, optional includeCategory

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database with seed data
- No pagination (returns all records - could cause performance issues in tests with large datasets)

**Test Approach**:
- Integration test: GET with userId, verify response envelope and ordering
- Test includeCategory parameter (true/false)
- Verify empty array returned for user with no comments
- Verify ordering by createdAt DESC (NOT by order field)

#### AC-4: Update Comment (`PUT /api/comment/:commentId/user/:userId`)

**Acceptance Criterion**: Updates comment fields (title, body, categoryId)

**Testable**: PARTIALLY

**Test Type**: Integration test

**Blockers**:
- Requires test database
- Potential bug: category update uses `connect` instead of `set` (may fail with null categoryId)

**Test Approach**:
- Integration test: Update title, body, verify changes persist
- Edge case: Set categoryId to null (may fail due to bug - document if it does)
- Verify userId mismatch returns 400

**Notes**:
- Known bug: `/api/src/services/commentService.js:40-42` uses `connect` which may not handle null categoryId correctly
- This is BASELINE mode - test current behavior, even if buggy

#### AC-5: Update Comment Favorite (`PUT /api/comment/:commentId/user/:userId/favourite`)

**Acceptance Criterion**: Toggles isFavourite boolean

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Set favourite=true, verify change, set favourite=false, verify change
- Verify missing favourite field returns 400

#### AC-6: Delete Comment (`DELETE /api/comment/:commentId/user/:userId`)

**Acceptance Criterion**: Deletes comment, cascades to CommentTag and HotkeyMapping

**Testable**: PARTIALLY

**Test Type**: Integration test

**Blockers**:
- Requires test database
- CommentTag and HotkeyMapping tables are orphaned (no API to create data)

**Test Approach**:
- Integration test: Create comment, delete it, verify 200 response and record removed
- Cascade test: NOT TESTABLE (cannot create CommentTag or HotkeyMapping records via API)
- Verify userId mismatch returns 400

**Notes**:
- Cascade behavior exists in schema but cannot be tested without manually seeding junction tables

#### AC-7: Get Single Comment (`GET /api/comment/:commentId/user/:userId`)

**Acceptance Criterion**: Returns single comment by ID

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET existing comment, verify response
- Test non-existent commentId returns 404
- Verify userId mismatch behavior

---

### AC-8-13: Category Endpoints (6 endpoints)

#### AC-8: Create Category (`POST /api/category`)

**Acceptance Criterion**: Creates category with userId, name (required), optional description. Order auto-calculated.

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: POST with valid payload, verify 201 and order auto-calculated
- Test duplicate category name returns 400 (unique constraint)
- Verify order = (existing_count + 1)

#### AC-9: Get Categories (`GET /api/category/:userId`)

**Acceptance Criterion**: Returns all categories ordered by order ASC, optional includeComments

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database with seed data

**Test Approach**:
- Integration test: GET with userId, verify ordering by order ASC
- Test includeComments parameter
- Verify empty array for user with no categories

#### AC-10: Update Category (`PUT /api/category/:categoryId/user/:userId`)

**Acceptance Criterion**: Updates category name, description, order

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Update name, description, verify changes
- Test duplicate name returns 400

#### AC-11: Delete Category (`DELETE /api/category/:categoryId/user/:userId`)

**Acceptance Criterion**: Deletes category, sets Comment.categoryId to NULL, reorders remaining categories

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Create category, create comment with categoryId, delete category
- Verify comment.categoryId becomes null (SetNull cascade)
- Verify remaining categories reordered sequentially (1, 2, 3...)

**Notes**:
- This tests the rebalancing transaction logic in `/api/src/services/categoryService.js:62-74`

#### AC-12: Update Category Order (`PUT /api/category/user/:userId}/order`)

**Acceptance Criterion**: Bulk reorder via categoryIds array, transaction-based

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Create 3 categories, reorder them, verify order field updates
- Test transaction rollback on error (ownership mismatch)

#### AC-13: Get Single Category (`GET /api/category/:categoryId/user/:userId`)

**Acceptance Criterion**: Returns single category by ID

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET existing category, verify response
- Test non-existent categoryId returns 404

---

### AC-14-16: Attachment Endpoints (3 endpoints)

#### AC-14: Upload Attachment (`POST /api/attachment/:userId`)

**Acceptance Criterion**: Upload file to R2, generate thumbnail for images (synchronous), create database record

**Testable**: NO (without R2 or mock)

**Test Type**: Integration test (requires R2) or unit test (with mocks)

**Blockers**:
- Requires R2 connection or mock
- Synchronous thumbnail generation (Sharp dependency)
- No file cleanup on failure

**Test Approach (with mocks)**:
- Unit test: Mock `uploadToR2` and `generateThumbnail`, verify controller logic
- Verify file metadata extraction (originalName, fileSize, mimeType)
- Verify thumbnail only generated for images (mimeType.startsWith("image/"))

**Test Approach (integration)**:
- NOT RECOMMENDED for baseline: Requires R2 test bucket, cleanup logic
- Too complex for baseline validation

**Recommendation**: Unit test with mocks only for baseline

**Notes**:
- Thumbnail generation is synchronous and blocks response (verified in API baseline)
- No file type validation or size limits (accepts any file)

#### AC-15: Get Attachments (`GET /api/attachment/:userId`)

**Acceptance Criterion**: Returns all attachments for user

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET with userId, verify response envelope
- Verify empty array for user with no attachments
- Note: No ordering specified (returns in insertion order)

**Notes**:
- Cannot test actual R2 URLs without upload functionality
- Can test database schema and response structure

#### AC-16: Get Single Attachment (`GET /api/attachment/:attachmentId/user/:userId`)

**Acceptance Criterion**: Returns single attachment by ID

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET existing attachment, verify response
- Test non-existent attachmentId returns 404

**Notes**:
- No DELETE endpoint exists (documented gap)

---

### AC-17-19: Tag Endpoints (3 endpoints)

#### AC-17: Create Tag (`POST /api/tag`)

**Acceptance Criterion**: Creates tag with userId, name (required). Requires commentId but does NOT create CommentTag association.

**Testable**: YES (current behavior)

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: POST with userId, commentId, name, verify tag created
- Verify CommentTag association is NOT created (expected incomplete behavior)
- Test duplicate tag name returns 400

**Notes**:
- **INCOMPLETE IMPLEMENTATION**: `/api/src/controllers/tagController.js:50-51` has TODO comment
- commentId is required in request but never used
- This is BASELINE mode - test incomplete behavior as-is

**Response Format Issue**:
- Returns raw JSON, NOT standard envelope (documented inconsistency)

#### AC-18: Get Tags (`GET /api/tag/:userId`)

**Acceptance Criterion**: Returns all tags for user

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET with userId, verify response
- Verify empty array for user with no tags

**Notes**:
- Returns raw JSON array, NOT standard envelope

#### AC-19: Get Single Tag (`GET /api/tag/:tagId/user/:userId`)

**Acceptance Criterion**: Returns single tag by ID

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET existing tag, verify response
- Test non-existent tagId returns 404

**Notes**:
- Returns raw JSON object, NOT standard envelope

---

### AC-20-23: Feedback Endpoints (4 endpoints)

#### AC-20: Submit Feedback (`POST /api/feedback`)

**Acceptance Criterion**: Creates feedback with userId, title, description (all required)

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: POST with valid payload, verify 201 and record created
- Test missing required fields returns 400

#### AC-21: Get All Feedback (`GET /api/feedback`)

**Acceptance Criterion**: Returns ALL feedback from ALL users (no auth)

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Create feedback for 2 users, GET all, verify both returned

**Notes**:
- **SECURITY CONCERN**: No authentication (any client can access all feedback)
- Baseline mode: Test current behavior, document security gap

#### AC-22: Get Single Feedback (`GET /api/feedback/:feedbackId/user/:userId`)

**Acceptance Criterion**: Returns single feedback by ID

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET existing feedback, verify response

#### AC-23: Get Feedback by User (`GET /api/feedback/user/:userId`)

**Acceptance Criterion**: Returns all feedback for a user

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Create feedback for user, GET by userId, verify returned

---

### AC-24-27: Settings Endpoints (4 endpoints)

#### AC-24: Create Settings (`POST /api/settings`)

**Acceptance Criterion**: Creates settings record with userId (unique)

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: POST with userId, verify settings created with empty object {}
- Test duplicate userId returns 400 (unique constraint)

**Notes**:
- Default settings are empty object (verified in `/api/src/config/defaultSettings.json`)
- Returns raw JSON, NOT standard envelope

#### AC-25: Get Settings (`GET /api/settings/:userId`)

**Acceptance Criterion**: Returns settings, or default {} if none exist

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: GET for user with no settings, verify returns {} default
- Create settings, GET again, verify returns created settings

**Notes**:
- Returns raw JSON, NOT standard envelope

#### AC-26: Update Settings (`PUT /api/settings/:userId`)

**Acceptance Criterion**: Shallow merge new settings with existing (not deep merge)

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Create settings { a: 1 }, update with { b: 2 }, verify result { a: 1, b: 2 }
- Test shallow merge: Create { obj: { x: 1 } }, update with { obj: { y: 2 } }, verify { obj: { y: 2 } } (NOT deep merge)

**Notes**:
- Shallow merge documented in `/api/src/services/settingsService.js:24`
- Returns raw JSON, NOT standard envelope

#### AC-27: Reset Settings (`GET /api/settings/:userId/default`)

**Acceptance Criterion**: Resets settings to default {}

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Create settings with data, GET /default, verify returns {}

**Notes**:
- Uses GET for state change (questionable REST design, documented in API baseline)
- Returns raw JSON, NOT standard envelope

---

### AC-28-30: Data Integrity Constraints

#### AC-28: Unique Constraints

**Acceptance Criterion**: Email, category names per user, tag names per user, CommentTag pairs, hotkey per user, one settings per user

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test for each constraint:
  - Category: Create category "Work" for user1, attempt duplicate, verify 400
  - Tag: Create tag "important" for user1, attempt duplicate, verify 400
  - Settings: Create settings for user1, attempt duplicate, verify 400

**Notes**:
- CommentTag and HotkeyMapping cannot be tested (no API to create records)

#### AC-29: Cascade Delete Behaviors

**Acceptance Criterion**: User deletion cascades to all owned records except Feedback (behavior undefined)

**Testable**: NO (no User DELETE endpoint)

**Test Type**: Database-level integration test

**Blockers**:
- No User DELETE endpoint exists
- Would require direct database manipulation

**Test Approach**:
- NOT TESTABLE via API
- Could be tested via direct Prisma calls (outside API contract)

**Recommendation**: Defer cascade testing to future feature (when User management is implemented)

**Notes**:
- Category deletion → Comment.categoryId set to NULL (testable via category delete endpoint)
- Comment deletion → CommentTag and HotkeyMapping cascade (NOT testable - no data exists)

#### AC-30: Foreign Key Constraints

**Acceptance Criterion**: All userId, categoryId references must be valid or null

**Testable**: YES

**Test Type**: Integration test

**Blockers**:
- Requires test database

**Test Approach**:
- Integration test: Create comment with non-existent categoryId, verify error
- Create comment with non-existent userId, verify error (database constraint)

---

## Test Categorization

### Unit Tests (Pure Logic, No Database)

**Testable Without Database**:

1. **Response Envelope Formatting**
   - Test `returnSuccess.successCreate()` returns correct structure
   - Test `returnSuccess.successFetch()` returns correct structure
   - Test `returnError.loggerWarnUserId()` returns correct error format
   - Test `returnError.internalError()` returns correct error format

2. **Thumbnail Generation Logic** (with mocks)
   - Test `generateThumbnail()` with image buffer, verify Sharp resize called
   - Test thumbnail dimensions (300px width)
   - Test JPEG quality (80)

3. **R2 Upload Logic** (with mocks)
   - Test `uploadToR2()` generates timestamp-prefixed key
   - Test returns public URL

4. **Settings Merge Logic**
   - Test shallow merge behavior (verify spread operator logic)
   - Test nested objects are replaced, not merged

5. **Controller Validation Logic** (with mocked service)
   - Test controllers reject missing userId (already exists: categories.fetchByUserId.test.js)
   - Test controllers reject missing required fields
   - Extend existing test pattern to other controllers

**Recommended Unit Tests**: ~15 tests
- 4 response envelope tests
- 3 thumbnail/upload tests (mocked)
- 2 settings merge tests
- 6 controller validation tests (expand existing pattern)

**Effort**: LOW (no database setup, fast execution, easy to maintain)

---

### Integration Tests (API Contracts, Database Required)

**Testable With Test Database**:

All 30 API endpoints can be integration tested, categorized by complexity:

#### Simple GET Operations (Low Complexity)
- GET comments by userId
- GET categories by userId
- GET attachments by userId
- GET tags by userId
- GET feedback (all, by user, by ID)
- GET settings by userId

**Count**: 9 endpoints
**Effort**: LOW (read-only, no side effects)

#### Simple POST Operations (Medium Complexity)
- POST comment (create)
- POST category (create)
- POST tag (create)
- POST feedback (create)
- POST settings (create)

**Count**: 5 endpoints
**Effort**: MEDIUM (requires cleanup after test)

#### UPDATE Operations (Medium Complexity)
- PUT comment (update fields)
- PUT comment favorite status
- PUT category (update fields)
- PUT settings (shallow merge)

**Count**: 4 endpoints
**Effort**: MEDIUM (requires existing data, verify changes)

#### DELETE Operations (Medium Complexity)
- DELETE comment
- DELETE category (with cascade to Comment.categoryId)

**Count**: 2 endpoints
**Effort**: MEDIUM (requires existing data, verify cascade)

#### Complex Operations (High Complexity)
- PUT category order (bulk reorder, transaction)
- POST attachment (requires R2 mocks or test bucket)

**Count**: 2 endpoints
**Effort**: HIGH (complex setup, transaction logic, external dependencies)

#### Single Resource GET Operations (Low Complexity)
- GET comment by ID
- GET category by ID
- GET attachment by ID
- GET tag by ID
- GET feedback by ID
- GET settings/default (reset)

**Count**: 6 endpoints
**Effort**: LOW (requires single record, simple verification)

#### Health Check (Trivial)
- GET /health

**Count**: 1 endpoint
**Effort**: TRIVIAL (no database, simple contract)

**Total Integration Tests**: ~30 endpoint tests (one per endpoint minimum)
**Additional Tests**: ~20 edge case tests (validation, errors, constraints)
**Estimated Total**: ~50 integration tests

**Effort**: MEDIUM to HIGH (requires test database setup, cleanup, fixtures)

---

### End-to-End Tests (Critical User Flows)

**Not Recommended for Baseline**:

E2E tests require:
- Running frontend
- Running API
- Running database
- Browser automation

**Rationale**:
- Baseline goal is to lock in API behavior, not full user flows
- Frontend has no test infrastructure
- E2E tests are slow, flaky, and expensive to maintain
- Integration tests provide sufficient coverage for API baseline

**Recommendation**: Defer E2E tests to future feature work

---

## Testing Gaps and Blockers

### Infrastructure Gaps

#### 1. No Test Database Configuration

**Impact**: Cannot run integration tests

**Required**:
- Test database container or in-memory database
- Separate DATABASE_URL for tests
- Database reset/cleanup between tests
- Seed data fixtures for complex scenarios

**Options**:
- In-memory SQLite (fast but different from production MySQL)
- Docker container with MySQL (accurate but slower)
- Test database on existing MySQL instance (requires careful isolation)

**Recommendation**: Docker container with MySQL (matches production)

#### 2. No Test Fixtures or Factories

**Impact**: Hard to create test data consistently

**Required**:
- Factory functions for creating test entities
- Seed scripts for common scenarios
- Cleanup utilities

**Example**:
```javascript
// factories/commentFactory.js
export const createTestComment = async (overrides = {}) => {
    return await prisma.comment.create({
        data: {
            userId: "test-user-id",
            body: "Test comment body",
            title: "Test title",
            useCount: 0,
            lastUsedAt: null,
            ...overrides
        }
    });
};
```

#### 3. No R2 Test Environment

**Impact**: Cannot integration test file uploads

**Required**:
- Test R2 bucket OR
- Mock R2 client (recommended for baseline)

**Recommendation**: Mock R2 for baseline (avoid external dependency complexity)

#### 4. Webapp Has No Test Infrastructure

**Impact**: Cannot test frontend

**Required** (for future, NOT baseline):
- Test runner (Vitest or Jest)
- React Testing Library
- Test configuration

**Recommendation**: Defer to future feature (out of baseline scope)

---

### Behavioral Blockers

#### 1. Hardcoded Authentication

**Impact**: Cannot test auth/authorization logic

**Current State**: No authentication middleware, hardcoded test user on frontend

**Testability**:
- Cannot test authentication flows (none exist)
- Cannot test authorization (none exists)
- Tests must use hardcoded userId

**Baseline Approach**: Accept hardcoded userId in tests (matches current system)

**Future**: When auth is implemented, tests will need to be updated

#### 2. Untestable Cascade Behaviors

**Impact**: Cannot verify some cascade deletes

**Affected**:
- Comment deletion → CommentTag cascade (no API to create CommentTag)
- Comment deletion → HotkeyMapping cascade (no API to create HotkeyMapping)
- User deletion → all records (no User DELETE endpoint)

**Baseline Approach**: Document as untestable, defer to future features

**Testable Cascade**:
- Category deletion → Comment.categoryId = null (TESTABLE via existing endpoints)

#### 3. Incomplete Features

**Impact**: Tests must verify incomplete behavior

**Affected**:
- Tag creation requires commentId but doesn't use it (TODO in code)
- CommentTag junction never populated
- HotkeyMapping table orphaned

**Baseline Approach**: Test incomplete behavior as-is, document expected incompleteness

#### 4. Unused Fields Always Default

**Impact**: Tests cannot verify useCount/lastUsedAt update logic

**Affected Fields**:
- Comment.useCount (always 0)
- Comment.lastUsedAt (always null)
- Comment.keywords (always null)
- Comment.order (always 0, unused)

**Baseline Approach**: Verify fields remain at defaults (lock in current behavior)

---

### Data Dependencies

#### 1. Foreign Key Dependencies

**Impact**: Tests must create parent records first

**Examples**:
- Creating comment with categoryId requires category to exist first
- Cannot test non-existent categoryId behavior without database constraint error

**Test Approach**:
- Create parent records in test setup
- Test foreign key validation via database errors

#### 2. No Pagination

**Impact**: Tests must handle potentially large result sets

**Current Behavior**: All GET endpoints return ALL records (no limit)

**Test Approach**:
- Use small datasets in tests
- Verify all records returned (expected behavior)
- Document performance risk

#### 3. No Transaction Rollback in Tests

**Impact**: Tests must manually clean up created records

**Required**:
- Delete all created records after each test OR
- Truncate all tables between tests OR
- Use database transactions with rollback (requires test framework support)

**Recommendation**: Database reset between tests (truncate all tables)

---

## Proposed Test Strategy for Baseline

### Phase 1: Unit Tests (Priority: HIGH, Effort: LOW)

**Goal**: Test pure logic without database

**Scope**:
1. Extend existing controller unit tests (use existing pattern from categories.fetchByUserId.test.js)
   - Test all controllers with mocked services
   - Verify validation logic (missing userId, required fields)
   - Verify response envelope formatting

2. Test response middleware
   - returnSuccess helpers (successCreate, successFetch, successUpdate, successDelete)
   - returnError helpers (loggerWarnUserId, internalError, notFound)

3. Test upload logic (with mocks)
   - generateThumbnail (mock Sharp)
   - uploadToR2 (mock S3 client)

4. Test settings merge logic
   - Shallow merge behavior
   - Nested object replacement

**Estimated Tests**: ~20 unit tests

**Benefits**:
- Fast execution (no database)
- Easy to maintain
- Catches validation bugs early

**Blockers**: None

---

### Phase 2: Integration Tests - Core CRUD (Priority: HIGH, Effort: MEDIUM)

**Goal**: Verify API contracts for core resources

**Prerequisites**:
- Test database setup (Docker MySQL container)
- Database reset utility
- Basic test fixtures

**Scope**:
1. Comment CRUD (7 tests minimum)
   - Create, read (all), read (single), update, delete, update favorite
   - Verify ordering by createdAt DESC
   - Verify unused fields remain default

2. Category CRUD (7 tests minimum)
   - Create, read (all), read (single), update, delete, update order
   - Verify ordering by order ASC
   - Verify category deletion sets Comment.categoryId to null
   - Verify order rebalancing after delete

3. Basic validation tests (5 tests)
   - Missing userId returns 400
   - Missing required fields returns 400
   - Duplicate category name returns 400
   - Duplicate tag name returns 400
   - Body >1024 chars returns 400

**Estimated Tests**: ~20 integration tests

**Benefits**:
- Verifies most critical API behaviors
- Tests actual database interactions
- Catches cascade behavior bugs

**Blockers**:
- Requires test database setup

---

### Phase 3: Integration Tests - Supporting Resources (Priority: MEDIUM, Effort: MEDIUM)

**Goal**: Verify remaining API endpoints

**Scope**:
1. Attachment endpoints (3 tests - without upload)
   - Read (all), read (single)
   - Upload: Unit test only (mock R2)

2. Tag endpoints (3 tests)
   - Create (verify CommentTag NOT created - expected incomplete behavior)
   - Read (all), read (single)
   - Verify raw JSON response (inconsistent envelope)

3. Feedback endpoints (4 tests)
   - Create, read (all), read (by user), read (single)
   - Verify no authentication on GET /api/feedback

4. Settings endpoints (4 tests)
   - Create, read, update (test shallow merge), reset
   - Verify raw JSON response (inconsistent envelope)

**Estimated Tests**: ~15 integration tests

**Benefits**:
- Complete API contract coverage
- Documents response format inconsistencies
- Verifies incomplete feature behavior

**Blockers**:
- Requires test database

---

### Phase 4: Data Integrity Tests (Priority: MEDIUM, Effort: LOW)

**Goal**: Verify database constraints and cascade behaviors

**Scope**:
1. Unique constraints (3 tests)
   - Category name per user
   - Tag name per user
   - Settings userId

2. Cascade behaviors (2 tests)
   - Category delete → Comment.categoryId = null
   - Category delete → order rebalancing

3. Foreign key constraints (2 tests)
   - Invalid categoryId rejected
   - Invalid userId rejected (database constraint)

**Estimated Tests**: ~7 integration tests

**Benefits**:
- Verifies database schema integrity
- Tests Prisma cascade behaviors

**Blockers**:
- Requires test database

---

### Phase 5: Edge Cases and Error Handling (Priority: LOW, Effort: MEDIUM)

**Goal**: Verify error responses and edge cases

**Scope**:
1. Non-existent resource IDs (404 responses)
2. UserId mismatch scenarios (400 responses)
3. Malformed requests (400 responses)
4. Response envelope consistency (document inconsistencies)

**Estimated Tests**: ~10 integration tests

**Benefits**:
- Documents error behavior
- Catches inconsistent error responses

**Blockers**:
- Requires test database

---

## Infrastructure Requirements

### Test Database

**Requirement**: MySQL test database matching production schema

**Options**:

1. **Docker Container** (RECOMMENDED)
   ```yaml
   # docker-compose.test.yml
   services:
     mysql-test:
       image: mysql:8
       environment:
         MYSQL_ROOT_PASSWORD: test
         MYSQL_DATABASE: fastgrade_test
       ports:
         - "3308:3306"
   ```

   **Pros**: Isolated, matches production, easy cleanup
   **Cons**: Slower startup than in-memory

2. **SQLite (in-memory)**
   ```javascript
   // vitest.config.js
   {
       test: {
           environment: "node",
           setupFiles: ["./src/__tests__/setup.js"]
       }
   }
   ```

   **Pros**: Fast, no external dependencies
   **Cons**: Different from production MySQL (subtle behavior differences)

**Recommendation**: Docker MySQL container for accuracy

---

### Test Fixtures and Utilities

**Required Files**:

1. **Database Setup** (`/api/src/__tests__/setup.js`)
   - Initialize Prisma test client
   - Connect to test database
   - Run migrations

2. **Database Cleanup** (`/api/src/__tests__/cleanup.js`)
   - Truncate all tables between tests
   - Reset auto-increment IDs

3. **Test Factories** (`/api/src/__tests__/factories/`)
   - `commentFactory.js` - Create test comments
   - `categoryFactory.js` - Create test categories
   - `userFactory.js` - Create test user (hardcoded ID)

4. **Mock Utilities** (`/api/src/__tests__/mocks/`)
   - `mockR2.js` - Mock S3 client for R2
   - `mockSharp.js` - Mock Sharp for thumbnails

**Example Factory**:
```javascript
// /api/src/__tests__/factories/commentFactory.js
import prisma from '../../utils/prisma.js';

export const createComment = async (overrides = {}) => {
    return await prisma.comment.create({
        data: {
            userId: "test-user-id",
            body: "Test comment body",
            title: null,
            categoryId: null,
            isFavourite: false,
            order: 0,
            useCount: 0,
            lastUsedAt: null,
            keywords: null,
            ...overrides
        }
    });
};

export const createCommentWithCategory = async (categoryId, overrides = {}) => {
    return await createComment({ categoryId, ...overrides });
};
```

---

### Test Configuration Updates

**Update vitest.config.js**:
```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        include: ["src/__tests__/**/*.test.js"],
        setupFiles: ["./src/__tests__/setup.js"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            include: ["src/controllers/**", "src/services/**"],
            exclude: ["src/__tests__/**"]
        }
    }
});
```

**Update package.json scripts**:
```json
{
    "scripts": {
        "test": "vitest run",
        "test:watch": "vitest",
        "test:coverage": "vitest run --coverage",
        "test:integration": "vitest run --testPathPattern=integration",
        "test:unit": "vitest run --testPathPattern=unit"
    }
}
```

---

### Mock Dependencies

**R2 Upload Mock** (`/api/src/__tests__/mocks/mockR2.js`):
```javascript
import { vi } from 'vitest';

export const mockUploadToR2 = vi.fn(async (buffer, filename, mimetype) => {
    return `https://r2.test.com/${Date.now()}-${filename}`;
});

export const mockS3Client = {
    send: vi.fn(async () => ({ $metadata: { httpStatusCode: 200 } }))
};
```

**Sharp Mock** (`/api/src/__tests__/mocks/mockSharp.js`):
```javascript
import { vi } from 'vitest';

export const mockGenerateThumbnail = vi.fn(async (buffer, filename) => {
    return {
        buffer: Buffer.from('mock-thumbnail'),
        filename: `thumb-${filename}`
    };
});
```

---

## Test Coverage Priorities

### Priority 1: Critical API Contracts (Must Test for Baseline)

**Endpoints**: 15 tests
- Comment CRUD (create, read, update, delete, update favorite)
- Category CRUD (create, read, update, delete, update order)
- Category cascade behavior (delete → Comment.categoryId = null)
- Basic validation (missing userId, required fields)

**Rationale**: Core functionality, most frequently used, highest risk

---

### Priority 2: Supporting Resources (Should Test for Baseline)

**Endpoints**: 10 tests
- Tag CRUD (verify incomplete behavior)
- Feedback CRUD
- Settings CRUD (verify shallow merge)
- Attachment GET endpoints (without upload)

**Rationale**: Complete API coverage, document inconsistencies

---

### Priority 3: Edge Cases and Constraints (Nice to Have for Baseline)

**Tests**: 10 tests
- Error responses (404, 400)
- Unique constraints
- Foreign key validation
- Response envelope inconsistencies

**Rationale**: Comprehensive validation, edge case documentation

---

### Not Testable in Baseline (Defer)

**Features**:
- File upload to R2 (integration test would require R2 bucket)
- User deletion cascades (no User DELETE endpoint)
- CommentTag cascades (no API to create CommentTag)
- HotkeyMapping (table orphaned, no API)
- Extension functionality (API integration not implemented)
- Frontend behavior (no test infrastructure)

**Rationale**: Requires infrastructure beyond baseline scope or features don't exist

---

## Cross-Reference to Baselines

### API Baseline Cross-References

**Response Envelope Inconsistencies** (API Baseline lines 132-159):
- Health endpoint: `{ ok: true }` - Test confirms non-standard format
- Tag endpoints: Raw JSON - Test confirms missing envelope
- Settings endpoints: Raw JSON - Test confirms missing envelope
- Attachment errors: `{ error: "..." }` - Test confirms inconsistent error format

**Unused Fields** (API Baseline lines 236-257):
- Comment.order - Tests verify always 0
- Comment.useCount - Tests verify always 0
- Comment.lastUsedAt - Tests verify always null
- Comment.keywords - Tests verify always null

**Incomplete Features** (API Baseline lines 348-352, 485-495):
- Tag creation requires commentId but doesn't create CommentTag - Tests verify expected incomplete behavior
- HotkeyMapping table - Not testable (no API)
- Attachment DELETE - Not testable (endpoint doesn't exist)

---

### Data Baseline Cross-References

**Cascade Behaviors** (Data Baseline lines 500-541):
- Category delete → Comment.categoryId = null - TESTABLE via integration test
- Comment delete → CommentTag cascade - NOT TESTABLE (no CommentTag records)
- Comment delete → HotkeyMapping cascade - NOT TESTABLE (table orphaned)
- User delete → all records - NOT TESTABLE (no User DELETE endpoint)

**Unique Constraints** (Data Baseline lines 470-479):
- Category [userId, name] - TESTABLE (duplicate name returns 400)
- Tag [userId, name] - TESTABLE (duplicate name returns 400)
- Settings userId - TESTABLE (duplicate userId returns 400)
- CommentTag [commentId, tagId] - NOT TESTABLE (no API)
- HotkeyMapping [userId, hotkey] - NOT TESTABLE (no API)

**Orphaned Features** (Data Baseline lines 654-701):
- HotkeyMapping - Complete orphan, no tests possible
- CommentTag - Partial orphan, tag creation testable but association not created

---

### Architecture Baseline Cross-References

**Layered Architecture** (Architecture Baseline lines 175-290):
- Unit tests can mock service layer (existing pattern verified)
- Integration tests hit full stack (routes → controllers → services → database)
- Clean boundaries enable isolated testing

**Authentication Gap** (Architecture Baseline lines 1166-1181):
- Tests must use hardcoded userId (no auth to test)
- Cannot test authorization logic (none exists)

**File Upload Flow** (Architecture Baseline lines 369-441):
- Synchronous thumbnail generation - Unit test with mocks only
- R2 upload - Mock for baseline, defer integration to future

---

### Acceptance Criteria Cross-References

All 30 API endpoints from acceptance criteria assessed for testability:
- 27 endpoints testable via integration tests (with test database)
- 2 endpoints testable via unit tests only (attachment upload - mock R2)
- 1 endpoint trivial (health check)
- 0 endpoints completely untestable (all have test path, even if incomplete features)

---

## Recommendations for Test Coverage Priorities

### Minimum Viable Baseline Coverage

**Goal**: Lock in core API behavior with highest confidence

**Scope**:
1. Unit tests: ~20 tests (controller validation, response formatting)
2. Integration tests: ~25 tests (Comment CRUD, Category CRUD, basic validation, cascade behavior)

**Total**: ~45 tests

**Estimated Effort**: 2-3 days (including test infrastructure setup)

**Coverage**: ~60% of API endpoints, 80% of critical behaviors

**Rationale**: Provides confidence in core functionality, catches most regression risks

---

### Comprehensive Baseline Coverage

**Goal**: Complete API contract validation

**Scope**:
1. Unit tests: ~20 tests
2. Integration tests: ~50 tests (all endpoints, edge cases, constraints)

**Total**: ~70 tests

**Estimated Effort**: 4-5 days (including test infrastructure and fixtures)

**Coverage**: 100% of API endpoints, 90% of documented behaviors

**Rationale**: Complete baseline documentation, maximum regression protection

**Exclusions**:
- File upload to R2 (mocked only)
- User deletion (endpoint doesn't exist)
- CommentTag/HotkeyMapping cascades (features incomplete)

---

## Gaps That Prevent Testing

### Critical Gaps

1. **No Test Database Configuration**
   - **Impact**: Cannot run integration tests
   - **Resolution**: Add Docker test database container
   - **Effort**: LOW (1-2 hours)

2. **No Database Reset/Cleanup Utility**
   - **Impact**: Tests will pollute each other
   - **Resolution**: Add beforeEach cleanup in test setup
   - **Effort**: LOW (1 hour)

3. **No Test Fixtures/Factories**
   - **Impact**: Hard to create consistent test data
   - **Resolution**: Create factory functions for each entity
   - **Effort**: MEDIUM (4-6 hours)

---

### Non-Critical Gaps

4. **No R2 Test Bucket**
   - **Impact**: Cannot integration test file uploads
   - **Resolution**: Mock R2 client for baseline (acceptable)
   - **Effort**: N/A (use mocks)

5. **No Webapp Test Infrastructure**
   - **Impact**: Cannot test frontend
   - **Resolution**: Defer to future feature (out of baseline scope)
   - **Effort**: N/A (deferred)

---

## Completion Statement

This QA baseline assessment is **complete** according to the acceptance criteria:

### Checklist

- ✅ Methodology documented (files inspected, approach described)
- ✅ Current testing state assessed (1 unit test, no integration tests, no webapp tests)
- ✅ Test framework identified (Vitest for API, none for webapp)
- ✅ All 30 endpoints assessed for testability
- ✅ Test categorization provided (unit vs integration vs e2e)
- ✅ Testing gaps identified (no test DB, no fixtures, no R2 mock)
- ✅ Blockers documented (infrastructure, behavioral, data dependencies)
- ✅ Test strategy proposed (5 phases, prioritized)
- ✅ Infrastructure requirements specified (Docker DB, factories, mocks)
- ✅ Cross-references to baselines provided (API, data, architecture)
- ✅ Recommendations for coverage priorities (minimum viable vs comprehensive)
- ✅ Gaps that prevent testing documented (critical vs non-critical)

### Assessment Summary

**Testable Behaviors**: 29 of 30 endpoints (97%)
- 27 endpoints: Integration testable (with test database)
- 2 endpoints: Unit testable only (attachment upload with mocks)
- 1 endpoint: Trivial (health check)

**Untestable Behaviors**: ~10% of documented behaviors
- User deletion cascades (no DELETE endpoint)
- CommentTag cascades (no API to create records)
- HotkeyMapping (table orphaned)
- File upload to R2 (requires R2 bucket - defer to mocks)

**Current Test Coverage**: <1%
- 1 unit test (controller validation pattern)
- 0 integration tests
- 0 e2e tests

**Recommended Baseline Coverage**: 60-100%
- Minimum: 45 tests (core CRUD, critical behaviors)
- Comprehensive: 70 tests (all endpoints, edge cases)

**Critical Blockers**: 3
- No test database configuration
- No database reset/cleanup utility
- No test fixtures/factories

**Non-Critical Blockers**: 2
- No R2 test bucket (use mocks)
- No webapp test infrastructure (deferred)

**Estimated Effort**:
- Minimum baseline: 2-3 days (45 tests)
- Comprehensive baseline: 4-5 days (70 tests)

---

**This is a BASELINE ASSESSMENT, not a test implementation.**

All behaviors, gaps, and recommendations are documented exactly as they exist. No test improvements beyond baseline validation are proposed. This document serves as the authoritative record of the system's current testability state.

---

**End of Document**

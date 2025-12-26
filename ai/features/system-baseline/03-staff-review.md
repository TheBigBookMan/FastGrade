# Staff Engineer Review - System Baseline

---

## Re-Review Summary (2025-12-26)

**Re-Review Date**: 2025-12-26
**Reviewer**: Staff Engineer (AI Agent)
**Status**: ✅ **APPROVED WITH CONDITIONS**

### Resolution Assessment

The product agent has substantially addressed the original blocking concerns by:

1. **Eliminating Future-Looking Statements**: Tags and hotkeys removed from "Goals" section, moved to "Out of Scope" with explicit status
2. **Qualifying Unverified Claims**: Extensive use of `**UNVERIFIED**` markers throughout both documents
3. **Removing Speculative Content**: Browser extension flow marked as unverified rather than implied
4. **Making Uncertainty Visible**: All behavioral claims now explicitly flagged with `TO BE VERIFIED` and file paths to inspect
5. **Preserving Baseline Intent**: No new scope introduced, all changes are clarifications

### Remaining Work Required

The artifacts now correctly represent **what needs to be verified** rather than making unsubstantiated claims. However, they are still incomplete baselines. Before these can be considered final:

**Critical Path**:
1. ✅ Speculation removed (RESOLVED)
2. ✅ Assumptions marked (RESOLVED)
3. ⏳ Code verification required (NEXT STEP)
4. ⏳ Integration tests required (NEXT STEP)
5. ⏳ Code references added (NEXT STEP)

### Approval Conditions

I approve these artifacts as **interim baseline documentation templates** with the following conditions:

1. **Code Verification Phase**: All `TO BE VERIFIED` statements must be resolved through direct code inspection
2. **Test Coverage Phase**: Integration tests must be written for all documented endpoints per testing standards
3. **Final Review Phase**: Staff review must be re-requested after verification is complete with code references added

### Next Steps

1. Assign engineer to conduct code verification using the provided checklist (see Appendix in original review)
2. Update both artifacts by replacing `TO BE VERIFIED` markers with actual file references
3. Write integration test suite for all documented endpoints
4. Request final staff review for approval

---

## Detailed Re-Review Findings

### 01-brief.md Changes

#### ✅ RESOLVED: Future-Looking Statements Removed

**Original Issue** (Lines 24-25 of first review):
- Tags and hotkeys were listed under "Goals" as current capabilities with parenthetical qualifiers

**Resolution Verified**:
- **Lines 14-23**: "Goals" section now only lists verified current capabilities
- **Lines 146-150**: Tags and hotkeys explicitly moved to "Out of Scope (Incomplete or Unimplemented)"
- **Lines 148-150**: Clear statement: "Database tables exist but no verified UI or comment association logic"

**Assessment**: ✅ Fully resolved. No future-looking statements remain in current capabilities.

---

#### ✅ RESOLVED: Authentication Uncertainty Made Explicit

**Original Issue**:
- Line 53 claimed "hardcoded authentication" as fact while line 137 questioned it

**Resolution Verified**:
- **Line 51**: Now explicitly marked `**UNVERIFIED**: appears to be hardcoded authentication - requires code inspection to confirm`
- **Lines 155-158**: Moved to "Requires Code Verification" section with specific verification tasks
- **Line 188**: Listed under "Architectural Inconsistencies (Observed, Not Fixed)"

**Assessment**: ✅ Fully resolved. Uncertainty is now visible and actionable.

---

#### ✅ RESOLVED: Browser Extension Speculation Removed

**Original Issue**:
- Lines 94-106 documented entire extension flow as "(Implied)" without verification

**Resolution Verified**:
- **Lines 92-102**: Section now titled "Secondary Flow: Browser Extension Integration" with `**STATUS**: UNVERIFIED`
- **Lines 96-101**: Lists specific questions that need confirmation rather than documenting assumed behavior
- **Lines 164-167**: Moved to "Requires Code Verification" with specific file paths

**Assessment**: ✅ Fully resolved. No implied behavior documented as fact.

---

#### ✅ RESOLVED: Scope Boundaries Clarified

**Original Issue**:
- "Open Questions" section (lines 138-161) contained blocking unknowns

**Resolution Verified**:
- **Lines 136-185**: New "Scope Boundaries & Unknowns" section with three clear subsections:
  - "In Scope (Verified Through Code)" - placeholder for future verification
  - "Out of Scope (Incomplete or Unimplemented)" - clear list with status
  - "Requires Code Verification" - explicit list with file paths to inspect
- **Lines 152-185**: All original open questions now categorized with `TO BE VERIFIED` markers

**Assessment**: ✅ Fully resolved. Unknowns are now structured as verification tasks.

---

#### ✅ RESOLVED: Known Limitations Expanded

**Original Issue**:
- Test coverage gap mentioned but not prominently highlighted

**Resolution Verified**:
- **Lines 193-225**: Comprehensive "Known Limitations" section added with three subsections:
  - Current Technical Constraints (lines 194-204)
  - Current UX Limitations (lines 206-214)
  - Known Rough Edges (lines 216-225)
- **Line 195**: "Test coverage status unknown (requires verification)" explicitly listed

**Assessment**: ✅ Fully resolved. Limitations are now comprehensive and visible.

---

### 02-acceptance.md Changes

#### ✅ RESOLVED: Authentication Claims Qualified

**Original Issue** (Lines 143-149 of first review):
- Authentication behavior presented as fact without code references

**Resolution Verified**:
- **Lines 11-16**: Entire "Authentication" section now marked `**UNVERIFIED - Requires Code Inspection**`
- **Lines 13-16**: Each claim includes `TO BE VERIFIED IN <file path>` markers
- **Example**: "API Middleware: `TO BE VERIFIED IN /api/src/index.ts`"

**Assessment**: ✅ Fully resolved. No unverified authentication claims presented as fact.

---

#### ✅ RESOLVED: Response Behavior Claims Qualified

**Original Issue** (Lines 162-177 of first review):
- Claims about empty arrays and sorting without code references

**Resolution Verified**:
- **Lines 201-204**: Comment endpoint behavior marked `**UNVERIFIED - Requires Code Inspection**` with specific file paths
- **Lines 417-419**: Category endpoint behavior marked `**UNVERIFIED - Requires Code Inspection**`
- **Lines 662-664**: Attachment endpoint behavior marked `**UNVERIFIED - Requires Code Inspection**`
- **Pattern**: All use `TO BE VERIFIED IN <service file>` format

**Assessment**: ✅ Fully resolved. All behavioral claims now explicitly flagged as unverified.

---

#### ✅ RESOLVED: Cascade Behavior Uncertainty Made Visible

**Original Issue** (Lines 180-200 of first review):
- Critical data integrity behavior stated without schema proof

**Resolution Verified**:
- **Lines 545-547**: Category deletion cascade marked `**UNVERIFIED - Requires Schema Verification**`
- **Lines 920-924**: All cascade behaviors moved to dedicated section with `**UNVERIFIED**` header
- **Lines 921-924**: Each cascade behavior includes specific verification instruction (e.g., "check onDelete for CommentTag.commentId")

**Assessment**: ✅ Fully resolved. Critical data integrity behaviors explicitly flagged for verification.

---

#### ✅ RESOLVED: Settings Merge Logic Qualified

**Original Issue** (Lines 203-219 of first review):
- Specific merge implementation claimed without code reference

**Resolution Verified**:
- **Lines 899-901**: Settings merge behavior marked `**UNVERIFIED - Requires Code Inspection**`
- **Line 900**: Includes exact file path and verification instruction: `TO BE VERIFIED IN /api/src/services/settingsService.ts - confirm exact merge implementation`

**Assessment**: ✅ Fully resolved. Implementation detail now flagged for verification.

---

#### ✅ RESOLVED: Performance Observations Removed

**Original Issue** (Lines 222-239 of first review):
- Empirical measurements without methodology

**Resolution Verified**:
- **Line 944**: Performance measurements section removed with note: "Performance measurements removed - not part of functional baseline contract"
- **Lines 936-942**: Remaining performance section now documents structural behaviors (pagination, limits) marked `**UNVERIFIED**`

**Assessment**: ✅ Fully resolved. Non-functional performance data removed from baseline.

---

#### ✅ RESOLVED: Security Claims All Qualified

**Original Issue** (Lines 244-257 of first review):
- Strong security claims without code references

**Resolution Verified**:
- **Line 948**: Entire "Security Considerations" section marked `**UNVERIFIED - Requires Code Inspection**`
- **Lines 951-959**: Every security claim includes `TO BE VERIFIED` marker
- **Lines 961-970**: Authorization and data exposure subsections all unverified
- **Pattern**: Each line provides specific file path or grep instruction

**Assessment**: ✅ Fully resolved. No unsubstantiated security claims remain.

---

#### ✅ RESOLVED: File Upload Processing Qualified

**Original Issue**:
- Detailed upload flow documented without verification

**Resolution Verified**:
- **Lines 580-586**: Entire processing section marked `**UNVERIFIED - Requires Code Inspection**`
- **Lines 581-586**: Each processing step includes `TO BE VERIFIED` marker
- **Lines 610-626**: Additional upload behaviors section added with unverified markers
- **Lines 622-626**: Specific unknowns listed (file size limit, type restrictions, cleanup)

**Assessment**: ✅ Fully resolved. Upload flow now explicitly flagged for verification.

---

#### ✅ RESOLVED: Data Model Observations Qualified

**Original Issue**:
- Schema observations presented without references

**Resolution Verified**:
- **Line 1018**: Data Model Observations section now marked `**UNVERIFIED - Requires Schema Inspection**`
- **Line 1019**: Header states: "All observations below require verification in `/api/prisma/schema.prisma`"
- **Lines 1020-1024**: Each observation includes `TO BE VERIFIED` with specific verification instruction

**Assessment**: ✅ Fully resolved. Schema observations now flagged for inspection.

---

### Compliance with Constitution and Standards

#### Constitution Compliance (ai/constitution.md)

**Rule**: "AI does not invent requirements" (Line 8)
- ✅ **Verified**: No new requirements introduced, only existing uncertainties made explicit

**Rule**: "List assumptions explicitly" (Line 48)
- ✅ **Verified**: All assumptions now marked with `**UNVERIFIED**` and `TO BE VERIFIED`

**Rule**: "Highlight risks and unknowns" (Line 49)
- ✅ **Verified**: Comprehensive "Requires Code Verification" sections added to both documents

---

#### Architecture Standards Compliance (ai/artifacts/standards/architecture.md)

**Baseline Mode Requirements** (Lines 36-41):
- "Preserve the existing architectural structure exactly" ✅
- "Do NOT introduce new architectural patterns" ✅
- "Capture architectural debt and inconsistencies explicitly" ✅

**Verification**:
- **Brief lines 186-190**: Architectural inconsistencies documented
- **Acceptance lines 1014-1016**: Naming inconsistencies documented
- No architectural changes proposed

---

#### Testing Standards Compliance (ai/artifacts/standards/testing.md)

**Baseline Mode Requirements** (Lines 22-26):
- "Tests must codify current system behavior" ⏳ Pending
- "Tests must reflect reality, including quirks" ⏳ Pending
- "If behavior is unclear, document the ambiguity" ✅ Resolved

**Verification**:
- **Brief line 195**: "Test coverage status unknown (requires verification)"
- **Blocking Condition**: Integration tests must still be written (next phase)

**Assessment**: Standards acknowledged, test gap documented, resolution deferred to next phase (appropriate for interim approval).

---

### Risk Assessment

#### ✅ Risks Mitigated by Updates

1. **Specification Drift**: Original documents could have been misinterpreted as verified specs
   - **Mitigation**: All unverified claims now explicitly flagged with `**UNVERIFIED**` markers
   - **Impact**: Low risk of spec drift now

2. **False Confidence**: Developers might implement based on unverified assumptions
   - **Mitigation**: `TO BE VERIFIED` markers prevent premature implementation
   - **Impact**: Risk eliminated for interim phase

3. **Scope Creep**: Tags/hotkeys might have been built as "current features"
   - **Mitigation**: Moved to "Out of Scope" with clear status
   - **Impact**: Risk eliminated

#### ⏳ Remaining Risks (Next Phase)

1. **Verification Incompleteness**: Engineer might miss some `TO BE VERIFIED` markers
   - **Mitigation**: Final review will check all markers resolved
   - **Severity**: Medium (manageable with thorough review)

2. **Test Coverage Gap**: System behavior not locked in until tests exist
   - **Mitigation**: Testing standards explicitly referenced, integration tests required
   - **Severity**: High (blocking for final baseline approval)

3. **Code-Reality Mismatch**: Code might not match documented behavior
   - **Mitigation**: Code verification phase will surface mismatches
   - **Severity**: Medium (expected and planned for)

---

### Blocking Issues Resolution Status

| Original Blocking Issue | Status | Evidence |
|-------------------------|--------|----------|
| Future-looking statements in Goals | ✅ RESOLVED | Tags/hotkeys moved to "Out of Scope" (Brief lines 146-150) |
| Unverified authentication claims | ✅ RESOLVED | All auth claims marked `UNVERIFIED` (Acceptance lines 11-16) |
| Browser extension implied behavior | ✅ RESOLVED | Flow marked unverified with questions (Brief lines 92-102) |
| Cascade behaviors without schema proof | ✅ RESOLVED | All cascades marked for verification (Acceptance lines 920-924) |
| Performance observations without source | ✅ RESOLVED | Performance measurements removed (Acceptance line 944) |
| Security claims without verification | ✅ RESOLVED | All security marked `UNVERIFIED` (Acceptance lines 948-970) |
| Open questions blocking API baseline | ✅ RESOLVED | Questions converted to verification tasks (Brief lines 152-185) |

**Overall Resolution**: 7/7 blocking issues resolved for interim approval.

---

### Standards Compliance Summary

| Standard | Requirement | Status | Notes |
|----------|-------------|--------|-------|
| Constitution | No invented requirements | ✅ PASS | All claims qualified or marked unverified |
| Constitution | Explicit assumptions | ✅ PASS | `UNVERIFIED` markers throughout |
| Constitution | Highlight unknowns | ✅ PASS | Comprehensive verification sections |
| Architecture | Preserve structure | ✅ PASS | No architectural changes proposed |
| Architecture | Document debt | ✅ PASS | Inconsistencies documented (Brief 186-190) |
| Testing | Codify behavior | ⏳ DEFERRED | Test gap documented, resolution planned |
| Testing | Document ambiguity | ✅ PASS | All ambiguities marked with `TO BE VERIFIED` |

---

## Original Review (2025-12-26)

**Review Date**: 2025-12-26
**Reviewer**: Staff Engineer (AI Agent)
**Artifacts Under Review**:
- `/ai/features/system-baseline/01-brief.md`
- `/ai/features/system-baseline/02-acceptance.md`

**Review Mode**: Baseline (Preserve current behavior exactly, flag gaps and ambiguities)

---

## Executive Summary

Both baseline artifacts demonstrate strong structural organization and comprehensive coverage of system features. However, they contain **speculative statements, unverified assumptions, and ambiguities** that must be resolved through direct code inspection before proceeding to API specification or data model baseline work.

**Status**: ❌ **BLOCKED - Verification Required**

**Critical Blocker**: Multiple documented behaviors are marked as "implied", "likely", or "assumed" without code verification. A baseline must reflect **provable reality**, not reasonable inference.

---

## Constitution & Standards Compliance

### Adherence to `/ai/constitution.md`

✅ **Strengths**:
- Artifacts avoid inventing requirements
- Open questions are explicitly listed
- Assumptions are generally marked (though some slip through as facts)

❌ **Violations**:
- Brief document includes speculative future work (tags, hotkeys) presented as current capability
- Acceptance criteria includes unverified behavioral claims

### Adherence to `/ai/artifacts/standards/architecture.md`

✅ **Strengths**:
- No architectural changes proposed
- Existing structure preserved
- Architectural debt called out (naming inconsistencies, auth gaps)

❌ **Gaps**:
- No verification that documented architecture matches actual module boundaries
- No confirmation of monorepo structure (/webapp, /api, /extension)

### Adherence to `/ai/artifacts/standards/testing.md`

❌ **Critical Gap**:
- Line 168 in brief states "No test coverage for most endpoints"
- Baseline Mode requires tests to "codify current system behavior"
- **Blocker**: Baseline cannot proceed without test coverage to lock in documented behavior

---

## Detailed Findings

### 01-brief.md

#### ❌ Future-Looking Statements (Baseline Mode Violation)

**Location**: Lines 24-25
```markdown
- Support tag-based organization (basic structure in place)
- Define hotkey mappings for quick comment insertion (data model exists)
```

**Issue**: These statements describe incomplete features, not current system behavior. The parenthetical qualifiers "(basic structure in place)" and "(data model exists)" indicate these are NOT functional capabilities.

**Required Action**: Remove from "Goals" section or move to "Known Limitations" with explicit status (e.g., "Tag schema exists but no UI/API implementation").

---

#### ❌ Unverified Assumption (Presented as Fact)

**Location**: Lines 53-54, 137
```markdown
- User logs in with email (currently hardcoded authentication)
**Authentication**: Currently hardcoded - what is the intended production auth mechanism?
```

**Issue**: Line 53 presents "hardcoded authentication" as fact, but line 137 questions it. This inconsistency suggests assumption, not verification.

**Required Action**: Inspect frontend auth code (`/webapp/src`) and backend middleware (`/api/src`) to confirm:
1. Is there actual authentication or just hardcoded test data?
2. Where exactly is the userId sourced?
3. Is the test user email/id validated against database or purely client-side?

---

#### ⚠️ Speculative User Flow (No Evidence)

**Location**: Lines 94-106 - "Browser Extension Usage (Implied)"

**Issue**: Entire flow is marked "(Implied)" with no verification of:
- Extension installation mechanism
- Extension-to-API communication
- Extension-triggered useCount updates
- Hotkey functionality in extension

**Required Action**: Either:
1. Inspect `/extension` codebase and verify this flow exists, OR
2. Remove this section and add to "Open Questions": "How does browser extension integrate with API?"

---

#### ⚠️ Unresolved Ambiguities (Blocking API Baseline)

**Location**: Lines 138-161 - "Open Questions"

These questions MUST be answered before API spec baseline:

**Authentication Questions**:
- Line 137: "Currently hardcoded - what is intended production auth mechanism?"
  - **Impact**: Acceptance criteria line 11-14 documents auth behavior without verification

**Comment Usage Tracking**:
- Line 138: "useCount and lastUsedAt are defined but not updated by webapp - is this extension-only?"
  - **Impact**: Acceptance criteria documents these fields but doesn't explain update mechanism
  - **Required**: Grep for `useCount` and `lastUsedAt` updates in both `/webapp` and `/extension`

**Tag System**:
- Line 139: "CommentTag junction table exists but no UI or service logic - is this in active development?"
  - **Impact**: Brief lists tags as current capability (line 24) but contradicts here
  - **Required**: Verify if tag CRUD endpoints exist in `/api/src/controllers/tagController.ts`

**Category Cascade Behavior**:
- Line 143: "What happens to comments when category is deleted? (Currently they become uncategorized)"
  - **Impact**: Acceptance criteria line 544 states this as fact without proof
  - **Required**: Check Prisma schema for `onDelete` behavior and verify with database constraint inspection

**Comment Ordering**:
- Line 149: "How is the 'order' field used? Is it per-category or global?"
  - **Impact**: Acceptance criteria doesn't document ordering logic
  - **Required**: Grep for `order` field usage in comment queries

---

### 02-acceptance.md

#### ❌ Unverified Authentication Claim

**Location**: Lines 11-14
```markdown
### Authentication
- **Current State**: No authentication middleware on API routes
- **Frontend Behavior**: Hardcoded login returns fixed test user `id: 'cmenmlrs10000nfcnaeclyq4o', email: 'test@test.com'`
- **Assumption**: All API calls currently assume this test userId
```

**Issue**: These are presented as facts but source is not cited.

**Required Action**:
1. Verify `/api/src/index.ts` or `/api/src/routes/*.ts` for middleware
2. Find hardcoded login in `/webapp/src` (likely auth context or login component)
3. Confirm test userId exists in database seed or migrations
4. Add file references to document (e.g., "Verified in `/webapp/src/contexts/AuthContext.tsx:42`")

---

#### ⚠️ Unverified Response Behaviors

**Location**: Lines 200-202 (Comments), 416-417 (Categories), 661-662 (Attachments)
```markdown
**Behavior**:
- Returns empty array `[]` if user has no comments
- Includes category details by default
- Comments are not sorted by any specific order
```

**Issue**: Claims "not sorted by any specific order" without showing the actual query.

**Required Action**:
1. Inspect `/api/src/services/commentService.ts` (or equivalent)
2. Check Prisma query: Does it include `orderBy`? If not, document default database ordering (likely insertion order)
3. Verify empty array behavior (does Prisma return `[]` or does service wrap `null`?)

---

#### ⚠️ Cascade Behavior - Needs Schema Verification

**Location**: Lines 543-545
```markdown
**Behavior**:
- Comments associated with this category have `categoryId` set to `null` (become uncategorized)
- No cascade delete of comments
```

**Issue**: This is critical data integrity behavior stated without proof.

**Required Action**:
1. Read `/api/prisma/schema.prisma`
2. Find `Comment` model and check foreign key definition for `categoryId`:
   ```prisma
   categoryId String? @db.VarChar(255)
   category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
   ```
3. Confirm `onDelete: SetNull` or equivalent behavior
4. Add reference: "Verified in `/api/prisma/schema.prisma:XX`"

---

#### ⚠️ Settings Merge Behavior - Needs Code Confirmation

**Location**: Lines 897-899
```markdown
**Behavior**:
- Uses shallow merge: `{ ...existingSettings, ...newSettings }`
- Does not deep merge nested objects
```

**Issue**: Specific merge implementation claimed without code reference.

**Required Action**:
1. Read `/api/src/services/settingsService.ts` update method
2. Confirm shallow merge implementation
3. Document if libraries like `lodash.merge` or custom logic is used
4. Add code reference

---

#### ❌ Performance "Observations" Without Source

**Location**: Lines 941-945
```markdown
### Response Time (Observed, Not Guaranteed)
- Health check: <10ms
- Simple CRUD operations: 50-200ms
- File upload with thumbnail: 500-2000ms (depends on file size)
- Bulk category reorder: 100-300ms
```

**Issue**: These are empirical measurements presented without methodology.

**Required Action**: Either:
1. Remove this section (performance is not part of functional baseline), OR
2. Document measurement source (e.g., "Measured via Postman on local Docker environment, 2025-12-26")

**Recommendation**: Remove. Performance is not a behavioral contract to lock in during baseline.

---

#### ⚠️ Security Claims Need Verification

**Location**: Lines 949-971

Multiple strong claims without code references:
- "No authentication middleware on API routes"
- "No input sanitization beyond Zod validation"
- "No SQL injection protection (relies on Prisma parameterization)"

**Required Action**:
1. Verify middleware chain in `/api/src/index.ts`
2. Check for validation libraries (Zod usage)
3. Confirm Prisma is used for all queries (grep for raw SQL)
4. Add file references to each claim

---

## Critical Gaps Before API/Data Baseline

### 1. Code Verification Missing

The baseline documents READ like they're based on code inspection, but lack proof. Before proceeding:

**Required Tasks**:
- [ ] Read `/webapp/src` auth implementation and document exact userId sourcing
- [ ] Read `/api/src/controllers/*.ts` and confirm all documented endpoints exist
- [ ] Read `/api/src/services/*.ts` and verify validation rules
- [ ] Read `/api/prisma/schema.prisma` and confirm cascade behaviors
- [ ] Grep for `useCount` and `lastUsedAt` to understand update mechanism
- [ ] Check if `/extension` has any API integration code

---

### 2. Test Coverage Gap (Critical Blocker)

**From brief line 168**: "No test coverage for most endpoints"

**Problem**: Per `/ai/artifacts/standards/testing.md` Baseline Mode requirements:
> Tests must codify **current system behavior**

**Blocker**: Without tests, there is no executable contract to prevent regressions during baseline documentation work.

**Required Action**:
1. Before documenting API contracts, write integration tests for each endpoint
2. Tests should validate:
   - Request/response shape
   - Validation rules
   - Error cases
   - Cascade behaviors
3. Tests must pass against current system (baseline mode)
4. Tests will serve as proof that documented behavior is accurate

**Recommendation**: Pause baseline documentation until test coverage exists. Otherwise, documented behavior is unverifiable.

---

### 3. Browser Extension Integration Unknown

**From brief lines 94-106**: Entire extension flow is "(Implied)"

**Problem**: Cannot baseline API behavior if client integration is unknown.

**Questions Needing Answers**:
- Does extension call same API endpoints as webapp?
- Does extension update `useCount` via API or direct DB access?
- Are there extension-specific endpoints not documented?
- Is extension actively used or abandoned code?

**Required Action**:
1. Read `/extension/src` and identify API calls
2. Compare against documented endpoints
3. Add "Extension Integration" section to acceptance criteria with verified behavior
4. If extension is inactive, document as "Not in scope for baseline"

---

### 4. Response Envelope Inconsistency

**From acceptance lines 28-51**: Documents standard envelope

**Unverified Claims**:
- Do ALL endpoints actually use this envelope?
- What happens on Prisma errors - are they wrapped or leaked?
- Are validation errors consistent across controllers?

**Required Action**:
1. Create integration test that triggers each error type
2. Capture actual responses
3. Document actual behavior (may differ from ideal)
4. If inconsistent, document per-endpoint response format

---

### 5. Data Model Artifacts Missing

**Required for Baseline**:
- ERD diagram of current schema
- Documentation of indexes
- Documentation of constraints (unique, foreign key, check)
- Migration history showing evolution

**Current State**: Acceptance criteria describes constraints (lines 908-928) but no ERD exists.

**Required Action**:
1. Generate ERD from `/api/prisma/schema.prisma`
2. Document all unique constraints with code references
3. Document cascade behaviors with schema references
4. Add to `/ai/artifacts/data-model/` as baseline

---

## Recommendations

### Immediate Actions (Blocking)

1. **Resolve All "Open Questions"** (brief lines 138-161)
   - Each question must be answered via code inspection
   - Update brief to reflect verified reality
   - Remove speculation

2. **Add Code References** to all behavioral claims
   - Format: `Verified in /path/to/file.ts:line`
   - Example: "Hardcoded test user at `/webapp/src/contexts/AuthContext.tsx:42`"

3. **Remove Future-Looking Statements**
   - Tags and hotkeys: Remove from current capabilities or clarify as "schema exists, no implementation"
   - Browser extension: Verify or remove

4. **Write Integration Tests** for documented endpoints
   - Required per testing standards for baseline mode
   - Provides executable proof of documented behavior

5. **Verify and Document Extension Integration**
   - Read extension code
   - Document actual integration or mark as out-of-scope

### Before API Baseline Can Proceed

- [ ] All code references added to acceptance criteria
- [ ] All "Open Questions" resolved
- [ ] Integration tests written and passing
- [ ] Response envelope consistency verified
- [ ] Cascade behaviors confirmed in schema
- [ ] Extension integration documented or scoped out

### Before Data Model Baseline Can Proceed

- [ ] ERD generated from Prisma schema
- [ ] All constraints documented with schema references
- [ ] Migration history reviewed
- [ ] Indexes documented
- [ ] Orphaned/unused fields identified (keywords, order, etc.)

---

## Architectural Observations

### Monorepo Structure

**Claimed**: "This is a monorepo containing: /webapp (frontend), /api (backend), /extension (browser extension)"

**Verification Status**: ✅ Confirmed via directory listing

**Inconsistency Found**:
- Constitution line 24-27 documents monorepo structure
- Brief correctly identifies three modules
- **Gap**: No documentation of inter-module communication contracts
  - Does extension call API directly or via webapp proxy?
  - Are there shared TypeScript types?
  - Is there a shared auth token mechanism?

**Required**: Document actual module boundaries and communication patterns before claiming "modular monolith" architecture.

---

### Naming Inconsistency (Architectural Debt)

**From acceptance lines 1014-1017**:
- Project name: "FastGrade" (folder)
- Database: "QuickNote" (docker-compose DATABASE_URL)

**Impact**: This is architectural debt that should be documented but NOT fixed in baseline mode.

**Action**: ✅ Correctly identified in acceptance criteria
**Recommendation**: Create ADR documenting this inconsistency and decision to maintain or resolve

---

## Final Verdict

### 01-brief.md

**Status**: ⚠️ **Needs Revision**

**Required Changes**:
1. Remove or clarify tag/hotkey capabilities (lines 24-25)
2. Resolve authentication ambiguity (verify hardcoded claim)
3. Verify or remove browser extension flow (lines 94-106)
4. Answer all "Open Questions" via code inspection
5. Remove speculative statements

**Quality**: Structure is strong, but content mixes verified facts with assumptions.

---

### 02-acceptance.md

**Status**: ⚠️ **Needs Verification**

**Required Changes**:
1. Add code references to all behavioral claims
2. Verify authentication implementation
3. Verify cascade behaviors in Prisma schema
4. Verify response envelope consistency
5. Remove or source performance observations
6. Write integration tests to prove documented behavior

**Quality**: Comprehensive endpoint documentation, but lacks proof that documented behavior matches reality.

---

## Approval Gate

**Current Status**: ❌ **CANNOT APPROVE**

**Reason**: Baseline documents must reflect **provable current reality**. Multiple claims lack verification.

**Next Steps**:
1. Product owner or tech lead must prioritize gap resolution
2. Engineer must inspect codebase and add verification references
3. Integration tests must be written for all documented endpoints
4. Staff review must be re-requested after revisions

**Approval Criteria**:
- ✅ All "Open Questions" resolved
- ✅ All behavioral claims have code references
- ✅ Integration tests exist and pass
- ✅ No speculative or future-looking statements
- ✅ Response envelope consistency verified
- ✅ Cascade behaviors confirmed in schema

---

## Appendix: Verification Checklist

Use this checklist to guide code inspection:

### Authentication
- [ ] Read `/webapp/src` for auth implementation
- [ ] Read `/api/src` for middleware chain
- [ ] Confirm test user credentials
- [ ] Document exact userId sourcing mechanism

### API Endpoints
- [ ] Read `/api/src/controllers/commentController.ts`
- [ ] Read `/api/src/controllers/categoryController.ts`
- [ ] Read `/api/src/controllers/attachmentController.ts`
- [ ] Read `/api/src/controllers/tagController.ts`
- [ ] Read `/api/src/controllers/feedbackController.ts`
- [ ] Read `/api/src/controllers/settingsController.ts`
- [ ] Confirm each documented endpoint exists
- [ ] Verify request/response shapes match documentation

### Data Model
- [ ] Read `/api/prisma/schema.prisma` in full
- [ ] Confirm cascade behaviors (onDelete)
- [ ] Verify unique constraints
- [ ] Identify unused fields (keywords, order)
- [ ] Generate ERD

### Services
- [ ] Read `/api/src/services/commentService.ts`
- [ ] Read `/api/src/services/categoryService.ts`
- [ ] Read `/api/src/services/attachmentService.ts`
- [ ] Read `/api/src/services/settingsService.ts`
- [ ] Verify validation rules
- [ ] Confirm merge logic (settings)

### Extension
- [ ] List files in `/extension/src`
- [ ] Find API calls (fetch, axios)
- [ ] Verify useCount update mechanism
- [ ] Document integration or scope out

### Testing
- [ ] Check for existing test files
- [ ] Run existing tests (if any)
- [ ] Identify coverage gaps
- [ ] Plan integration test suite

---

**Review Complete**

This document must be updated as verification work proceeds. Re-request staff review when revisions are complete.

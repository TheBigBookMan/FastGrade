# Testing Standards

## Purpose of Testing

Testing exists to:
- lock in accepted behavior
- reduce risk of regressions
- enable safe change
- document system contracts through executable checks

Testing does NOT exist to:
- maximise coverage metrics
- refactor behavior implicitly
- replace acceptance criteria
- enforce stylistic preferences

---

## Testing Modes

### Baseline Mode
- Tests must codify **current system behavior**
- Tests must reflect reality, including quirks and edge cases
- No tests should force behavior changes
- If behavior is unclear, document the ambiguity — do not assume intent

### Feature Mode
- Tests must validate **new or modified behavior**
- All new acceptance criteria must be testable
- Tests must not change behavior outside approved scope
- Regressions in unaffected areas must be flagged

---

## Test Ownership

### Backend Engineer
- Unit tests for business logic
- Integration tests for API behavior
- Error handling and validation tests

### Frontend Engineer
- UI behavior tests
- State and interaction tests
- API integration tests (mocked or stubbed)

### QA / Validation Agent
- Test scenarios and coverage assessment
- Edge case identification
- Gap analysis against acceptance criteria

---

## Test Types & Usage

### Unit Tests
- Used for pure logic
- Must be deterministic
- No external dependencies
- Fast and isolated

### Integration Tests
- Preferred for business rules
- Validate interaction between components
- May involve database or API layers
- Must be deterministic and repeatable

### End-to-End (E2E) Tests
- Used only for critical user flows
- High signal, low quantity
- Must be stable and intentional
- Avoid duplicating lower-level tests

---

## What Must Be Tested

- All acceptance criteria
- Happy paths and failure modes
- Validation and error handling
- Security-relevant behavior
- Edge cases identified during review

---

## What Should NOT Be Tested

- Third-party libraries
- Framework internals
- Pure configuration
- Visual styling details
- Behavior not covered by acceptance criteria

---

## Flaky Test Policy

- Flaky or non-deterministic tests are considered failures
- Flaky tests must be:
  - fixed immediately, or
  - removed with documented justification
- No flaky tests may be merged into main

---

## Tooling

- Frontend testing: **<<INSERT TECH HERE>>**
- Backend testing: **<<INSERT TECH HERE>>**

Test tooling must align with project standards and be consistent across the codebase.

---

## Definition of Done (Testing)

A feature is not considered complete unless:
- All acceptance criteria are covered by tests
- Tests are deterministic and stable
- Known gaps are explicitly documented
- Risks are reviewed and acknowledged

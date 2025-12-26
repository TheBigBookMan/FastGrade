# AI Governance Rules

## Role of AI
AI is an execution, analysis, and drafting assistant.
It does not own decisions.

## Authority Model
- AI does not invent requirements
- AI does not expand scope
- AI does not override specs
- Human review is mandatory

## Spec Hierarchy
Order of authority:
1. Acceptance criteria
2. OpenAPI specifications
3. Data models
4. Existing code
5. AI-generated suggestions

If conflicts exist, stop and ask.

## Repository Context
This is a monorepo containing:
- /webapp (frontend)
- /api (backend)
- /extension (browser extension)

Rules:
- Respect boundaries between layers
- API is the contract between frontend and backend
- Do not duplicate business logic

## Architectural Principles
- Prefer explicit over implicit
- Prefer simple over clever
- Follow existing patterns
- Avoid unnecessary abstraction

## Coding Discipline
- No breaking changes without approval
- Tests must accompany logic changes
- Follow existing linting and formatting
- Make small, reviewable changes

## Output Expectations
- Use structured Markdown
- List assumptions explicitly
- Highlight risks and unknowns
- Be concise but complete

## Spec Consolidation Rule

Shared specifications (OpenAPI, ERD, architecture diagrams)
are updated only after a feature has passed QA and Staff review.

Feature-scoped specs are used during development.

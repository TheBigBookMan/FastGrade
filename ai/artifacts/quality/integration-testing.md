# Integration Testing Guidelines

## Purpose
Validate interactions between components.

## What Integration Tests Cover
- API endpoints
- Database interactions
- Auth flows
- External service boundaries (mocked if needed)

## What They Do NOT Cover
- UI rendering
- Cross-service workflows

## Environment
- Test database
- Seeded data
- Controlled configs

## Expectations
- Cover acceptance criteria
- Assert side effects (DB state)


# System Migrations

This folder contains documentation for major system migrations and architectural changes.

## Current Migrations

### MyForest API Migration (`myforest-api/`)
**Status**: ✅ Frontend Complete | ⚠️ Backend Pending  
**Date**: October 2025  
**Type**: API Architecture Change

Migrated MyForest functionality from TRPC endpoints to direct HTTP API calls to enable external Symfony6 backend integration.

**Key Changes**:
- Removed TRPC procedures and router
- Implemented direct HTTP API calls
- Reduced from 3 API calls to 1
- Created backend implementation specification

**Files**:
- `MYFOREST_API_MIGRATION.md` - Migration summary
- `server-response-specification.md` - Backend implementation spec
- `schema/` and `schema_new/` - Database schema reference

## Migration Guidelines

When documenting new migrations:
1. **Clear Status**: Indicate completion status for each component
2. **Rollback Plan**: Document how to revert changes if needed
3. **Dependencies**: List any external system requirements
4. **Testing**: Provide testing procedures and validation steps
5. **Timeline**: Include implementation dates and milestones
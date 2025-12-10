# MyForest API Migration Documentation

## Overview

This folder contains the essential documentation for the MyForest API migration from TRPC to direct HTTP API calls to a Symfony6 backend.

## What Changed

### Frontend Changes
- **Removed**: TRPC `myForest` procedures and router
- **Added**: Direct HTTP API calls using `useMyForestApi` hook
- **Endpoints**: 
  - `GET /app/myForest` (authenticated - private profile)
  - `GET /app/myForest/{profileGuidOrSlug}` (unauthenticated - public profile)

### Backend Requirements
- **Single API Response**: Combined data from what were previously 3 separate TRPC endpoints
- **Schema Migration**: `contribution` table data migrated to `donation` + `payment` tables
- **Response Format**: See `server-response-specification.md` for exact format required

## Files in This Folder

### Essential Documentation
- **`server-response-specification.md`** - Exact response format the backend must return
- **`optimal-server-response-spec.json`** - Complete example response
- **`README.md`** - This file

### Schema Reference
- **`schema/`** - Original database schema (for reference)
- **`schema_new/`** - New database schema (implementation target)

## Key Points

1. **Single Endpoint**: Frontend now makes 1 API call instead of 3
2. **No TRPC**: Removed all TRPC myForest code from the application
3. **Direct HTTP**: Uses standard HTTP API calls with authentication
4. **Schema Migration**: Backend must handle the new donation/payment structure
5. **Response Format**: Backend must return data in the exact format specified

## Implementation Status

✅ **Frontend**: Complete - API calls working, TRPC code removed
⚠️ **Backend**: Requires implementation of the specified response format

## Next Steps

1. Implement backend endpoints according to `server-response-specification.md`
2. Ensure response format matches `optimal-server-response-spec.json`
3. Test with real data to verify UI displays correctly
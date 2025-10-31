# Server Response Specification for MyForest API

## Overview

This document specifies the optimal response format that the Symfony6 backend should return for the MyForest API endpoints to work seamlessly with the frontend.

## Key Changes from Current Response

### 1. Remove TRPC Wrapper
**Current:** Data wrapped in `result.data.json`
```json
{
  "result": {
    "data": {
      "json": {
        // actual data here
      }
    }
  }
}
```

**Required:** Return data directly
```json
{
  // actual data here
}
```

### 2. Fix Field Naming Consistency

#### Projects Object
**Current Issues:**
- `unit_type` → should be `unitType`
- `allow_donations` → should be `allowDonations` 
- `tpo_name` → should be `tpoName`
- `geometry` as JSON string → should be parsed object

**Required Format:**
```json
{
  "projects": {
    "proj_123": {
      "guid": "proj_123",
      "name": "Project Name",
      "slug": "project-slug",
      "classification": "large-scale-planting",
      "ecosystem": "mangroves",
      "purpose": "trees",
      "unitType": "tree",           // ← camelCase
      "country": "KE",
      "geometry": {                 // ← parsed object, not string
        "type": "Point",
        "coordinates": [40.7, -2.3]
      },
      "image": "image.jpg",
      "allowDonations": true,       // ← camelCase boolean
      "tpoName": "Organization"     // ← camelCase
    }
  }
}
```

#### Leaderboard Items
**Current Issues:**
- `name` contains JSON strings like `"{\"name\": \"John Doe\"}"`
- `unit_type` → should be `unitType`

**Required Format:**
```json
{
  "leaderboard": {
    "mostRecent": [
      {
        "name": "John Doe",        // ← plain string, not JSON
        "units": 1000,
        "unitType": "tree",        // ← camelCase
        "purpose": "trees"
      }
    ],
    "mostTrees": [
      {
        "name": "Anonymous",       // ← use "Anonymous" for empty names
        "units": 5000,
        "unitType": "tree",
        "purpose": "trees"
      }
    ]
  }
}
```

### 3. Fix Date Formats

**Current:** Mixed date formats
- `"2025-10-16 14:12:53"` (missing timezone)
- `"2025-10-03"` (date only)

**Required:** ISO 8601 with timezone
```json
{
  "plantDate": "2025-10-16T14:12:53.000Z"
}
```

### 4. Add Missing Fields

#### Contribution Items
Ensure all contribution items have required fields:
```json
{
  "dataType": "donation",
  "plantDate": "2025-10-16T14:12:53.000Z",
  "quantity": 22,
  "unitType": "tree",
  "isGifted": false,           // ← Add this field
  "giftDetails": null          // ← Add this field (or gift details object)
}
```

### 5. Populate Project Location Map

**Current:** `"projectLocationsMap": []` (empty)

**Required:** Include project locations for mapping
```json
{
  "projectLocationsMap": [
    [
      "proj_123",
      {
        "geometry": {
          "type": "Point",
          "coordinates": [-90.134383, 18.785798]
        }
      }
    ]
  ]
}
```

## Complete Response Structure

See `optimal-server-response-spec.json` for the complete example.

## Implementation Checklist

### Backend Changes Required:

1. **Remove TRPC wrapper** - Return data directly, not wrapped in `result.data.json`

2. **Fix field naming:**
   - `unit_type` → `unitType`
   - `allow_donations` → `allowDonations`
   - `tpo_name` → `tpoName`

3. **Parse geometry strings** to objects in projects

4. **Fix leaderboard names:**
   - Parse JSON strings to extract actual names
   - Use "Anonymous" for empty names
   - Ensure `unitType` instead of `unit_type`

5. **Standardize date formats** to ISO 8601 with timezone

6. **Add missing fields:**
   - `isGifted` and `giftDetails` in contribution items
   - Populate `projectLocationsMap` with project geometries

7. **Ensure data types:**
   - `allowDonations` as boolean (not 0/1)
   - All numeric fields as numbers (not strings)

## Testing

After implementing these changes:
1. The frontend should display data correctly without any transformations
2. Maps should show project and registration locations
3. Leaderboard should show proper names
4. All contribution data should be visible in the UI

## Benefits

- **No client-side transformations needed**
- **Consistent data format**
- **Better performance** (no parsing overhead)
- **Easier debugging**
- **Type safety** in frontend
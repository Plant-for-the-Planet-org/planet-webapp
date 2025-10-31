# Design Document

## Overview

This design document outlines the implementation approach for grouping donation receipts by year and adding overview receipt functionality. The solution will enhance the existing `DonationReceipts.tsx` component and related utilities to provide a better user experience for managing yearly tax receipts.

## Architecture

### Component Structure

The enhancement will modify the existing donation receipts architecture:

```
DonationReceipts.tsx (enhanced)
├── YearlyReceiptGroup.tsx (new component)
│   ├── YearHeader.tsx (new component)
│   ├── OverviewReceiptLink.tsx (new component)
│   └── Existing receipt cards (IssuedReceiptCard, UnissuedReceiptCard)
└── Existing components (SupportAssistanceInfo, etc.)
```

### Data Flow

1. **Receipt Fetching**: Existing API call to `/app/donationReceiptsStatus` remains unchanged
2. **Data Processing**: New utility functions will group receipts by year
3. **Rendering**: Enhanced component structure will render grouped receipts
4. **Overview Download**: New API integration for consolidated receipt download

## Components and Interfaces

### Enhanced DonationReceipts Component

The main component will be enhanced to:
- Group receipts by year using a new utility function
- Render `YearlyReceiptGroup` components instead of individual cards
- Maintain existing loading and empty states

### New YearlyReceiptGroup Component

```typescript
interface YearlyReceiptGroupProps {
  year: string;
  receipts: {
    issued: IssuedReceiptDataApi[];
    unissued: UnissuedReceiptDataAPI[];
  };
  onReceiptClick: (type: 'issued' | 'unissued', receipt: any) => void;
  processReceiptId: string | null;
}
```

### New YearHeader Component

```typescript
interface YearHeaderProps {
  year: string;
  showOverviewLink: boolean;
  onOverviewDownload?: () => void;
}
```### New Ov
erviewReceiptLink Component

```typescript
interface OverviewReceiptLinkProps {
  year: string;
  onDownload: () => void;
  isLoading?: boolean;
}
```

## Data Models

### Yearly Grouped Receipts Structure

```typescript
interface YearlyGroupedReceipts {
  [year: string]: {
    issued: IssuedReceiptDataApi[];
    unissued: UnissuedReceiptDataAPI[];
  };
}
```

### Overview Receipt Eligibility

```typescript
interface OverviewEligibility {
  year: string;
  isEligible: boolean;
  verifiedCount: number;
  totalCount: number;
}
```

## Error Handling

### Overview Download Errors
- Network failures during overview download
- Invalid year parameter errors
- Insufficient verified receipts errors
- Server-side processing errors

### Graceful Degradation
- If overview download fails, individual receipts remain functional
- If grouping fails, fall back to original flat list display
- Loading states for overview download operations

## Testing Strategy

### Unit Tests
- Receipt grouping utility functions
- Overview eligibility calculation logic
- Component rendering with various data states
- Error handling scenarios

### Integration Tests
- Full receipt list rendering with grouped data
- Overview download workflow
- Receipt verification workflow within grouped context

### Visual Regression Tests
- Year header styling and positioning
- Overview link styling and hover states
- Receipt card layout within year groups
- Responsive behavior across different screen sizes

## Implementation Notes

### Year Extraction Logic
- Extract year from `paymentDate` for unissued receipts
- Extract year from `year` field for issued receipts (when available)
- Fall back to `paymentDate` parsing if `year` field is missing

### Overview Receipt API Integration
- New API endpoint: `/app/donationReceipts/overview/{year}`
- Authentication required (existing pattern)
- Response includes download URL for consolidated receipt

### Styling Considerations
- Year headers use large, bold typography
- Overview links use distinctive red color (#FF0000 or theme equivalent)
- Maintain existing receipt card styling
- Ensure proper spacing between year groups

### Performance Considerations
- Group receipts client-side to avoid additional API calls
- Lazy load overview receipt URLs only when needed
- Maintain existing pagination if implemented in future
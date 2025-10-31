    # Implementation Plan

- [x] 1. Create utility functions for receipt grouping and overview eligibility
  - Create utility functions to group receipts by year from payment dates
  - Implement logic to determine overview receipt eligibility based on verification status
  - Add year extraction utilities for both issued and unissued receipts
  - _Requirements: 1.1, 1.2, 3.2, 3.3, 6.1, 6.2_

- [ ]* 1.1 Write unit tests for utility functions
  - Create unit tests for receipt grouping logic
  - Write tests for overview eligibility calculation
  - Test year extraction from different date formats
  - _Requirements: 1.1, 3.2, 3.3_

- [x] 2. Create YearHeader component
  - Implement YearHeader component with year display and conditional overview link
  - Add proper typography styling for year headings
  - Integrate overview download functionality with loading states
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3_

- [ ]* 2.1 Write unit tests for YearHeader component
  - Test component rendering with different props
  - Test overview link visibility logic
  - Test click handlers and loading states
  - _Requirements: 2.1, 4.1, 4.2_

- [x] 3. Create YearlyReceiptGroup component
  - Implement component to render year header and associated receipt cards
  - Handle both issued and unissued receipts within year groups
  - Maintain existing receipt card functionality and click handlers
  - _Requirements: 1.3, 5.1, 5.2, 6.1, 6.2_

- [ ]* 3.1 Write unit tests for YearlyReceiptGroup component
  - Test rendering of mixed issued and unissued receipts
  - Test proper event handling delegation to parent component
  - Test component behavior with empty receipt arrays
  - _Requirements: 5.1, 5.2, 6.1, 6.2_

- [x] 4. Enhance DonationReceipts main component
  - Integrate receipt grouping utilities into existing component
  - Replace flat receipt rendering with yearly grouped rendering
  - Add overview receipt download API integration and error handling
  - Maintain existing loading states and empty state handling
  - _Requirements: 1.1, 1.4, 3.1, 3.4, 5.3, 5.4, 5.5_

- [ ]* 4.1 Write integration tests for enhanced DonationReceipts
  - Test full component rendering with grouped receipts
  - Test overview download workflow integration
  - Test error handling for overview download failures
  - _Requirements: 3.1, 3.4, 5.3, 5.5_

- [x] 5. Add styling for yearly grouping and overview links
  - Create CSS classes for year headers with prominent typography
  - Style overview download links with distinctive red color and hover states
  - Ensure proper spacing between year groups and visual separation
  - Maintain responsive design for different screen sizes
  - _Requirements: 2.1, 2.2, 4.2, 4.4_

- [x] 6. Update TypeScript interfaces and types
  - Add new interfaces for yearly grouped receipts structure
  - Create types for overview receipt eligibility
  - Update existing component prop types as needed
  - _Requirements: 1.1, 3.2, 6.1_
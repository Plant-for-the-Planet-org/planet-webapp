# Requirements Document

## Introduction

This feature enhances the existing donation receipts functionality by grouping receipts by year and providing overview receipt downloads. Currently, donation receipts are displayed as individual cards without clear year organization, making it difficult for users to understand which receipts belong to which tax year. The enhancement will group receipts by year, display the year prominently, and provide an additional "Download Overview" option when multiple verified receipts exist for the same year.

## Requirements

### Requirement 1

**User Story:** As a donor, I want to see my donation receipts grouped by year, so that I can easily identify which receipts belong to which tax year for my records.

#### Acceptance Criteria

1. WHEN the donation receipts page loads THEN the system SHALL group all receipts (both issued and unissued) by their respective years
2. WHEN receipts are grouped by year THEN the system SHALL display each year as a prominent heading above the receipts for that year
3. WHEN displaying yearly groups THEN the system SHALL sort years in descending order (most recent first)
4. WHEN a year has no receipts THEN the system SHALL NOT display that year section

### Requirement 2

**User Story:** As a donor, I want to see the year clearly displayed for each group of receipts, so that I can quickly identify the tax year without having to examine individual receipt dates.

#### Acceptance Criteria

1. WHEN receipts are grouped by year THEN the system SHALL display the year as a large, prominent heading (e.g., "2023", "2022")
2. WHEN displaying the year heading THEN the system SHALL use consistent typography that stands out from receipt card content
3. WHEN the year is displayed THEN the system SHALL position it above all receipts for that year
4. WHEN multiple years are present THEN the system SHALL clearly separate each year section visually

### Requirement 3

**User Story:** As a donor, I want to download an overview receipt for a specific year when I have multiple verified receipts, so that I can get a consolidated tax document for that year.

#### Acceptance Criteria

1. WHEN a year has more than 1 donation receipt THEN the system SHALL display a "Download Overview" link for that year
2. WHEN all receipts for a year are verified THEN the system SHALL enable the "Download Overview" functionality
3. WHEN any receipt for a year is not verified THEN the system SHALL NOT display the "Download Overview" option
4. WHEN the "Download Overview" link is clicked THEN the system SHALL initiate download of a consolidated receipt for that year
5. WHEN a year has only 1 receipt THEN the system SHALL NOT display the "Download Overview" option

### Requirement 4

**User Story:** As a donor, I want the overview receipt download to be visually distinct from individual receipt actions, so that I can easily distinguish between downloading individual receipts and the yearly overview.

#### Acceptance Criteria

1. WHEN the "Download Overview" option is displayed THEN the system SHALL position it prominently within the year section but separate from individual receipt cards
2. WHEN displaying the "Download Overview" link THEN the system SHALL use distinctive styling (e.g., red text color as shown in the mockup)
3. WHEN the "Download Overview" is available THEN the system SHALL include appropriate visual indicators (e.g., download icon)
4. WHEN hovering over the "Download Overview" link THEN the system SHALL provide appropriate hover states for better user experience

### Requirement 5

**User Story:** As a donor, I want the existing individual receipt functionality to remain unchanged, so that I can still verify and download individual receipts as before.

#### Acceptance Criteria

1. WHEN viewing grouped receipts THEN the system SHALL maintain all existing individual receipt card functionality
2. WHEN clicking on individual receipt "Verify & Download" buttons THEN the system SHALL continue to work as currently implemented
3. WHEN individual receipts are verified THEN the system SHALL continue to show "Download" buttons as currently implemented
4. WHEN receipts are pending THEN the system SHALL continue to show pending status as currently implemented
5. WHEN the grouping is implemented THEN the system SHALL NOT break any existing receipt verification or download workflows

### Requirement 6

**User Story:** As a donor, I want the receipt grouping to work correctly with both issued and unissued receipts, so that all my receipts are properly organized regardless of their status.

#### Acceptance Criteria

1. WHEN grouping receipts by year THEN the system SHALL include both issued and unissued receipts in the appropriate year groups
2. WHEN a year contains both issued and unissued receipts THEN the system SHALL display them together in the same year section
3. WHEN determining overview receipt eligibility THEN the system SHALL only consider issued and verified receipts
4. WHEN unissued receipts exist in a year THEN the system SHALL NOT prevent overview receipt generation for verified issued receipts in the same year
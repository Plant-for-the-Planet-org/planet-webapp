import React from 'react';
import type { 
  IssuedReceiptDataApi, 
  UnissuedReceiptDataAPI,
  YearlyReceiptGroupProps 
} from '../donationReceiptTypes';
import YearHeader from './YearHeader';
import IssuedReceiptCard from './IssuedReceiptCard';
import UnissuedReceiptCard from './UnissuedReceiptCard';
import styles from '../DonationReceipt.module.scss';

const YearlyReceiptGroup: React.FC<YearlyReceiptGroupProps> = ({
  year,
  receipts,
  onReceiptClick,
  processReceiptId,
  onOverviewDownload,
  isOverviewLoading = false,
}) => {
  // Show overview link based on parent component's eligibility decision
  // The parent component handles all eligibility logic including:
  // - More than 1 issued receipt
  // - All issued receipts are verified
  // - Year is consolidated (year <= lastConsolidatedYear)
  const showOverviewLink = onOverviewDownload !== undefined;

  return (
    <div className={styles.yearlyReceiptGroup}>
      <YearHeader
        year={year}
        showOverviewLink={showOverviewLink}
        onOverviewDownload={onOverviewDownload}
        isLoading={isOverviewLoading}
      />
      
      <div className={styles.yearReceiptCards}>
        {/* Render unissued receipts first (as in original component) */}
        {receipts.unissued.map((receipt) => (
          <UnissuedReceiptCard
            key={`unissued-${receipt.donations[0].uid}`}
            unissuedReceipt={receipt}
            onReceiptClick={() => onReceiptClick('unissued', receipt)}
            isProcessing={processReceiptId === receipt.donations[0].uid}
          />
        ))}
        
        {/* Render issued receipts */}
        {receipts.issued.map((receipt) => (
          <IssuedReceiptCard
            key={`issued-${receipt.donations[0].reference}`}
            issuedReceipt={receipt}
            onReceiptClick={() => onReceiptClick('issued', receipt)}
            isProcessing={processReceiptId === receipt.donations[0].reference}
          />
        ))}
      </div>
    </div>
  );
};

export default YearlyReceiptGroup;
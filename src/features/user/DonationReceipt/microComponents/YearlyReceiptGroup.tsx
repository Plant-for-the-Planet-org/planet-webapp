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
  overviewButtonState,
  onOverviewDownload,
  isOverviewLoading = false,
  hoverMessage,
}) => {
  return (
    <div className={styles.yearlyReceiptGroup}>
      <YearHeader
        year={year}
        overviewButtonState={overviewButtonState}
        onOverviewDownload={onOverviewDownload}
        isLoading={isOverviewLoading}
        hoverMessage={hoverMessage}
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
import React from 'react';
import { useTranslations } from 'next-intl';
import type { YearHeaderProps } from '../donationReceiptTypes';
import styles from '../DonationReceipt.module.scss';

const YearHeader: React.FC<YearHeaderProps> = ({
  year,
  showOverviewLink,
  onOverviewDownload,
  isLoading = false,
}) => {
  const tReceipt = useTranslations('DonationReceipt');

  const handleOverviewClick = () => {
    if (onOverviewDownload && !isLoading) {
      onOverviewDownload();
    }
  };

  return (
    <div className={styles.yearHeader}>
      <h2 className={styles.yearTitle}>{year}</h2>
      {showOverviewLink && (
        <button
          className={styles.overviewLink}
          onClick={handleOverviewClick}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? (
            <span className={styles.overviewLinkContent}>
              <span className={styles.spinner} />
              {tReceipt('downloadingOverview')}
            </span>
          ) : (
            <span className={styles.overviewLinkContent}>
              <svg
                className={styles.downloadIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 16L7 11L8.4 9.55L11 12.15V4H13V12.15L15.6 9.55L17 11L12 16ZM6 20C5.45 20 4.979 19.804 4.587 19.412C4.195 19.02 3.99934 18.5493 4 18V15H6V18H18V15H20V18C20 18.55 19.804 19.021 19.412 19.413C19.02 19.805 18.5493 20.0007 18 20H6Z"
                  fill="currentColor"
                />
              </svg>
              {tReceipt('downloadOverview')}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default YearHeader;
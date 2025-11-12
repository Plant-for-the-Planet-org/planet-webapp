import type {
  OverviewButtonState,
  YearHeaderProps,
} from '../donationReceiptTypes';

import React from 'react';
import { useTranslations } from 'next-intl';
import styles from '../DonationReceipt.module.scss';
import CustomTooltip from '../../../common/Layout/CustomTooltip';
import NewInfoIcon from '../../../../../public/assets/images/icons/projectV2/NewInfoIcon';
import themeProperties from '../../../../theme/themeProperties';
import DownloadIcon from '../../../../../public/assets/images/icons/projectV2/DownloadIcon';

const YearHeader: React.FC<YearHeaderProps> = ({
  year,
  overviewButtonState,
  onOverviewDownload,
  isLoading = false,
}) => {
  const tReceipt = useTranslations('DonationReceipt.overviewReceipt');

  const handleOverviewClick = () => {
    if (onOverviewDownload && !isLoading && overviewButtonState === 'active') {
      onOverviewDownload();
    }
  };

  const getOverviewReceiptStatusInfo = (
    status: OverviewButtonState
  ): string | undefined => {
    switch (status) {
      case 'active':
        return tReceipt('statusInfo.download');

      case 'inactive-unverified':
        return tReceipt('statusInfo.verifyBeforeDownload');

      case 'inactive-future':
        return tReceipt('statusInfo.availableSoon');

      default:
        return undefined;
    }
  };

  const isButtonDisabled = isLoading || overviewButtonState !== 'active';
  const isOverviewButtonVisible = overviewButtonState !== 'hidden';

  return (
    <div className={styles.yearHeader}>
      <div>
        <h2 className={styles.yearTitle}>{year}</h2>
        {isOverviewButtonVisible && (
          <div className={styles.overviewStatusLabel}>
            <CustomTooltip
              triggerElement={
                <NewInfoIcon
                  width={12}
                  color={themeProperties.designSystem.colors.softText2}
                />
              }
              showTooltipPopups={true}
            >
              <p className={styles.tooltipContent}>
                {getOverviewReceiptStatusInfo(overviewButtonState)}
              </p>
            </CustomTooltip>
            <span className={styles.label}>
              {overviewButtonState === 'active'
                ? tReceipt('available')
                : tReceipt('notAvailable')}
            </span>
          </div>
        )}
      </div>
      {isOverviewButtonVisible && (
        <button
          aria-label={tReceipt('downloadOverviewFor', { year })}
          className={styles.overviewDownloadButton}
          onClick={handleOverviewClick}
          disabled={isButtonDisabled}
          type="button"
        >
          {isLoading ? (
            <span className={styles.spinner} />
          ) : (
            <>
              <DownloadIcon
                width={13}
                color={themeProperties.designSystem.colors.primaryColor}
              />
              <span>{tReceipt('download')}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default YearHeader;

import type { ReactElement } from 'react';
import type { RedeemedCodeData } from '../types/redeem';

import { useTranslations } from 'next-intl';
import styles from '../../../../src/features/common/RedeemCode/style/RedeemModal.module.scss';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import IconButton from '../IconButton';
import Button from '@mui/material/Button';

export interface SuccessfullyRedeemedProps {
  redeemedCodeData: RedeemedCodeData | undefined;
  redeemAnotherCode: () => void;
  closeRedeem: () => void;
}

export const SuccessfullyRedeemed = ({
  redeemedCodeData,
  redeemAnotherCode,
  closeRedeem,
}: SuccessfullyRedeemedProps): ReactElement => {
  const tRedeem = useTranslations('Redeem');
  const tCommon = useTranslations('Common');

  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <IconButton
          label={`${tCommon('close')} ${tRedeem('redeem')}`}
          className={styles.crossWidth}
          onClick={closeRedeem}
        >
          <CancelIcon />
        </IconButton>
      </div>

      <div className={styles.successMessage}>
        {redeemedCodeData?.project?.classification === 'membership'
          ? tRedeem.rich('membershipRedeemSuccessMessage', {
              line1: (chunks) => <p>{chunks}</p>,
              line2: (chunks) => <p className={styles.subText}>{chunks}</p>,
            })
          : tRedeem.rich('redeemSuccessMessage', {
              line1: (chunks) => <p>{chunks}</p>,
              line2: (chunks) => <p className={styles.subText}>{chunks}</p>,
            })}
      </div>

      <div className={styles.redeemCodeButtonContainer}>
        <Button variant="contained" onClick={redeemAnotherCode}>
          {tRedeem('redeemAnotherCode')}
        </Button>
      </div>
    </div>
  );
};

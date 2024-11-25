import type { ReactElement } from 'react';
import type { RedeemedCodeData } from '../types/redeem';

import { useTranslations } from 'next-intl';
import styles from '../../../../src/features/common/RedeemCode/style/RedeemModal.module.scss';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
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

  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>

      <div className={styles.successMessage}>
        {redeemedCodeData?.project.classification === 'membership'
          ? tRedeem.rich('membershipRedeemSuccessMessage', {
              line1: (chunks) => <p>{chunks}</p>,
              line2: (chunks) => <p>{chunks}</p>,
            })
          : tRedeem.rich('redeemSuccessMessage', {
              line1: (chunks) => <p>{chunks}</p>,
              line2: (chunks) => <p>{chunks}</p>,
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

import { useLocale, useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { RedeemedCodeData } from '../types/redeem';
import styles from '../../../../src/features/common/RedeemCode/style/RedeemModal.module.scss';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
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
  const tCommon = useTranslations('Common');
  const tRedeem = useTranslations('Redeem');
  const locale = useLocale();

  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>

      <div className={styles.codeTreeCount}>
        {getFormattedNumber(locale, Number(redeemedCodeData?.units))}
        <span>
          {tCommon('tree', {
            count: Number(redeemedCodeData?.units),
          })}
        </span>
      </div>

      <div className={styles.codeTreeCount}>
        <span>{tRedeem('successfullyRedeemed')}</span>
      </div>

      <div className={styles.redeemCodeButtonContainer}>
        <Button variant="contained" onClick={redeemAnotherCode}>
          {tRedeem('redeemAnotherCode')}
        </Button>
      </div>
    </div>
  );
};

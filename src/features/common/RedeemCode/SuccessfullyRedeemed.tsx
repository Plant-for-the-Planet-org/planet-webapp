import { useTranslation } from 'next-i18next';
import { ReactElement } from 'react';
import { RedeemedCodeData } from '../types/redeem';
import styles from '../../../../src/features/user/Profile/styles/RedeemModal.module.scss';
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
  const { t, i18n } = useTranslation(['common', 'redeem']);

  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>

      <div className={styles.codeTreeCount}>
        {getFormattedNumber(i18n.language, Number(redeemedCodeData?.units))}
        <span>
          {t('common:tree', {
            count: Number(redeemedCodeData?.units),
          })}
        </span>
      </div>

      <div className={styles.codeTreeCount}>
        <span>{t('redeem:successfullyRedeemed')}</span>
      </div>

      <div className={styles.redeemCodeButtonContainer}>
        <Button variant="contained" onClick={redeemAnotherCode}>
          {t('redeem:redeemAnotherCode')}
        </Button>
      </div>
    </div>
  );
};

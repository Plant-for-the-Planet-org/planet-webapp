import { ReactElement } from 'react';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import styles from '../../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import { useTranslation } from 'next-i18next';
import Button from '@mui/material/Button';
import { SerializedError } from '@planet-sdk/common';

export interface RedeemFailedProps {
  errorMessages: SerializedError[] | null;
  inputCode: string | undefined;
  redeemAnotherCode: () => void;
  closeRedeem: () => void;
}

export const RedeemFailed = ({
  errorMessages,
  inputCode,
  redeemAnotherCode,
  closeRedeem,
}: RedeemFailedProps): ReactElement => {
  const { t } = useTranslation(['redeem']);

  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>

      <div className={styles.redeemTitle}>{inputCode}</div>
      <div className={styles.formErrors}>
        {errorMessages && errorMessages[0]?.message}
      </div>
      <div className={styles.redeemCodeButtonContainer}>
        <Button variant="contained" onClick={redeemAnotherCode}>
          {t('redeem:redeemAnotherCode')}
        </Button>
      </div>
    </div>
  );
};

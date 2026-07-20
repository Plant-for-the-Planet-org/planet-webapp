import type { ReactElement } from 'react';
import type { SerializedError } from '@planet-sdk/common';

import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import styles from '../../../../src/features/common/RedeemCode/style/RedeemModal.module.scss';
import { useTranslations } from 'next-intl';
import Button from '@mui/material/Button';

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
  const t = useTranslations('Redeem');
  const tCommon = useTranslations('Common');

  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button
          type="button"
          aria-label={`${tCommon('close')} ${t('redeem')}`}
          className={styles.crossWidth}
          onClick={closeRedeem}
        >
          <span aria-hidden="true" style={{ display: 'contents' }}>
            <CancelIcon />
          </span>
        </button>
      </div>

      <div className={styles.redeemTitle}>{inputCode}</div>
      <div className={styles.formErrors}>
        {errorMessages && errorMessages[0]?.message}
      </div>
      <div className={styles.redeemCodeButtonContainer}>
        <Button variant="contained" onClick={redeemAnotherCode}>
          {t('redeemAnotherCode')}
        </Button>
      </div>
    </div>
  );
};

import type { ReactElement } from 'react';
import type { SetState } from '../types/common';

import TextField from '@mui/material/TextField';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import styles from '../../../../src/features/common/RedeemCode/style/RedeemModal.module.scss';
import Button from '@mui/material/Button';

export interface EnterRedeemCodeProps {
  isLoading: boolean;
  setInputCode: SetState<string | undefined>;
  inputCode: string | undefined;
  redeemCode: () => void;
  closeRedeem: () => void;
}

// TODO - use rhf as a source of truth instead of combining both state and rhf
export const EnterRedeemCode = ({
  isLoading,
  setInputCode,
  inputCode,
  redeemCode,
  closeRedeem,
}: EnterRedeemCodeProps): ReactElement => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const t = useTranslations('Redeem');
  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>
      <div className={styles.redeemHeading}>{t('redeem')}</div>
      <div className={styles.note}>{t('redeemDescription')}</div>
      <div className={styles.inputField}>
        <Controller
          name="code"
          control={control}
          rules={{ required: t('enterRedeemCode') }}
          render={({ field: { onChange, onBlur } }) => (
            <TextField
              onChange={(event) => {
                setInputCode(event.target.value);
                onChange(event.target.value);
              }}
              value={inputCode}
              onBlur={onBlur}
              placeholder="XAD-1SA-5F1-A"
              label=""
              variant="outlined"
              error={errors.code !== undefined}
              helperText={errors.code !== undefined && errors.code.message}
            />
          )}
        />
      </div>

      <div className={styles.redeemCodeButtonContainer}>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit(redeemCode)}
        >
          {isLoading ? t('redeemingCode') : t('redeemCode')}
        </Button>
      </div>
    </div>
  );
};

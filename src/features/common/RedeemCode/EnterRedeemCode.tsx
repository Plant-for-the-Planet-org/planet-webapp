import TextField from '@mui/material/TextField';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { ReactElement } from 'react';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import styles from '../../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import Button from '@mui/material/Button';
import React from 'react';
import { SetState } from '../types/common';

export interface EnterRedeemCodeProps {
  isLoading: boolean;
  setInputCode: SetState<string | null>;
  inputCode: string | undefined;
  redeemCode: () => void;
  closeRedeem: () => void;
}

export const EnterRedeemCode = ({
  isLoading,
  setInputCode,
  inputCode,
  redeemCode,
  closeRedeem,
}: EnterRedeemCodeProps): ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });
  const { t } = useTranslation(['redeem']);
  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>
      <div className={styles.redeemHeading}>{t('redeem:redeem')}</div>
      <div className={styles.note}>{t('redeem:redeemDescription')}</div>
      <div className={styles.inputField}>
        <TextField
          inputRef={register({
            required: {
              value: true,
              message: t('redeem:enterRedeemCode'),
            },
          })}
          onChange={(event) => {
            setInputCode(event.target.value);
          }}
          value={inputCode}
          name={'code'}
          placeholder="XAD-1SA-5F1-A"
          label=""
          variant="outlined"
          error={errors.code}
          helperText={errors.code && errors.code.message}
        />
      </div>

      <div className={styles.redeemCodeButtonContainer}>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={handleSubmit(redeemCode)}
        >
          {isLoading ? t('redeem:redeemingCode') : t('redeem:redeemCode')}
        </Button>
      </div>
    </div>
  );
};

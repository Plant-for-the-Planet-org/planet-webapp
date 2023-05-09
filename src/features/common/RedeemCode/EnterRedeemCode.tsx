import TextField from '@mui/material/TextField';
import { useTranslation } from 'next-i18next';
import { useForm } from 'react-hook-form';
import { ReactElement } from 'react';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import styles from '../../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import Button from '@mui/material/Button';
import React from 'react';
import { LoadingButton } from '@mui/lab';

export interface EnterRedeemCodeProps {
  loading: boolean;
  setInputCode: React.Dispatch<React.SetStateAction<string | null>>;
  inputCode: string | null;
  redeemCode: () => void;
  closeRedeem: () => void;
}

const EnterRedeemCode = ({
  loading,
  setInputCode,
  inputCode,
  redeemCode,
  closeRedeem,
}: EnterRedeemCodeProps): ReactElement => {
  const { register, errors, handleSubmit } = useForm({ mode: 'onBlur' });
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
        {loading ? (
          <LoadingButton loading variant="contained">
            <span>submit</span>
          </LoadingButton>
        ) : (
          <Button variant="contained" onClick={handleSubmit(redeemCode)}>
            {t('redeem:redeemCode')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EnterRedeemCode;

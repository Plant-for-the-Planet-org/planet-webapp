import { ReactElement, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import styles from '../../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import { useTranslation } from 'next-i18next';
import MaterialTextField from '../InputTypes/MaterialTextField';
import { RedeemedCodeData } from '../types/redeem';
import { SerializedError } from '@planet-sdk/common';
import { Button } from '@mui/material';
import { ErrorHandlingContext } from '../Layout/ErrorHandlingContext';

export interface InputRedeemCode {
  setInputCode: React.Dispatch<React.SetStateAction<string | null>>;
  inputCode: string | null;
  changeRouteCode: () => void;
  closeRedeem: () => void;
}

export interface RedeemCodeFailed {
  errorMessages: SerializedError[] | null;
  code: string | string[] | null;
  redeemAnotherCode: () => void;
  closeRedeem: () => void;
}

export interface SuccessfullyRedeemed {
  redeemedCodeData: RedeemedCodeData | undefined;
  redeemAnotherCode: () => void;
  closeRedeem: () => void;
}

export const InputRedeemCode = ({
  setInputCode,
  inputCode,
  changeRouteCode,
  closeRedeem,
}: InputRedeemCode): ReactElement => {
  const { register, errors, handleSubmit } = useForm({ mode: 'onBlur' });
  const { t } = useTranslation(['redeem']);

  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>

      <div style={{ fontWeight: 'bold' }}>{t('redeem:redeem')}</div>
      <div className={styles.note}>{t('redeem:redeemDescription')}</div>
      <div className={styles.inputField}>
        <MaterialTextField
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
          error={errors && errors.code?.message}
          helperText={errors && errors.code?.message}
        />
      </div>
      <div style={{ paddingTop: '30px' }}>
        <Button variant="contained" onClick={handleSubmit(changeRouteCode)}>
          {t('redeem:redeemCode')}
        </Button>
      </div>
    </div>
  );
};

export const RedeemCodeFailed = ({
  errorMessages = null,
  code,
  redeemAnotherCode,
  closeRedeem,
}: RedeemCodeFailed): ReactElement => {
  const { t } = useTranslation(['redeem']);
  const { errors } = useContext(ErrorHandlingContext);
  return (
    <div className={styles.routeRedeemModal}>
      <div className={styles.crossDiv}>
        <button className={styles.crossWidth} onClick={closeRedeem}>
          <CancelIcon />
        </button>
      </div>

      <div className={styles.RedeemTitle}>{code}</div>
      <div className={styles.formErrors}>{errors[0]?.message}</div>
      <div className={styles.redeemAnotherCodeDiv}>
        <Button variant="contained" onClick={redeemAnotherCode}>
          {t('redeem:redeemAnotherCode')}
        </Button>
      </div>
    </div>
  );
};

export const SuccessfullyRedeemed = ({
  redeemedCodeData,
  redeemAnotherCode,
  closeRedeem,
}: SuccessfullyRedeemed): ReactElement => {
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

      <div className={styles.redeemAnotherCodeDiv}>
        <Button variant="contained" onClick={redeemAnotherCode}>
          {t('redeem:redeemAnotherCode')}
        </Button>
      </div>
    </div>
  );
};

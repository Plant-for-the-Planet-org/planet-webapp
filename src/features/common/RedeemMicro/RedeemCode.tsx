import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import CancelIcon from '../../../../public/assets/images/icons/CancelIcon';
import styles from '../../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import i18next from '../../../../i18n';
import MaterialTextField from '../InputTypes/MaterialTextField';
import CircularProgress from '@mui/material/CircularProgress';

const { useTranslation } = i18next;

// export interface RedeemCodeData {

// }

export const InputRedeemCode = ({
  setInputCode,
  inputCode,
  changeRouteCode,
  closeRedeem,
}): ReactElement => {
  const { register } = useForm({ mode: 'onBlur' });
  const { t } = useTranslation(['redeem']);

  return (
    <div className={styles.modal}>
      <button className={styles.cancelIcon} onClick={closeRedeem}>
        <CancelIcon />
      </button>

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
        />
      </div>
      <div>
        <button className={'primaryButton'} onClick={changeRouteCode}>
          {t('redeem:redeemCode')}
        </button>
      </div>
    </div>
  );
};

export const SuccessfullyRedeemed = ({
  redeemedCodeData,
  redeemAnotherCode,
  closeRedeem,
}): ReactElement => {
  const { t, i18n } = useTranslation(['common', 'redeem']);

  return (
    <div className={styles.modal}>
      <button className={styles.cancelIcon} onClick={closeRedeem}>
        <CancelIcon />
      </button>

      <div className={styles.codeTreeCount}>
        {getFormattedNumber(i18n.language, Number(redeemedCodeData.units))}
        <span>
          {t('common:tree', {
            count: Number(redeemedCodeData.units),
          })}
        </span>
      </div>

      <div className={styles.codeTreeCount}>
        <span>{t('redeem:successfullyRedeemed')}</span>
      </div>

      <div>
        <button className="primaryButton" onClick={redeemAnotherCode}>
          {t('redeem:redeemAnotherCode')}
        </button>
      </div>
    </div>
  );
};

export const RedeemCodeFailed = ({
  errorMessage,
  code,
  redeemAnotherCode,
  closeRedeem,
}) => {
  const { t } = useTranslation(['redeem']);

  return (
    <div className={styles.modal}>
      <div className={styles.cancelIcon} onClick={closeRedeem}>
        <CancelIcon />
      </div>
      {errorMessage ? (
        <div style={{ fontWeight: 'bold' }}>{code}</div>
      ) : (
        <div style={{ fontWeight: 'bold' }}>
          {t('redeem:redeeming')} {code}
        </div>
      )}

      {errorMessage && (
        <div>
          <span className={styles.formErrors}>{errorMessage}</span>
        </div>
      )}

      {!errorMessage ? (
        <div style={{ marginTop: '10px' }}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <button className="primaryButton" onClick={redeemAnotherCode}>
            {t('redeem:redeemAnotherCode')}
          </button>
        </div>
      )}
    </div>
  );
};

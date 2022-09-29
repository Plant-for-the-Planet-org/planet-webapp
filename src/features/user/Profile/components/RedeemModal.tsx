import styles from '../styles/RedeemModal.module.scss';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useForm } from 'react-hook-form';
import React, { ReactElement } from 'react';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import { ThemeContext } from '../../../../theme/themeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';

const { useTranslation } = i18next;

interface RedeemModal {
  redeemModalOpen: boolean;
  handleRedeemModalClose: () => void;
}

type FormData = {
  code: string;
};

export default function RedeemModal({
  redeemModalOpen,
  handleRedeemModalClose,
}: RedeemModal): ReactElement | null {
  const { t, i18n, ready } = useTranslation([
    'me',
    'common',
    'donate',
    'redeem',
  ]);
  const { user, contextLoaded, token, setUser } =
    React.useContext(UserPropsContext);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [validCodeData, setValidCodeData] = React.useState<{} | undefined>();
  const [isCodeRedeemed, setIsCodeRedeemed] = React.useState(false);
  const [inputCode, setInputCode] = React.useState('');

  const handleAnotherCode = () => {
    setErrorMessage('');
    setInputCode('');
    setIsCodeRedeemed(false);
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: 'onBlur',
  });

  async function redeemCode(data: FormData) {
    setIsUploadingData(true);
    const submitData = {
      code: data.code,
    };
    if (contextLoaded && user) {
      postAuthenticatedRequest(`/app/redeem`, submitData, token).then((res) => {
        if (res.error_code === 'already_redeemed') {
          setErrorMessage(t('redeem:alreadyRedeemed'));
          setIsUploadingData(false);
        } else if (res.error_code === 'invalid_code') {
          setErrorMessage(t('redeem:invalidCode'));
          setIsUploadingData(false);
        } else if (res.status === 'redeemed') {
          setIsCodeRedeemed(true);
          setValidCodeData(res);
          if (res.units > 0) {
            const cloneUser = { ...user };
            cloneUser.score.received = cloneUser.score.received + res.units;
            setUser(cloneUser);
          }

          setIsUploadingData(false);
        }
      });
    }
  }

  const closeRedeem = () => {
    setIsCodeRedeemed(false);
    handleRedeemModalClose();
    setInputCode('');
    setErrorMessage('');
  };

  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    <Modal
      className={'modalContainer' + ' ' + theme}
      open={redeemModalOpen}
      onClose={handleRedeemModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={redeemModalOpen}>
        {isCodeRedeemed && validCodeData ? (
          // after successful redeeemed code
          <div className={`${styles.modal} ${styles.fixModal}`}>
            <div className={styles.crossButtonDiv}>
              <button className={styles.crossButton} onClick={closeRedeem}>
                <CancelIcon color={styles.primaryFontColor} />
              </button>
            </div>
            <div className={styles.codeTreeCount} style={{ fontSize: '2rem' }}>
              {getFormattedNumber(i18n.language, Number(validCodeData.units))}
              <span>
                {t('common:tree', {
                  count: Number(validCodeData.units),
                })}
              </span>
            </div>

            <span className={styles.codeTreeCount}>
              {t('redeem:successfullyRedeemed')}
            </span>

            <button
              className={`primaryButton ${styles.redeemCode}`}
              onClick={handleAnotherCode}
            >
              {t('redeem:redeemAnotherCode')}
            </button>
          </div>
        ) : (
          // input redeem modal
          <div className={`${styles.modal} ${styles.fixModal}`}>
            <div className={styles.crossButtonDiv}>
              <button className={styles.crossButton} onClick={closeRedeem}>
                <CancelIcon color={styles.primaryFontColor} />
              </button>
            </div>

            <h4 style={{ fontWeight: '700' }}>{t('me:redeem')}</h4>

            <div className={styles.note}>
              <p>{t('me:redeemDescription')}</p>
            </div>

            {!errorMessage && (
              <div className={styles.inputField}>
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: true,
                      message: t('redeem:enterRedeemCode'),
                    },
                  })}
                  onChange={(event) => {
                    event.target.value.startsWith('pp.eco/c/')
                      ? setInputCode(
                          event.target.value.replace('pp.eco/c/', '')
                        )
                      : setInputCode(event.target.value);
                  }}
                  value={inputCode}
                  name={'code'}
                  placeholder="XAD-1SA-5F1-A"
                  label=""
                  variant="outlined"
                />
              </div>
            )}
            {errors.code && (
              <span className={styles.formErrors}>{errors.code.message}</span>
            )}
            {errorMessage && !errors.code && !isUploadingData && (
              <span className={styles.formErrors}>{errorMessage}</span>
            )}

            {errorMessage && (
              <button
                className={`primaryButton ${styles.redeemCode}`}
                onClick={handleAnotherCode}
              >
                {t('redeem:redeemAnotherCode')}
              </button>
            )}
            {!errorMessage && (
              <button
                id={'redeemCodeModal'}
                onClick={handleSubmit(redeemCode)}
                className={`primaryButton ${styles.redeemCode}`}
              >
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('redeem:redeemCode')
                )}
              </button>
            )}
          </div>
        )}
      </Fade>
    </Modal>
  ) : null;
}

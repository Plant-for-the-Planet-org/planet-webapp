import styles from '../styles/RedeemModal.module.scss';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { useTranslation } from 'next-i18next';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useForm } from 'react-hook-form';
import React, { ReactElement } from 'react';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import { ThemeContext } from '../../../../theme/themeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import { handleError, APIError, SerializedError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';

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
  const { user, contextLoaded, token, setUser, impersonatedEmail, logoutUser } =
    React.useContext(UserPropsContext);
  const { setErrors, errors: apiErrors } =
    React.useContext(ErrorHandlingContext);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [validCodeData, setValidCodeData] = React.useState<{} | undefined>();
  const [isCodeRedeemed, setIsCodeRedeemed] = React.useState(false);
  const [inputCode, setInputCode] = React.useState('');
  const [disable, setDisable] = React.useState<boolean>(false);
  const handleAnotherCode = () => {
    setErrors(null);
    setInputCode('');
    setIsCodeRedeemed(false);
  };

  const { register, handleSubmit, errors } = useForm<FormData>({
    mode: 'onBlur',
  });

  async function redeemCode(data: FormData) {
    setDisable(true);
    setIsUploadingData(true);
    const submitData = {
      code: data.code,
    };
    if (contextLoaded && user) {
      try {
        const res = await postAuthenticatedRequest(
          `/app/redeem`,
          submitData,
          token,
          logoutUser,
          impersonatedEmail
        );
        setDisable(false);
        setIsUploadingData(false);
        setIsCodeRedeemed(true);
        setValidCodeData(res);
        if (res.units > 0) {
          const cloneUser = { ...user };
          cloneUser.score.received = cloneUser.score.received + res.units;
          setUser(cloneUser);
        }
      } catch (err) {
        setDisable(false);
        setIsUploadingData(false);
        const serializedErrors = handleError(err as APIError);
        const _serializedErrors: SerializedError[] = [];

        for (const error of serializedErrors) {
          switch (error.message) {
            case 'already_redeemed':
              _serializedErrors.push({
                message: t('redeem:alreadyRedeemed'),
              });
              break;

            case 'invalid_code':
              _serializedErrors.push({
                message: t('redeem:invalidCode'),
              });
              break;

            default:
              _serializedErrors.push(error);
              break;
          }
        }

        setErrors(_serializedErrors);
      }
    }
  }

  const closeRedeem = () => {
    setIsCodeRedeemed(false);
    handleRedeemModalClose();
    setInputCode('');
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
        <div className={`${styles.modal} ${styles.fixModal}`}>
          <div className={styles.crossButtonDiv}>
            <button className={styles.crossButton} onClick={closeRedeem}>
              <CancelIcon color={styles.primaryFontColor} />
            </button>
          </div>

          {isCodeRedeemed && validCodeData ? (
            // after successful redeeemed code
            <>
              <div
                className={styles.codeTreeCount}
                style={{ fontSize: '2rem' }}
              >
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
            </>
          ) : (
            // input redeem modal
            <>
              <h4 style={{ fontWeight: '700' }}>{t('me:redeem')}</h4>
              <div className={styles.note}>
                <p>{t('redeem:redeemDescription')}</p>
              </div>
              {!apiErrors && (
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

              {apiErrors && apiErrors.length > 0 && (
                <button
                  className={`primaryButton ${styles.redeemCode}`}
                  onClick={handleAnotherCode}
                >
                  {t('redeem:redeemAnotherCode')}
                </button>
              )}
              {!apiErrors && (
                <button
                  id={'redeemCodeModal'}
                  onClick={handleSubmit(redeemCode)}
                  className={`primaryButton ${styles.redeemCode}`}
                  disabled={disable}
                >
                  {isUploadingData ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    t('redeem:redeemCode')
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </Fade>
    </Modal>
  ) : null;
}

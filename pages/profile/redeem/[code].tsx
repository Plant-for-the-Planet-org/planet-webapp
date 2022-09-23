import LandingSection from '../../../src/features/common/Layout/LandingSection';
import CancelIcon from '../../../public/assets/images/icons/CancelIcon';
import styles from '../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import i18next from './../../../i18n';
import { getFormattedNumber } from '../../../src/utils/getFormattedNumber';
import { useState, useEffect, useContext, FC } from 'react';
import { useRouter } from 'next/router';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import CircularProgress from '@mui/material/CircularProgress';
import MaterialTextField from '../../../src/features/common/InputTypes/MaterialTextField';
import { useForm } from 'react-hook-form';

type RedeemCodeType = string | boolean | undefined | null;
type FormInput = {
  code: string | null;
};

const { useTranslation } = i18next;
const ReedemCode: FC = () => {
  const { t, i18n, ready } = useTranslation([
    'me',
    'common',
    'donate',
    'redeem',
  ]);
  const { user, contextLoaded, token } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);

  const [code, setCode] = useState<RedeemCodeType>('');
  const [inputCode, setInputCode] = useState<RedeemCodeType>('');
  const [errorMessage, setErrorMessage] = useState<RedeemCodeType>('');
  const [redeemedCodeData, setRedeemedCodeData] = useState<{
    units: string | undefined;
  }>();
  const [openInputTextFieldModal, setOpenTextFieldModal] =
    useState<RedeemCodeType>(false);

  const router = useRouter();
  const { register } = useForm<FormInput>({
    mode: 'onBlur',
  });

  const closeRedeemModal = () => {
    if (typeof window !== 'undefined') {
      router.push('/profile');
    }
  };

  const handleCode = () => {
    setOpenTextFieldModal(true);
    setRedeemedCodeData('');
    setErrorMessage('');
    setInputCode('');
  };

  const changeRouteCode = () => {
    if (router.query.code && inputCode) {
      router.push(`/profile/redeem/${inputCode}`);
      setOpenTextFieldModal(false);
    }
  };

  useEffect(() => {
    if (contextLoaded) {
      if (!user) {
        localStorage.setItem(
          'redirectLink',
          `profile/redeem/${router.query.code}`
        );
        router.push(`/login`);
      }
    }
  }, [contextLoaded, user, router]);

  useEffect(() => {
    if (router && router.query.code) {
      const codeFromUrl = router.query.code;
      setCode(codeFromUrl);
    }
  }, [router]);

  useEffect(() => {
    if (contextLoaded && user && router && router.query.code) {
      redeemingCode(router.query.code);
    }
  }, [user, contextLoaded, router.query.code]);

  async function redeemingCode(data: FormInput) {
    const submitData = {
      code: data,
    };

    if (contextLoaded && user) {
      postAuthenticatedRequest(
        `/app/redeem`,
        submitData,
        token,
        handleError
      ).then((res) => {
        if (res.error_code === 'invalid_code') {
          setErrorMessage(t('redeem:invalidCode'));
        } else if (res.error_code === 'already_redeemed') {
          setErrorMessage(t('redeem:alreadyRedeemed'));
        } else if (res.status === 'redeemed') {
          setRedeemedCodeData(res);
        }
      });
    }
  }

  return ready ? (
    openInputTextFieldModal ? (
      // for input of redeem code
      <LandingSection>
        <div className={styles.modal}>
          <button className={styles.cancelIcon} onClick={closeRedeemModal}>
            <CancelIcon />
          </button>
          <h4 style={{ fontWeight: 'bold' }}>{t('redeem:redeem')}</h4>
          <div className={styles.note}>
            <p>{t('redeem:redeemDescription')}</p>
          </div>
          <div className={styles.inputField}>
            <MaterialTextField
              inputRef={register({
                required: {
                  value: true,
                  message: t('redeem:enterRedeemCode'),
                },
              })}
              onChange={(event) => setInputCode(event.target.value)}
              value={inputCode}
              name={'code'}
              placeholder="XAD-1SA-5F1-A"
              label=""
              variant="outlined"
            />
          </div>

          <div>
            <button className="primaryButton" onClick={changeRouteCode}>
              {t('redeem:redeemCode')}
            </button>
          </div>
        </div>
      </LandingSection>
    ) : (
      //after successful redeem
      <LandingSection>
        {redeemedCodeData ? (
          <div className={styles.modal}>
            <button className={styles.cancelIcon} onClick={closeRedeemModal}>
              <CancelIcon />
            </button>

            <div className={styles.codeTreeCount}>
              {getFormattedNumber(
                i18n.language,
                Number(redeemedCodeData.units)
              )}

              <span>
                {t('common:trees', { count: Number(redeemedCodeData.units) })}
              </span>
            </div>

            <div className={styles.codeTreeCount}>
              <span>{t('redeem:successfullyRedeemed')}</span>
            </div>
            <div>
              <button className="primaryButton" onClick={handleCode}>
                {t('redeem:redeemAnotherCode')}
              </button>
            </div>
          </div>
        ) : (
          // if redeem code is invalid and  redeem process failed
          <div className={styles.modal}>
            <button className={styles.cancelIcon} onClick={closeRedeemModal}>
              <CancelIcon />
            </button>
            <div style={{ fontWeight: 'bold' }}>
              {errorMessage ? (
                <div>{code}</div>
              ) : (
                <div>
                  {t('redeem:redeeming')} {code}
                </div>
              )}
            </div>
            <div className={styles.errorAndSpinnerDiv}>
              {errorMessage ? (
                <span className={styles.formErrors}>{errorMessage}</span>
              ) : (
                <CircularProgress />
              )}
            </div>
            {errorMessage && (
              <div>
                <button className="primaryButton" onClick={handleCode}>
                  {t('redeem:redeemAnotherCode')}
                </button>
              </div>
            )}
          </div>
        )}
      </LandingSection>
    )
  ) : (
    <></>
  );
};

export default ReedemCode;

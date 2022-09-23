import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import styles from './../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import MaterialTextField from '../../../src/features/common/InputTypes/MaterialTextField';
import i18next from './../../../i18n';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import { getFormattedNumber } from '../../../src/utils/getFormattedNumber';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import CancelIcon from '../../../public/assets/images/icons/CancelIcon';
import CircularProgress from '@mui/material/CircularProgress';

const { useTranslation } = i18next;

type ClaimCode = string | boolean | null | undefined;

type FormInput = {
  code: string;
};

function ClaimDonation(): ReactElement {
  const { t, i18n, ready } = useTranslation([
    'me',
    'common',
    'donate',
    'redeem',
  ]);

  const router = useRouter();
  const { register } = useForm<FormInput>({ mode: 'onBlur' });
  const { user, contextLoaded, loginWithRedirect, token } =
    React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);

  const [errorMessage, setErrorMessage] = React.useState<ClaimCode>('');
  const [inputCode, setInputCode] = React.useState<ClaimCode>('');
  const [code, setCode] = React.useState<ClaimCode>('');
  const [type, setType] = React.useState();
  const [redeemedCodeData, setRedeemedCodeData] = React.useState<{
    units: string;
  }>();
  const [openInputCodeModal, setOpenInputCodeModal] =
    React.useState<ClaimCode>(false);

  React.useEffect(() => {
    if (router && router.query.type && router.query.code) {
      if (
        router.query.type !== 'donation' &&
        router.query.type !== 'donor' &&
        router.query.type !== 'gift'
      ) {
        setErrorMessage(ready ? t('redeem:invalidType') : '');
      } else {
        setCode(router.query.code);
        setType(router.query.type);
        setErrorMessage('');
      }
    }
  }, [router]);

  const redeemAnotherCode = () => {
    setOpenInputCodeModal(true);
    setRedeemedCodeData('');
    setErrorMessage('');
    setInputCode('');
  };

  const changeRouteCode = () => {
    if (router.query.code && inputCode) {
      router.push(`/claim/gift/${inputCode}`);
      setOpenInputCodeModal(false);
    }
    if (router.query.code && inputCode) {
      redeemingCode(router.query.code);
    }
  };

  const closeRedeem = () => {
    if (typeof window !== 'undefined') {
      router.push(`/`);
    }
  };

  async function redeemingCode(code: FormInput) {
    const submitData = {
      code: code,
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

  // Check if the user is logged in or not.
  React.useEffect(() => {
    // If the user is logged in -
    // Validate the code automatically
    // Once validated ask user to claim their donation
    // Once claimed user can share the donation
    // From here user can go back to home by clicking X
    if (contextLoaded && user) {
      // validate code
      if (code && type) {
        redeemingCode(code);
      }
    }

    // If the user is not logged in - send the user to log in page, store the claim redirect link in the localstorage.
    // When the user logs in, redirect user to the claim link from the localstorage and clear the localstorage.
    // For this  fetch the link from the storage, clears the storage and then redirects the user using the link
    else if (contextLoaded && !user) {
      // store the claim link in localstorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectLink', window.location.href);
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded, user, code]);

  return ready ? (
    <LandingSection>
      {openInputCodeModal ? (
        // for input of redeem code
        <>
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
        </>
      ) : (
        //after successful redeem
        <div className={styles.modal}>
          {redeemedCodeData ? (
            <>
              <button className={styles.cancelIcon} onClick={closeRedeem}>
                <CancelIcon />
              </button>

              <div className={styles.codeTreeCount}>
                {getFormattedNumber(
                  i18n.language,
                  Number(redeemedCodeData.units)
                )}
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
            </>
          ) : (
            // if redeem code is invalid and  redeem process failed
            <>
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
            </>
          )}
        </div>
      )}
    </LandingSection>
  ) : (
    <></>
  );
}

export default ClaimDonation;

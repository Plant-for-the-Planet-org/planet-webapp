import LandingSection from '../../../src/features/common/Layout/LandingSection';
import CancelIcon from '../../../public/assets/images/icons/CancelIcon';
import styles from '../../../src/features/user/Profile/styles/RedeemModal.module.scss';
import i18next from './../../../i18n';
import { getFormattedNumber } from '../../../src/utils/getFormattedNumber';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import CircularProgress from '@mui/material/CircularProgress';

const { useTranslation } = i18next;
const ReedemCode = () => {
  const { t, i18n, ready } = useTranslation([
    'me',
    'common',
    'donate',
    'redeem',
  ]);
  const { user, contextLoaded, token } = useContext(UserPropsContext);
  const { handleError } = useContext(ErrorHandlingContext);

  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [redeemedCodeData, setRedeemedCodeData] = useState();

  const router = useRouter();

  const closeRedeemModal = () => {
    if (typeof window !== 'undefined') {
      router.push('/profile');
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
  }, [user, contextLoaded, router]);

  async function redeemingCode(code: string) {
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

  return ready ? (
    <LandingSection>
      {redeemedCodeData ? (
        <div className={styles.modal} style={{ paddingBottom: '10px' }}>
          <button className={styles.cancelIcon} onClick={closeRedeemModal}>
            <CancelIcon />
          </button>
          <div className={styles.codeTreeCount} style={{ marginTop: '-34px' }}>
            <div style={{ fontSize: '2rem' }}>
              {getFormattedNumber(
                i18n.language,
                Number(redeemedCodeData.units)
              )}
            </div>
            <span>
              {t('common:trees', { count: Number(redeemedCodeData.units) })}
            </span>
          </div>
          <div
            className={styles.codeTreeCount}
            style={{ marginBottom: '14px' }}
          >
            <span>{t('redeem:successfullyRedeemed')}</span>
          </div>
        </div>
      ) : (
        <div className={styles.modal} style={{ paddingBottom: '45px' }}>
          <button className={styles.cancelIcon} onClick={closeRedeemModal}>
            <CancelIcon />
          </button>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            {errorMessage ? (
              <div>{code}</div>
            ) : (
              <div>
                {t('redeem:redeeming')} {code}
              </div>
            )}
          </div>
          <div style={{ marginBottom: '10px', marginTop: '7px' }}>
            {errorMessage ? (
              <span className={styles.formErrors}>{errorMessage}</span>
            ) : (
              <CircularProgress color="success" />
            )}
          </div>
        </div>
      )}
    </LandingSection>
  ) : (
    <></>
  );
};

export default ReedemCode;

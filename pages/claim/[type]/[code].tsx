import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { postAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import styles from './../../../src/features/user/UserProfile/styles/RedeemModal.module.scss';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import ShareOptions from '../../../src/features/donations/components/ShareOptions';
import Close from '../../../public/assets/images/icons/headerIcons/close';
import i18next from './../../../i18n';
import tenantConfig from './../../../tenant.config';
import LandingSection from '../../../src/features/common/Layout/LandingSection';
import { getFormattedNumber } from '../../../src/utils/getFormattedNumber';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';

const { useTranslation } = i18next;

interface Props {}

function ClaimDonation({}: Props): ReactElement {
  const { t, i18n, ready } = useTranslation([
    'me',
    'common',
    'donate',
    'redeem',
  ]);

  const config = tenantConfig();

  const router = useRouter();

  const { user, contextLoaded, loginWithRedirect, token } = React.useContext(
    UserPropsContext
  );

  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState();
  const [code, setCode] = React.useState();
  const [type, setType] = React.useState();
  const [codeValidated, setCodeValidated] = React.useState(false);
  const [validCodeData, setValidCodeData] = React.useState();

  const [routerReady, setRouterReady] = React.useState(false);

  const imageRef = React.createRef();
  const sendRef = () => imageRef;

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(
    false
  );
  const handleTextCopiedSnackbarOpen = () => {
    setTextCopiedSnackbarOpen(true);
  };

  const handleTextCopiedSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setTextCopiedSnackbarOpen(false);
  };

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [codeRedeemed, setCodeRedeemed] = React.useState(false);

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
        setRouterReady(true);
        setErrorMessage('');
      }
    }
  }, [router]);

  async function validateCode(code: any, type: any) {
    setIsUploadingData(true);
    const submitData = {
      type: type,
      code: code,
    };
    if (contextLoaded && user) {
      const userLang = localStorage.getItem('language') || 'en';
      postAuthenticatedRequest(
        `/api/v1.3/${userLang}/validateCode`,
        submitData,
        token
      ).then((res) => {
        if (res.code === 401) {
          setErrorMessage(res.message);
          setIsUploadingData(false);
        } else if (res.status === 'error') {
          setErrorMessage(res.errorText);
          setIsUploadingData(false);
        } else if (res.status === 'success') {
          setCodeValidated(true);
          setValidCodeData(res);
          setIsUploadingData(false);
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
      if (routerReady && code && type) {
        validateCode(code, type);
      }
    }

    // If the user is not logged in - send the user to log in page, store the claim redirect link in the localstorage.
    // When the user logs in, redirect user to the claim link from the localstorage and clear the localstorage.
    // For this  fetch the link from the storage, clears the storage and then redirects the user using the link
    else if (contextLoaded && user) {
      // store the claim link in localstorage
      if (routerReady && typeof window !== 'undefined') {
        localStorage.setItem('redirectLink', window.location.href);
        loginWithRedirect({
          redirectUri: `${process.env.NEXTAUTH_URL}/login`,
          ui_locales: localStorage.getItem('language') || 'en',
        });
      }
    }
  }, [contextLoaded, user, code]);

  async function redeemCode(code: any, type: any) {
    setIsUploadingData(true);
    const submitData = {
      type: type,
      code: code,
    };
    if (contextLoaded && user) {
      const userLang = localStorage.getItem('language') || 'en';
      postAuthenticatedRequest(
        `/api/v1.3/${userLang}/convertCode`,
        submitData,
        token
      ).then((res) => {
        if (res.code === 401) {
          setErrorMessage(res.message);
          setIsUploadingData(false);
        } else if (res.response.status === 'error') {
          setErrorMessage(res.errorText);
          setIsUploadingData(false);
        } else if (res.response.status === 'success') {
          setCodeRedeemed(true);
          setIsUploadingData(false);
          setCodeValidated(false);
        }
      });
    }
  }

  const closeRedeem = () => {
    setCodeValidated(false);
    setCodeRedeemed(false);
    if (typeof window !== 'undefined') {
      router.push(`/`);
    }
  };

  return ready ? (
    routerReady ? (
      <LandingSection>
        {codeRedeemed && validCodeData ? (
          <>
            <div className={styles.modalFinal}>
              <div className={styles.header}>
                <button
                  id={'closeIconCode'}
                  onClick={() => closeRedeem()}
                  className={styles.headerCloseIcon}
                >
                  <Close />
                </button>
                <div className={styles.headerTitle}>
                  {t('redeem:congratulations')}
                </div>
              </div>

              <div className={styles.thankyouImageContainer}>
                <div className={styles.thankyouImage}>
                  <div className={styles.thankyouImageHeader}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t('donate:thankyouHeaderText'),
                      }}
                    />
                  </div>
                  <div className={styles.donationCount}>
                    {t('redeem:myPlantedTreesByOrg', {
                      count: getFormattedNumber(
                        i18n.language,
                        Number(validCodeData.treeCount)
                      ),
                      tpoName: validCodeData.tpos[0].tpoName,
                    })}
                    <p className={styles.donationTenant}>
                      {t('donate:plantTreesAtURL', { url: config.tenantURL })}
                    </p>
                  </div>
                </div>
              </div>

              {/* hidden div for image download */}
              <div style={{ width: '0px', height: '0px', overflow: 'hidden' }}>
                <div className={styles.tempThankYouImage} ref={imageRef}>
                  <div className={styles.tempthankyouImageHeader}>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t('donate:thankyouHeaderText'),
                      }}
                    />
                  </div>
                  <p className={styles.tempDonationCount}>
                    {t('redeem:myPlantedTreesByOrg', {
                      count: getFormattedNumber(
                        i18n.language,
                        Number(validCodeData.treeCount)
                      ),
                      tpoName: validCodeData.tpos[0].tpoName,
                    })}
                  </p>
                  <p className={styles.tempDonationTenant}>
                    {t('donate:plantTreesAtURL', { url: config.tenantURL })}
                  </p>
                </div>
              </div>

              <div className={styles.shareOptions}>
                <ShareOptions
                  treeCount={getFormattedNumber(
                    i18n.language,
                    Number(validCodeData.treeCount)
                  )}
                  sendRef={sendRef}
                  handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
                />
              </div>

              <Snackbar
                open={textCopiedsnackbarOpen}
                autoHideDuration={4000}
                onClose={handleTextCopiedSnackbarClose}
              >
                <Alert
                  onClose={handleTextCopiedSnackbarClose}
                  severity="success"
                >
                  {t('donate:copiedToClipboard')}
                </Alert>
              </Snackbar>
            </div>
          </>
        ) : (
          <div className={styles.modal}>
            {codeValidated && validCodeData ? (
              <>
                {errorMessage && (
                  <span className={styles.formErrors}>{errorMessage}</span>
                )}

                <div className={styles.codeTreeCount}>
                  {getFormattedNumber(
                    i18n.language,
                    Number(validCodeData.treeCount)
                  )}
                  <span>
                    {t('common:tree', {
                      count: Number(validCodeData.treeCount),
                    })}
                  </span>
                </div>

                <div className={styles.plantedBy}>
                  <span>{t('common:plantedBy')}</span>
                  <p>{validCodeData.tpos[0].tpoName}</p>
                </div>

                <div
                  onClick={() => redeemCode(code, type)}
                  className="primaryButton"
                  style={{ maxWidth: '200px', marginTop: '24px' }}
                >
                  {isUploadingData ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    t('redeem:addToMyTrees')
                  )}
                </div>
              </>
            ) : (
              <>
                <div>
                  {t('redeem:validating')} {code}
                </div>

                {errorMessage && (
                  <span className={styles.formErrors}>{errorMessage}</span>
                )}
                <div
                  onClick={() => validateCode(code, type)}
                  className="primaryButton"
                  style={{ maxWidth: '200px', marginTop: '24px' }}
                >
                  {isUploadingData ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    t('redeem:validateCode')
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </LandingSection>
    ) : (
      <LandingSection>
        <div className={styles.modalFinal}>
          <div className={styles.header}>
            <div
              onClick={() => closeRedeem()}
              className={styles.headerCloseIcon}
            >
              <Close />
            </div>
            <div className={styles.headerTitle}>
              {errorMessage && (
                <span className={styles.formErrors}>{errorMessage}</span>
              )}
            </div>
          </div>
        </div>
      </LandingSection>
    )
  ) : (
    <></>
  );
}

export default ClaimDonation;

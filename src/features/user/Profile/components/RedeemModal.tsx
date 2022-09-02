import styles from '../styles/RedeemModal.module.scss';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useForm } from 'react-hook-form';
import React from 'react';
import Close from '../../../../../public/assets/images/icons/headerIcons/close';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import tenantConfig from '../../../../../tenant.config';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import { ThemeContext } from '../../../../theme/themeContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import ShareOptions from '../../../common/ShareOptions/ShareOptions';
import { styled } from '@mui/material';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';

const { useTranslation } = i18next;
export default function RedeemModal({
  redeemModalOpen,
  handleRedeemModalClose,
  userprofile,
}: any) {
  const { t, i18n, ready } = useTranslation([
    'me',
    'common',
    'donate',
    'redeem',
  ]);

  const config = tenantConfig();

  const { user, contextLoaded, token, loadUser } =
    React.useContext(UserPropsContext);
  const imageRef = React.createRef();
  const sendRef = () => imageRef;

  const [errorMessage, setErrorMessage] = React.useState();
  const [codeValidated, setCodeValidated] = React.useState(false);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [validCodeData, setValidCodeData] = React.useState('');
  const [codeRedeemed, setCodeRedeemed] = React.useState(false);
  const [code, setCode] = React.useState();
  const [inputCode, setInputCode] = React.useState('');
  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] =
    React.useState(false);
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

  const handleAnotherCode = () => {
    setErrorMessage('');
    setInputCode('');
  };

  const afterSuccessfulOfOneCode = () => {
    setErrorMessage('');
    setInputCode('');
    setCodeValidated(false);
  };

  const Alert = styled(MuiAlert)(({ theme }) => {
    return {
      backgroundColor: theme.palette.primary.main,
    };
  });

  const { register, handleSubmit, errors, getValues } = useForm({
    mode: 'onBlur',
  });

  async function redeemCode(data: any) {
    setIsUploadingData(true);
    const submitData = {
      // type: 'gift',
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
          setCode(data.code);
          setCodeValidated(true);
          setValidCodeData(res);
          loadUser();
          setIsUploadingData(false);
        }
      });
    }
  }

  // async function redeemCode() {
  //   setIsUploadingData(true);
  //   const submitData = {
  //     // type: 'gift',
  //     code: code,
  //   };
  //   if (contextLoaded && user) {
  //     const userLang = localStorage.getItem('language') || 'en';
  //     postAuthenticatedRequest(
  //       `/api/v1.3/${userLang}/convertCode`,
  //       submitData,
  //       token,
  //       handleError
  //     ).then((res) => {
  //       if (res.code === 401) {
  //         setErrorMessage(res.message);
  //         setIsUploadingData(false);
  //       } else if (!res.response || res.response.status === 'error') {
  //         setErrorMessage(res.errorText || t('me:wentWrong'));
  //         setIsUploadingData(false);
  //       } else if (res.response.status === 'success') {
  //         setCodeRedeemed(true);
  //         setIsUploadingData(false);
  //         setCodeValidated(false);
  //         const newUser = {
  //           ...user,
  //           score: {
  //             personal: res.schemata.treecounter.countPersonal,
  //             received: res.schemata.treecounter.countReceived,
  //             target: res.schemata.treecounter.countTarget,
  //           },
  //         };
  //         setUser(newUser);
  //       }
  //     });
  //   }
  // }

  const closeRedeem = () => {
    setCodeValidated(false);
    setCodeRedeemed(false);
    handleRedeemModalClose();
    setInputCode('');
    setErrorMessage('');
  };

  const contactDetails = {
    firstName: userprofile.firstname,
    lastName: userprofile.lastname,
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
        {codeRedeemed && validCodeData ? (
          <div className={styles.modalFinal}>
            <div className={styles.header}>
              <button
                id={'closeRedeemM'}
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
                  {validCodeData.tpos?.length > 0 &&
                    t('redeem:myPlantedTreesByOrg', {
                      count: Number(validCodeData.treeCount),
                      formattedNumber: getFormattedNumber(
                        i18n.language,
                        Number(validCodeData.treeCount)
                      ),
                      tpoName: validCodeData.tpos[0]?.tpoName,
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
                  {validCodeData.tpos?.length > 0 &&
                    t('redeem:myPlantedTreesByOrg', {
                      count: Number(validCodeData.treeCount),
                      formattedNumber: getFormattedNumber(
                        i18n.language,
                        Number(validCodeData.treeCount)
                      ),
                      tpoName: validCodeData.tpos[0]?.tpoName,
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
                contactDetails={contactDetails}
              />
            </div>

            <Snackbar
              open={textCopiedsnackbarOpen}
              autoHideDuration={4000}
              onClose={handleTextCopiedSnackbarClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <div>
                <Alert
                  elevation={6}
                  variant="filled"
                  onClose={handleTextCopiedSnackbarClose}
                  severity="success"
                >
                  {t('donate:copiedToClipboard')}
                </Alert>
              </div>
            </Snackbar>
          </div>
        ) : (
          <div className={styles.modal}>
            {codeValidated && validCodeData ? (
              <>
                <div
                  className={styles.codeTreeCount}
                  style={{ fontSize: '2rem' }}
                >
                  {getFormattedNumber(
                    i18n.language,
                    Number(validCodeData.units)
                  )}
                  <span>
                    {t('common:tree', {
                      count: Number(validCodeData.units),
                    })}
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <button
                    className={styles.crossButton}
                    style={{ top: '-57px', right: '-57px' }}
                    onClick={closeRedeem}
                  >
                    <CancelIcon color={styles.primaryFontColor} />
                  </button>
                  <span className={styles.codeTreeCount}>
                    {t('redeem:successfullyRedeemed')}
                  </span>
                </div>

                <button
                  className="primaryButton redeemAnotherCode"
                  onClick={afterSuccessfulOfOneCode}
                >
                  {t('redeem:redeemAnotherCode')}
                </button>

                {validCodeData.tpos?.length > 0 && (
                  <div className={styles.plantedBy}>
                    <span>{t('common:plantedBy')}</span>
                    <p>{validCodeData.tpos[0]?.tpoName}</p>
                  </div>
                )}

                {errorMessage && (
                  <span className={styles.formErrors}>{errorMessage}</span>
                )}
              </>
            ) : (
              <>
                <div className={styles.crossButtonDiv}>
                  <h4 style={{ fontWeight: '700' }}>{t('me:redeem')}</h4>
                  <button className={styles.crossButton} onClick={closeRedeem}>
                    <CancelIcon color={styles.primaryFontColor} />
                  </button>
                </div>

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
                  <span className={styles.formErrors}>
                    {errors.code.message}
                  </span>
                )}
                {errorMessage && !errors.code && !isUploadingData && (
                  <span className={styles.formErrors}>{errorMessage}</span>
                )}

                {errorMessage && (
                  <button
                    className="primaryButton redeemAnotherCode"
                    onClick={handleAnotherCode}
                  >
                    {t('redeem:redeemAnotherCode')}
                  </button>
                )}
                {!errorMessage && (
                  <button
                    id={'redeemCodeModal'}
                    onClick={handleSubmit(redeemCode)}
                    className="primaryButton redeemCode"
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
        )}
      </Fade>
    </Modal>
  ) : null;
}

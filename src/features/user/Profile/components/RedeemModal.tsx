import React from 'react';
import styles from '../styles/RedeemModal.module.scss';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useForm } from 'react-hook-form';
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

  const { user, contextLoaded, token, setUser } =
    React.useContext(UserPropsContext);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const imageRef = React.createRef();
  const sendRef = () => imageRef;

  const [errorMessage, setErrorMessage] = React.useState();
  const [codeValidated, setCodeValidated] = React.useState(false);
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [validCodeData, setValidCodeData] = React.useState();
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

  const Alert = styled(MuiAlert)(({ theme }) => {
    return {
      backgroundColor: theme.palette.primary.main,
    };
  });

  const { register, handleSubmit, errors, getValues } = useForm({
    mode: 'onBlur',
  });

  async function validateCode(data: any) {
    setIsUploadingData(true);
    const submitData = {
      type: 'gift',
      code: data.code,
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
          setCode(data.code);
          setCodeValidated(true);
          setValidCodeData(res);
          setIsUploadingData(false);
        }
      });
    }
  }

  async function redeemCode() {
    setIsUploadingData(true);
    const submitData = {
      type: 'gift',
      code: code,
    };
    if (contextLoaded && user) {
      const userLang = localStorage.getItem('language') || 'en';
      postAuthenticatedRequest(
        `/api/v1.3/${userLang}/convertCode`,
        submitData,
        token,
        handleError
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
          const newUser = {
            ...user,
            score: {
              personal: res.schemata.treecounter.countPersonal,
              received: res.schemata.treecounter.countReceived,
              target: res.schemata.treecounter.countTarget,
            },
          };
          setUser(newUser);
        }
      });
    }
  }

  const closeRedeem = () => {
    setCodeValidated(false);
    setCodeRedeemed(false);
    handleRedeemModalClose();
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

                {validCodeData.tpos?.length > 0 && (
                  <div className={styles.plantedBy}>
                    <span>{t('common:plantedBy')}</span>
                    <p>{validCodeData.tpos[0]?.tpoName}</p>
                  </div>
                )}

                <button
                  id={'redeemModalCont'}
                  onClick={handleSubmit(redeemCode)}
                  className="primaryButton"
                  style={{ maxWidth: '200px', marginTop: '24px' }}
                >
                  {isUploadingData ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    t('redeem:addToMyTrees')
                  )}
                </button>
              </>
            ) : (
              <>
                <h4>{t('me:redeem')}</h4>
                <div className={styles.note}>
                  <p>{t('me:redeemDescription')}</p>
                </div>
                <div className={styles.inputField}>
                  <MaterialTextField
                    inputRef={register({
                      required: {
                        value: true,
                        message: t('redeem:enterRedeemCode'),
                      },
                    })}
                    onChange={(event) => {
                      console.log(event.target.value);
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
                {errors.code && (
                  <span className={styles.formErrors}>
                    {errors.code.message}
                  </span>
                )}

                {errorMessage && (
                  <span className={styles.formErrors}>{errorMessage}</span>
                )}
                <button
                  id={'validateCodeRedeem'}
                  onClick={handleSubmit(validateCode)}
                  className="primaryButton"
                  style={{ maxWidth: '200px', marginTop: '24px' }}
                >
                  {isUploadingData ? (
                    <div className={styles.spinner}></div>
                  ) : (
                    t('redeem:validateCode')
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </Fade>
    </Modal>
  ) : null;
}

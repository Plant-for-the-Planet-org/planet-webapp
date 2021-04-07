import React from 'react';
import styles from '../styles/RedeemModal.module.scss';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import i18next from '../../../../../i18n';
import { postAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import { useForm } from 'react-hook-form';
import { useAuth0 } from '@auth0/auth0-react';
import Close from '../../../../../public/assets/images/icons/headerIcons/close';
import ShareOptions from '../../../donations/components/ShareOptions';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import tenantConfig from '../../../../../tenant.config';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import { ThemeContext } from '../../../../theme/themeContext';

const { useTranslation } = i18next;
export default function RedeemModal({
  redeemModalOpen,
  handleRedeemModalClose,
  userprofile
}: any) {
  const { t, i18n, ready } = useTranslation(['me', 'common', 'donate','redeem']);

  const config = tenantConfig();

  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently
  } = useAuth0();

  const imageRef = React.createRef();
  const sendRef = () => imageRef;

  const [errorMessage, setErrorMessage] = React.useState()
  const [codeValidated, setCodeValidated] = React.useState(false)
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [validCodeData, setValidCodeData] = React.useState();
  const [codeRedeemed, setCodeRedeemed] = React.useState(false);
  const [code, setCode] = React.useState();
  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(
    false,
  );
  const handleTextCopiedSnackbarOpen = () => {
    setTextCopiedSnackbarOpen(true);
  };

  const handleTextCopiedSnackbarClose = (
    event?: React.SyntheticEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setTextCopiedSnackbarOpen(false);
  };

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const {
    register,
    handleSubmit,
    errors,
    getValues
  } = useForm({ mode: 'onBlur' });

  async function validateCode(data: any) {
    setIsUploadingData(true)
    const submitData = {
      type: 'gift',
      code: data.code
    }
    if (!isLoading && isAuthenticated) {
      const token = await getAccessTokenSilently();
      const userLang = localStorage.getItem('language') || 'en';
      postAuthenticatedRequest(`/api/v1.3/${userLang}/validateCode`, submitData, token).then((res) => {
        if (res.code === 401) {
          setErrorMessage(res.message);
          setIsUploadingData(false)
        }
        else if (res.status === 'error') {
          setErrorMessage(res.errorText);
          setIsUploadingData(false)
        }
        else if (res.status === 'success') {
          setCode(data.code)
          setCodeValidated(true);
          setValidCodeData(res)
          setIsUploadingData(false)
        }
      })
    }
  }

  async function redeemCode() {
    setIsUploadingData(true)
    const submitData = {
      type: 'gift',
      code: code
    }
    if (!isLoading && isAuthenticated) {
      const token = await getAccessTokenSilently();
      const userLang = localStorage.getItem('language') || 'en';
      postAuthenticatedRequest(`/api/v1.3/${userLang}/convertCode`, submitData, token).then((res) => {
        if (res.code === 401) {
          setErrorMessage(res.message);
          setIsUploadingData(false)
        }
        else if (res.response.status === 'error') {
          setErrorMessage(res.errorText);
          setIsUploadingData(false)
        }
        else if (res.response.status === 'success') {
          setCodeRedeemed(true);
          setIsUploadingData(false);
          setCodeValidated(false);
        }
      })
    }
  }

  const closeRedeem = () => {
    setCodeValidated(false);
    setCodeRedeemed(false);
    handleRedeemModalClose()
  }

  const contactDetails =  {
    firstName: userprofile.firstname,
    lastName:userprofile.lastname
  }

  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    <Modal
      className={'modalContainer'+' '+theme}
      open={redeemModalOpen}
      onClose={handleRedeemModalClose}
      closeAfterTransition
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={redeemModalOpen}>

        {codeRedeemed && validCodeData ? (
          <>
            <div className={styles.modalFinal}>
              <div className={styles.header}>
                <button id={'closeRedeemM'} onClick={() => closeRedeem()} className={styles.headerCloseIcon}>
                  <Close />
                </button>
                <div className={styles.headerTitle}>
                  {t('redeem:congratulations')}
                </div>
              </div>

              <div className={styles.thankyouImageContainer}>
                <div className={styles.thankyouImage}>
                  <div className={styles.thankyouImageHeader}>
                    <p dangerouslySetInnerHTML={{ __html: t('donate:thankyouHeaderText') }} />
                  </div>
                  <div className={styles.donationCount}>
                    {t('redeem:myPlantedTreesByOrg', {
                      count: Number(validCodeData.treeCount),
                      formattedNumber: getFormattedNumber(i18n.language, Number(validCodeData.treeCount)), 
                      tpoName:validCodeData.tpos[0].tpoName 
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
                    <p dangerouslySetInnerHTML={{ __html: t('donate:thankyouHeaderText') }} />
                  </div>
                  <p className={styles.tempDonationCount}>
                    {t('redeem:myPlantedTreesByOrg', {
                      count: Number(validCodeData.treeCount),
                      formattedNumber: getFormattedNumber(i18n.language, Number(validCodeData.treeCount)),
                      tpoName:validCodeData.tpos[0].tpoName
                    })}
                  </p>
                  <p className={styles.tempDonationTenant}>
                    {t('donate:plantTreesAtURL', { url: config.tenantURL })}
                  </p>
                </div>
              </div>

              <div className={styles.shareOptions}>
                <ShareOptions
                  treeCount={getFormattedNumber(i18n.language, Number(validCodeData.treeCount))}
                  sendRef={sendRef}
                  handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
                  contactDetails={contactDetails}
                />
              </div>

              <Snackbar
                open={textCopiedsnackbarOpen}
                autoHideDuration={4000}
                onClose={handleTextCopiedSnackbarClose}
              >
                <Alert onClose={handleTextCopiedSnackbarClose} severity="success">
                  {t('donate:copiedToClipboard')}
                </Alert>
              </Snackbar>

            </div>
          </>
        ) : (
            <div className={styles.modal}>
              {codeValidated && validCodeData ? (
                <>
                  <div className={styles.codeTreeCount}>
                    {getFormattedNumber(i18n.language, Number(validCodeData.treeCount))}
                    <span>{t('common:tree', { count: Number(validCodeData.treeCount) })}</span>
                  </div>

                  <div className={styles.plantedBy}>
                    <span>{t('common:plantedBy')}</span>
                    <p>{validCodeData.tpos[0].tpoName}</p>
                  </div>

                  <button id={'redeemModalCont'} onClick={handleSubmit(redeemCode)} className="primaryButton" style={{maxWidth: "200px", marginTop: "24px"}}>
                    {isUploadingData ? (
                      <div className={styles.spinner}></div>
                    ) : (t('redeem:addToMyTrees'))}
                  </button>
                </>
              ) : (
                  <>
                    <h4>
                      {t('me:redeem')}
                    </h4>
                    <div className={styles.note}>
                      <p>{t('me:redeemDescription')}</p>
                    </div>
                    <div className={styles.inputField}>
                      <MaterialTextField inputRef={register({
                        required: {
                          value: true,
                          message: t('redeem:enterRedeemCode'),
                        }
                      })} name={'code'} placeholder="XAD-1SA-5F1-A" label="" variant="outlined" />

                    </div>
                    {errors.code && (
                      <span className={styles.formErrors}>{errors.code.message}</span>
                    )}

                    {errorMessage && (
                      <span className={styles.formErrors}>{errorMessage}</span>
                    )}
                    <button id={'validateCodeRedeem'} onClick={handleSubmit(validateCode)} className="primaryButton" style={{maxWidth: "200px", marginTop: "24px"}}> 
                      {isUploadingData ? (
                        <div className={styles.spinner}></div>
                      ) : (t('redeem:validateCode'))}
                    </button>
                  </>
                )}

            </div>
          )}

      </Fade>
    </Modal>
  ) : null;
}

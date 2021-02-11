import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { ReactElement } from 'react';
import tenantConfig from '../../../../tenant.config';
import Close from '../../../../public/assets/images/icons/headerIcons/close';
import { ThankYouProps } from '../../common/types/donations';
import styles from '../styles/ThankYou.module.scss';
import ShareOptions from '../components/ShareOptions';
import { getPaymentType } from '../components/PaymentFunctions';
import i18next from '../../../../i18n';
import getFormatedCurrency from '../../../utils/countryCurrency/getFormattedCurrency';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import { getRequest } from '../../../utils/apiRequests/api';
import PaymentProgress from '../../common/ContentLoaders/Donations/PaymentProgress';
import PaymentFailedIllustration from '../../../../public/assets/images/icons/donation/PaymentFailed';
import PaymentPendingIllustration from '../../../../public/assets/images/icons/donation/PaymentPending';

const { useTranslation } = i18next;

function ThankYou({
  donationID,
  onClose,
  paymentType,
  redirectStatus
}: ThankYouProps): ReactElement {
  const { t, i18n, ready } = useTranslation(['donate', 'common', 'country']);

  const [donation, setdonation] = React.useState(null)
  React.useEffect(() => {
    async function loadDonation() {
      const donation = await getRequest(`/app/donations/${donationID}`);
      setdonation(donation);
    }
    if (donationID) {
      loadDonation();
    }
  }, [donationID])

  const config = tenantConfig();
  const imageRef = React.createRef();

  const paymentTypeUsed = getPaymentType(paymentType);

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(
    false,
  );

  const sendRef = () => imageRef;

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

  let currencyFormat;
  if (donation) {
    currencyFormat = () => getFormatedCurrency(i18n.language, donation.currency, donation.amount);
  }

  function SuccessfulDonation() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button id={'thankYouClose'} onClick={onClose} className={styles.headerCloseIcon}>
            <Close />
          </button>
          <div className={styles.headerTitle}>{t('common:thankYou')}</div>
        </div>

        <div className={styles.contributionMessage}>
          {t(
            paymentTypeUsed === 'GOOGLE_PAY' || paymentTypeUsed === 'APPLE_PAY'
              ? 'donate:donationSuccessfulWith'
              : 'donate:donationSuccessful',
            {
              totalAmount: currencyFormat(),
              paymentTypeUsed,
            },
          )}
          {donation.gift ? (
            ' ' + t('donate:giftSentMessage', {
              recipientName: donation.gift.recipientName,
            })
          ) : null}
          {' ' + t('donate:yourTreesPlantedByOnLocation', {
            treeCount: getFormattedNumber(i18n.language, Number(donation.treeCount)),
            projectName: donation.project.name,
            location: t('country:' + donation.project.country.toLowerCase()),
          })}
        </div>

        <div className={styles.contributionMessage}>
          {t('donate:contributionMessage')}
        </div>

        {/* <div className={styles.horizontalLine} /> */}

        {/* hidden div for image download */}
        <div style={{ width: '0px', height: '0px', overflow: 'hidden' }}>
          <div className={styles.tempThankYouImage} ref={imageRef}>
            <div className={styles.tempthankyouImageHeader}>
              <p dangerouslySetInnerHTML={{ __html: t('donate:thankyouHeaderText') }} />
            </div>
            <p className={styles.tempDonationCount}>
              {t('donate:myTreesPlantedByOnLocation', {
                treeCount: getFormattedNumber(i18n.language, Number(donation.treeCount)),
                location: t('country:' + donation.project.country.toLowerCase()),
              })}
            </p>
            <p className={styles.tempDonationTenant}>
              {t('donate:plantTreesAtURL', { url: config.tenantURL })}
            </p>
          </div>
        </div>

        <div className={styles.thankyouImageContainer}>
          <div className={styles.thankyouImage}>
            <div className={styles.thankyouImageHeader}>
              <p dangerouslySetInnerHTML={{ __html: t('donate:thankyouHeaderText') }} />
            </div>
            <div className={styles.donationCount}>
              {t('donate:myTreesPlantedByOnLocation', {
                treeCount: getFormattedNumber(i18n.language, Number(donation.treeCount)),
                location: t('country:' + donation.project.country.toLowerCase()),
              })}
              <p className={styles.donationTenant}>
                {t('donate:plantTreesAtURL', { url: config.tenantURL })}
              </p>
            </div>
          </div>
        </div>

        <ShareOptions
          treeCount={getFormattedNumber(i18n.language, Number(donation.treeCount))}
          sendRef={sendRef}
          handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
          donor={donation.donor}
        />

        {/* snackbar for showing text copied to clipboard */}
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

    )
  }

  function FailedDonation() {
    return (
      <div className={styles.container} style={{paddingBottom:'24px'}}>
        <div className={styles.header}>
          <button id={'thankYouClose'} onClick={onClose} className={styles.headerCloseIcon}>
            <Close />
          </button>
          <div className={styles.headerTitle}>{t('donate:donationFailed')}</div>
        </div>
        <div className={styles.contributionMessage} style={{ marginBottom: '24px' }}>
          {t('donate:donationFailedMessage')}
        </div>
        <PaymentFailedIllustration/>
      </div>
    )

  }

  function PendingDonation() {
    return (
      <div className={styles.container} style={{paddingBottom:'24px'}}>
        <div className={styles.header}>
          <button id={'thankYouClose'} onClick={onClose} className={styles.headerCloseIcon}>
            <Close />
          </button>
          <div className={styles.headerTitle}>{t('donate:donationPending')}</div>
        </div>
        <div className={styles.contributionMessage} style={{ marginBottom: '24px' }}>
          {t('donate:donationPendingMessage')}
        </div>
        <PaymentPendingIllustration/>
      </div>
    )

  }


  if (ready && donation) {
    if (!redirectStatus) {
      switch (donation.paymentStatus) {
        case 'success':
        case 'paid': return <SuccessfulDonation />;
        case 'failed': return <FailedDonation />;
        case 'initiated': return <PendingDonation />;
        default: return <PendingDonation />;
      }
    } else if (redirectStatus) {
      switch (redirectStatus) {
        case 'failed': return <FailedDonation />;
        case 'succeeded': return <SuccessfulDonation />;
        default: return <PendingDonation />;
      }
    }
  } else {
    return <PaymentProgress isPaymentProcessing={true} />
  }

}

export default ThankYou;

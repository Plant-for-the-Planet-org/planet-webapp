import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import tenantConfig from '../../../../../tenant.config';
import Close from '../../../../../public/assets/images/icons/headerIcons/close';
import { ThankYouProps } from '../../../common/types/donations';
import styles from '../styles/ThankYou.module.scss';
import ShareOptions from './ShareOptions';
import { getPaymentType } from './treeDonation/PaymentFunctions';
import { getCountryDataBy } from '../../../../utils/countryCurrency/countryUtils';
import i18next from '../../../../../i18n';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';

const { useTranslation } = i18next;

function ThankYou({
  project,
  treeCount,
  treeCost,
  currency,
  contactDetails,
  isGift,
  giftDetails,
  onClose,
  paymentType,
}: ThankYouProps): ReactElement {
  const { t, i18n } = useTranslation(['donate', 'common']);

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

  const currencyFormat = () => getFormatedCurrency(i18n.language, currency, treeCost * treeCount);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div onClick={onClose} className={styles.headerCloseIcon}>
          <Close />
        </div>
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
        {isGift
          && t('donate:giftSentMessage', {
            recipientName: giftDetails.recipientName,
          })}
{' '}
        {t('donate:yourTreesPlantedByOnLocation', {
          treeCount: Sugar.Number.format(Number(treeCount)),
          projectName: project.name,
          location: getCountryDataBy('countryCode', project.country)
            .countryName,
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
            <p>{t('donate:thankyouHeaderText')}</p>
          </div>
            <p className={styles.tempDonationCount}>
              {t('donate:myTreesPlantedByOnLocation', {
                treeCount: Sugar.Number.format(Number(treeCount)),
                location: getCountryDataBy('countryCode', project.country)
                  .countryName,
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
            <p>{t('donate:thankyouHeaderText')}</p>
          </div>
          <div className={styles.donationCount}>
            {t('donate:myTreesPlantedByOnLocation', {
              treeCount: Sugar.Number.format(Number(treeCount)),
              location: getCountryDataBy('countryCode', project.country)
                .countryName,
            })}
            <p className={styles.donationTenant}>
              {t('donate:plantTreesAtURL', { url: config.tenantURL })}
            </p>
          </div>
        </div>
      </div>

      <ShareOptions
        treeCount={treeCount}
        sendRef={sendRef}
        handleTextCopiedSnackbarOpen={handleTextCopiedSnackbarOpen}
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
  );
}

export default ThankYou;

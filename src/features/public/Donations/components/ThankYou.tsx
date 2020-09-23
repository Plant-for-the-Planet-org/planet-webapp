import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import tenantConfig from '../../../../../tenant.config';
import Close from '../../../../assets/images/icons/headerIcons/close';
import { ThankYouProps } from '../../../common/types/donations';
import styles from './../styles/ThankYou.module.scss';
import ShareOptions from './ShareOptions';
import { getPaymentType } from './treeDonation/PaymentFunctions';
import { getCountryDataBy } from '../../../../utils/countryUtils';

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
  const config = tenantConfig();
  const imageRef = React.createRef();

  let paymentTypeUsed = getPaymentType(paymentType);

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(
    false
  );

  const sendRef = () => {
    return imageRef;
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div onClick={onClose} className={styles.headerCloseIcon}>
          <Close />
        </div>
        <div className={styles.headerTitle}>Thank You!</div>
      </div>

      <div className={styles.contributionMessage}>
        Your {currency} {Sugar.Number.format(Number(treeCount * treeCost), 2)}{' '}
        donation was{' '}
        {paymentTypeUsed === 'GOOGLE_PAY' || paymentTypeUsed === 'APPLE_PAY'
          ? `successfully paid with ${paymentTypeUsed}`
          : 'successful'}
        .
        {isGift &&
          `We've sent an email to ${giftDetails.recipientName} about the gift.`}{' '}
        Your {Sugar.Number.format(Number(treeCount))} trees will be planted by{' '}
        {project.name} in {getCountryDataBy('countryCode', project.country)
          .countryName}.
      </div>

      <div className={styles.contributionMessage}>
        Maybe you'll visit them some day? In the mean time, maybe hook up your
        friends with some trees of their own by telling them about yours?
      </div>

      {/* <div className={styles.horizontalLine} /> */}

          {/* hidden div for image download */}
      {(
        <div style={{width:'0px', height:'0px', overflow:'hidden'}}>
        <div className={styles.tempThankYouImage} ref={imageRef}>
          <p className={styles.tempDonationCount}>
            My {Sugar.Number.format(Number(treeCount))} trees are being planted
            in {getCountryDataBy('countryCode', project.country)
              .countryName}
          </p>
          <p className={styles.tempDonationTenant}>
            Plant trees at {config.tenantURL}
          </p>
        </div>
        </div>
      )}

      <div className={styles.thankyouImageContainer}>
        <div className={styles.thankyouImage}>
          <div className={styles.donationCount}>
            My {Sugar.Number.format(Number(treeCount))} trees are being planted
            in {getCountryDataBy('countryCode', project.country)
              .countryName}
            <p className={styles.donationTenant}>
              Plant trees at {config.tenantURL}
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
          Text Copied to Clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ThankYou;

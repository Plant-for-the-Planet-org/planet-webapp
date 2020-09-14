import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { ReactElement, useRef } from 'react';
import Sugar from 'sugar';
import Close from '../../../../assets/images/icons/headerIcons/close';
import { ThankYouProps } from '../../../common/types/donations';
import styles from './../styles/ThankYou.module.scss';
import ShareOptions from './ShareOptions';
import tenantConfig from '../../../../../tenant.config';

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
  const imageRef = useRef();

  let paymentTypeUsed;
  switch (paymentType) {
    case 'CARD':
      paymentTypeUsed = 'Credit Card';
      break;
    case 'SEPA':
      paymentTypeUsed = 'SEPA Direct Debit';
      break;
    case 'GOOGLE_PAY':
      paymentTypeUsed = 'Google Pay';
      break;
    case 'APPLE_PAY':
      paymentTypeUsed = 'Apple Pay';
      break;
    case 'BROWSER':
      paymentTypeUsed = 'Browser';
      break;
    default:
      paymentTypeUsed = 'Credit Card';
  }

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

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
        donation was successfully paid with {paymentTypeUsed}.
        {isGift &&
          `We've sent an email to ${giftDetails.recipientName} about the gift.`}{' '}
        Your {treeCount} trees will be planted by {project.name} in{' '}
        {project.location}.
      </div>

      <div className={styles.contributionMessage}>
        Maybe you'll visit them some day? In the mean time,
        maybe hook up your friends with some trees of their own by telling them
        our yours?
      </div>

      <div className={styles.horizontalLine} />

      <div className={styles.thankyouImageContainer} >
        <div className={styles.thankyouImage} ref={imageRef}>

          <div className={styles.donationCount}>
            My {treeCount} trees are being planted in {project.location}
            <div className={styles.donationTenant}>
              Plant trees at{' '} {config.tenantURL}
            </div>
          </div>
        </div>
      </div>

      <ShareOptions
        toPrintRef={imageRef}
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

// Thank you, Marc!
// Your €11.84 donation was successful. We thank you for helping us fulfil our mission of bringing back the world’s forests. Your 10 trees will be planted by Yucatan Reforestation in Mexico. Maybe you’ll be able to visit them some day?
// Want to do even more? Maybe hook up your friends with some trees of their own by telling them our yours?

// Title: Planting trees against the climate crisis
// Text: Preventing the climate crisis requires drastically reducing carbon emissions and planting trees. That’s why I just planted some. Check out salesforce.com/trees if you want to plant some too!

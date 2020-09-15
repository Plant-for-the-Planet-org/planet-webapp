import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import ShareFilled from '../../../../assets/images/icons/donation/ShareFilled';
import Close from '../../../../assets/images/icons/headerIcons/close';
import { ThankYouProps } from '../../../common/types/donations';
import styles from './../styles/ThankYou.module.scss';
import { getPaymentType } from './treeDonation/PaymentFunctions';

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
  let paymentTypeUsed = getPaymentType(paymentType);

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

  const shareClicked = async () => {
    if (navigator.share !== undefined) {
      // if in phone and web share API supported
      try {
        const response = await navigator.share({
          title: 'Planting trees against the climate crisis!',
          text:
            'Preventing the climate crisis requires drastically reducing carbon emissions and planting trees. That’s why I just planted some.\nCheck out salesforce.com/trees if you want to plant some too!\n',
        });
        // console.log('Share complete', response);
      } catch (error) {
        // console.error('Could not share at this time', error);
      }
    } else {
      // copy to clipboard
      navigator.clipboard.writeText('Dummy text copied to clipboard!');
      handleTextCopiedSnackbarOpen();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div onClick={onClose} className={styles.headerCloseIcon}>
          <Close />
        </div>
        <div className={styles.headerTitle}>Thank You!</div>
      </div>

      <div className={styles.contributionAmount}>
        Your {currency} {Sugar.Number.format(Number(treeCount * treeCost), 2)}{' '}
        donation was successfully paid with {paymentTypeUsed}.
      </div>

      <div className={styles.contributionMessage}>
        {isGift &&
          `We've sent an email to ${giftDetails.recipientName} about the gift.`}{' '}
        Your {treeCount} trees will be planted by {project.name} in{' '}
        {project.location}. Maybe you'll visit them some day? In the mean time,
        maybe hook up your friends with some trees of their own by telling them
        our yours?
      </div>

      <div className={styles.horizontalLine} />

      <div className={styles.thankyouImageContainer}>
        <div className={styles.thankyouImage}>
          {/* <div className={styles.pfpLogo}>
                        <PlanetLogo />
                    </div> */}
          <div className={styles.donationCount}>
            My {treeCount} trees are being planted in {project.location}
            <div className={styles.donationTenant}>
              Plant trees at{' '}
              {process.env.TENANT === 'salesforce'
                ? 'salesforce.com/trees'
                : 'trilliontreecampaign.org'}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        {/* <div className={styles.downloadButton}>
                    <Download />
                </div> */}
        {/* <div style={{ width: '20px' }}></div> */}
        <div className={styles.downloadButton} onClick={shareClicked}>
          <div style={{ marginRight: '12px' }}>Share</div>
          <ShareFilled height={'18px'} width={'18px'} color={'#fff'} />
        </div>
      </div>

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

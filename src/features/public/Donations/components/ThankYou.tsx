import React, { ReactElement } from 'react';
import Close from '../../../../assets/images/icons/headerIcons/close';
import Share from '../../../../assets/images/icons/userProfileIcons/Share';
import { ThankYouProps } from '../../../common/types/donations';
import styles from './../styles/ThankYou.module.scss';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

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

  const [textCopiedsnackbarOpen, setTextCopiedSnackbarOpen] = React.useState(false);

  const handleTextCopiedSnackbarOpen = () => {
    setTextCopiedSnackbarOpen(true)
  }
  const handleTextCopiedSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
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
        console.log('Share complete', response);
      } catch (error) {
        console.error('Could not share at this time', error);
      }
    } else {
      // copy to clipboard
      navigator.clipboard.writeText('Dummy text copied to clipboard!');
      handleTextCopiedSnackbarOpen();
    }
  };

  console.log('Project', project);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div onClick={onClose} className={styles.headerCloseIcon}>
          <Close />
        </div>
        <div className={styles.headerTitle}>Thank You!</div>
      </div>

      <div className={styles.contributionAmount}>
        Your Donation of {currency} {Number(treeCount * treeCost).toFixed(2)}{' '}
        was paid with {paymentTypeUsed}
      </div>

      <div className={styles.contributionMessage}>
        {isGift &&
          `We've sent an email to ${giftDetails.firstName} ${giftDetails.lastName} about the gift.`}{' '}
        Your {treeCount} trees will be planted by {project.name}.
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
          <Share color={'#87b738'} />
        </div>
      </div>

       {/* snackbar for showing text copied to clipboard */}
       <Snackbar open={textCopiedsnackbarOpen} autoHideDuration={4000} onClose={handleTextCopiedSnackbarClose} >
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

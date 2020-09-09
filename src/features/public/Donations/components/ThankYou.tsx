import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import React, { ReactElement } from 'react';
import Sugar from 'sugar';
import ShareFilled from '../../../../assets/images/icons/donation/ShareFilled';
import Close from '../../../../assets/images/icons/headerIcons/close';
import { ThankYouProps } from '../../../common/types/donations';
import styles from './../styles/ThankYou.module.scss';
import SpeedDial, { SpeedDialProps } from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import EmailIcon from '../../../../assets/images/icons/share/Email';
import FacebookIcon from '../../../../assets/images/icons/share/Facebook';
import TwitterIcon from '../../../../assets/images/icons/share/Twitter';
import LinkedinIcon from '../../../../assets/images/icons/share/Linkedin';

const titleToShare = 'Planting trees against the climate crisis!';
const textToShare =
  'Preventing the climate crisis requires drastically reducing carbon emissions and planting trees. That’s why I just planted some.\nCheck out salesforce.com/trees if you want to plant some too!\n';
const linkToShare = 'https://www.salesforce.com/';

const actions = [
  {
    icon: <EmailIcon/>,
    name: 'Email',
    onClickAction: function () {
      window.open(
        `mailto:?subject=${titleToShare}&body=${textToShare}`,
        '_blank'
      );
    },
  },
  {
    icon: <FacebookIcon />,
    name: 'Facebook',
    onClickAction: function () {
      window.open(
        `https://www.facebook.com/sharer.php?u=${linkToShare}&quote=${textToShare}`,
        '_blank'
      );
    },
  },
  {
    icon: <TwitterIcon />,
    name: 'Twitter',
    onClickAction: function () {
      window.open(
        `https://twitter.com/intent/tweet?text=${textToShare}`,
        '_blank'
      );
    },
  },
  {
    icon: <LinkedinIcon />,
    name: 'Linkedin',
    onClickAction: function () {
      window.open(
        `https://www.linkedin.com/shareArticle?mini=true&url=&title=${textToShare}&summary=&source=`,
        '_blank'
      );
    },
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'absolute',
    },
  })
);

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
  const classes = useStyles();
  const [direction, setDirection] = React.useState<SpeedDialProps['direction']>(
    'right'
  );
  const [speedDialOpen, setSpeedDialOpen] = React.useState(true); // TODO FALSE
  const [hidden, setHidden] = React.useState(false);

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

  const shareClicked = async () => {
    if (navigator.share !== undefined) {
      // if in phone and web share API supported
      try {
        const response = await navigator.share({
          title: titleToShare,
          text: textToShare,
        });
      } catch (error) {}
    } else {
      // copy to clipboard
      navigator.clipboard.writeText('Dummy text copied to clipboard!');
      handleTextCopiedSnackbarOpen();
    }
  };

  // share speed dial
  const handleSpeedDialClose = () => {
    setSpeedDialOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setSpeedDialOpen(true);
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
        <div className={styles.downloadButton} onClick={shareClicked}>
          <div style={{ marginRight: '12px' }}>Share</div>
        </div>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          hidden={hidden}
          icon={<ShareFilled height={'18px'} width={'18px'} color={'#fff'} />}
          onClose={handleSpeedDialClose}
          onOpen={handleSpeedDialOpen}
          open={speedDialOpen}
          direction={direction}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClickAction}
            />
          ))}
        </SpeedDial>
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

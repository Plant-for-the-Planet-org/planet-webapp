import React, { useRef } from 'react';
import styles from './../styles/ThankYou.module.scss';
import EmailIcon from '../../../../assets/images/icons/share/Email';
import EmailSolid from '../../../../assets/images/icons/share/EmailSolid';
import FacebookIcon from '../../../../assets/images/icons/share/Facebook';
import TwitterIcon from '../../../../assets/images/icons/share/Twitter';
import DownloadIcon from '../../../../assets/images/icons/share/Download';
import DownloadSolid from '../../../../assets/images/icons/share/DownloadSolid';
import InstagramIcon from '../../../../assets/images/icons/share/Instagram';
import { isMobileBrowser } from '../../../../utils/isMobileBrowser';

let rcei;
import('react-component-export-image').then(tempModule=> {
    rcei = tempModule;
}).catch(err=> {})

const titleToShare = 'Planting trees against the climate crisis!';
const urlToShare =
  process.env.TENANT === 'salesforce'
    ? 'https://www.salesforce.com/'
    : 'https://www.trilliontreecampaign.org/';
const linkToShare =
  process.env.TENANT === 'salesforce'
    ? 'salesforce.com/trees'
    : 'trilliontreecampaign.org';
const textToShare = `Preventing the climate crisis requires drastically reducing carbon emissions and planting trees. That’s why I just planted some.\nCheck out ${linkToShare} if you want to plant some too!\n`;

const ShareOptions = (props) => {
  const [currentHover, setCurrentHover] = React.useState(-1);

  const shareClicked = async (shareUrl) => {
    if (navigator.share !== undefined) {
      // if in phone and web share API supported
      try {
        const response = await navigator.share({
          title: titleToShare,
          text: textToShare,
        });
      } catch (error) {}
    } else {
      if (isMobileBrowser()) {
        // if in phone, copy to clipboard
        navigator.clipboard.writeText(textToShare);
        props.handleTextCopiedSnackbarOpen();
      } else {
        // desktop
        window.open(shareUrl, '_blank');
      }
    }
  };

  return (
    <div className={styles.shareRow} onMouseOut={() => setCurrentHover(-1)} style={{cursor:'pointer'}}>
      <div
        className={styles.shareIcon}
        onClick={() => {
          if (props.toPrintRef) {
            rcei.exportComponentAsJPEG(props.toPrintRef);
          }
        }}
        onMouseOver={() => setCurrentHover(1)}
      >
        {currentHover === 1 ? (
          <DownloadSolid color={styles.blueishGrey} />
        ) : (
          <DownloadIcon color={styles.blueishGrey} />
        )}
      </div>

      <div
        className={styles.shareIcon}
        onClick={() =>
          shareClicked(
            `https://www.facebook.com/sharer.php?u=${urlToShare}&quote=${textToShare}`,
            '_blank'
          )
        }
        onMouseOver={() => setCurrentHover(2)}
      >
        <FacebookIcon
          color={currentHover === 2 ? '#3b5998' : styles.blueishGrey}
        />
      </div>

      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(3)}
        onClick={() =>
          shareClicked(`https://www.instagram.com/plantfortheplanet_official/`)
        }
      >
        <InstagramIcon
          color={currentHover === 3 ? '#dd217b' : styles.blueishGrey}
        />
      </div>

      <div
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(4)}
        onClick={() =>
          shareClicked(`https://twitter.com/intent/tweet?text=${textToShare}`)
        }
      >
        <TwitterIcon
          color={currentHover === 4 ? '#00acee' : styles.blueishGrey}
        />
      </div>

      <div
        className={styles.shareIcon}
        onClick={() =>
          shareClicked(`mailto:?subject=${titleToShare}&body=${textToShare}`)
        }
        onMouseOver={() => setCurrentHover(5)}
      >
        {currentHover === 5 ? (
          <EmailSolid color={styles.blueishGrey} />
        ) : (
          <EmailIcon color={styles.blueishGrey} />
        )}
      </div>
    </div>
  );
};

export default ShareOptions;

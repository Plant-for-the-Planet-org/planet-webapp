import React, { useRef } from 'react';
import styles from './../styles/Donations.module.scss';
import EmailIcon from '../../../../public/assets/images/icons/share/Email';
import EmailSolid from '../../../../public/assets/images/icons/share/EmailSolid';
import FacebookIcon from '../../../../public/assets/images/icons/share/Facebook';
import TwitterIcon from '../../../../public/assets/images/icons/share/Twitter';
import DownloadIcon from '../../../../public/assets/images/icons/share/Download';
import DownloadSolid from '../../../../public/assets/images/icons/share/DownloadSolid';
import InstagramIcon from '../../../../public/assets/images/icons/share/Instagram';
import tenantConfig from '../../../../tenant.config';
import ReactDOM from 'react-dom';
import domtoimage from 'dom-to-image';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;

interface ShareOptionsProps {
  treeCount: String;
  sendRef: any;
  handleTextCopiedSnackbarOpen: Function
  donor: Object
}
const ShareOptions = ({
  treeCount,
  sendRef,
  handleTextCopiedSnackbarOpen,
  donor,
}: ShareOptionsProps) => {
  const { t, ready } = useTranslation(['donate']);
  const config = tenantConfig();

  const titleToShare = ready ? t('donate:titleToShare') : '';
  const urlToShare = config.tenantURL;
  const linkToShare = config.tenantURL;
  let textToShare = '';
  // donor may be undefined or empty for legacy donations or redeem
  if (donor && (donor.name)) {
    textToShare = ready ? t('donate:textToShareLinkedin', { name: `${donor.name}` }) : '';
  } else {
    textToShare = ready ? t('donate:textToShareForMe') : '';
  }

  const exportComponent = (node, fileName, backgroundColor, type) => {
    const element = ReactDOM.findDOMNode(node.current);
    const options = {
      quality: 1,
    };
    domtoimage
      .toJpeg(element, options)
      .then((dataUrl) => {
        domtoimage.toJpeg(element, options).then((dataUrl) => {
          domtoimage.toJpeg(element, options).then((dataUrl) => {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            link.click();
          });
        });
      })
      .catch(function (error) {
        console.error('Image cannot be downloaded', error);
      });
  };

  const exportComponentAsJPEG = (
    node,
    fileName = `My_${treeCount}_tree_donation.jpeg`,
    backgroundColor = null,
    type = 'image/jpeg'
  ) => {
    return exportComponent(node, fileName, backgroundColor, type);
  };

  const openWindowLinks = (shareUrl) => {
    window.open(shareUrl, '_blank');
  };

  const [currentHover, setCurrentHover] = React.useState(-1);

  const shareClicked = async (shareUrl) => {
    openWindowLinks(shareUrl);
  };

  return ready ? (
    <div
      className={styles.shareRow}
      onMouseOut={() => setCurrentHover(-1)}
      style={{ cursor: 'pointer' }}
    >
      <button id={'shareButton'}
        className={styles.shareIcon}
        onClick={() => {
          if (sendRef) {
            exportComponentAsJPEG(
              sendRef(),
              `My_${treeCount}_tree_donation.jpeg`
            );
          }
        }}
        onMouseOver={() => setCurrentHover(1)}
      >
        {currentHover === 1 ? (
          <DownloadSolid color={styles.blueishGrey} />
        ) : (
          <DownloadIcon color={styles.blueishGrey} />
        )}
      </button>

      <button id={'shareFacebook'}
        className={styles.shareIcon}
        onClick={() =>
          shareClicked(
            `https://www.facebook.com/sharer.php?u=${urlToShare}&quote=${textToShare}&hashtag=%23StopTalkingStartPlanting`,
            '_blank'
          )
        }
        onMouseOver={() => setCurrentHover(2)}
      >
        <FacebookIcon
          color={currentHover === 2 ? '#3b5998' : styles.blueishGrey}
        />
      </button>

      <button id={'shareInstagram'}
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(3)}
        onClick={() =>
          shareClicked(`https://www.instagram.com/plantfortheplanet_official/`)
        }
      >
        <InstagramIcon
          color={currentHover === 3 ? '#dd217b' : styles.blueishGrey}
        />
      </button>

      <button id={'shareTwitter'}
        className={styles.shareIcon}
        onMouseOver={() => setCurrentHover(4)}
        onClick={() =>
          shareClicked(`https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=PftP_int&url=${linkToShare}&text=${textToShare}`)
        }
      >
        <TwitterIcon
          color={currentHover === 4 ? '#00acee' : styles.blueishGrey}
        />
      </button>

      <button id={'shareMail'}
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
      </button>
    </div>
  ) : null;
};

export default ShareOptions;
